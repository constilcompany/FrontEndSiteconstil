import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackGAPageView } from '../utils/analytics';
import { trackGAEvent } from '../lib/analytics';
import {
  getGA4VisitorParams,
  getVisitorContextSync,
  recordNavigationBreadcrumb,
  fetchGeoLocation,
} from '../lib/visitorContext';

const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

const PRIMARY_CTA_REGEX =
  /\b(get started|watch demo|launch app \/ sign up|launch app|view all plans|sign up|unlock free test credits|free test credits)\b/i;

export const usePageTracking = (hasConsent: boolean) => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const currentPathRef = useRef<string>(currentPath);
  const pageStartTimeRef = useRef<number>(Date.now());
  const trackedPathRef = useRef<string>('');
  const maxScrollPercentRef = useRef<number>(0);
  const reachedMilestonesRef = useRef<Set<number>>(new Set());
  const startedFormsRef = useRef<Set<string>>(new Set());

  // Background warm-up of geo location cache
  useEffect(() => {
    fetchGeoLocation().catch(() => {});
  }, []);

  // 1. Page View, Journey Flow (page_navigation), and Dwell Time on Navigation
  useEffect(() => {
    // Record journey breadcrumbs for internal lead forensics
    recordNavigationBreadcrumb(currentPath);

    if (!hasConsent) {
      trackedPathRef.current = '';
      return;
    }

    const prevPath = currentPathRef.current;
    const now = Date.now();

    // If navigating from a previous path to a new path, record dwell time & journey flow
    if (trackedPathRef.current && trackedPathRef.current !== currentPath) {
      const durationSeconds = Math.round((now - pageStartTimeRef.current) / 1000);
      const scrollDepth = maxScrollPercentRef.current;
      const visitor = getVisitorContextSync();

      if (durationSeconds > 0) {
        trackGAEvent('page_dwell_time', {
          page_path: prevPath,
          duration_seconds: durationSeconds,
          ...getGA4VisitorParams(),
        });
      }

      // Requirement 3: Emit journey & page flow tracking event
      trackGAEvent('page_navigation', {
        from_path: prevPath,
        to_path: currentPath,
        dwell_time_seconds: durationSeconds,
        scroll_depth_percent: scrollDepth,
        is_new_visitor: visitor.is_new_user,
        referrer: visitor.referrer,
        ...getGA4VisitorParams(),
      });

      // Reset trackers for the new page
      pageStartTimeRef.current = now;
      currentPathRef.current = currentPath;
      maxScrollPercentRef.current = 0;
      reachedMilestonesRef.current.clear();
      startedFormsRef.current.clear();
    }

    if (trackedPathRef.current !== currentPath) {
      trackedPathRef.current = currentPath;
      currentPathRef.current = currentPath;

      // Small delay (100ms) ensures React Helmet has updated document.title
      const timer = setTimeout(() => {
        trackGAPageView(currentPath, document.title, getGA4VisitorParams());
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentPath, hasConsent]);

  // 2. Dwell Time on Tab Close / Page Unload
  useEffect(() => {
    if (!hasConsent) return;

    const emitDwellTime = () => {
      const now = Date.now();
      const durationSeconds = Math.round((now - pageStartTimeRef.current) / 1000);
      if (durationSeconds > 0) {
        trackGAEvent('page_dwell_time', {
          page_path: currentPathRef.current,
          duration_seconds: durationSeconds,
          ...getGA4VisitorParams(),
        });
        pageStartTimeRef.current = now;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        emitDwellTime();
      } else {
        pageStartTimeRef.current = Date.now();
      }
    };

    window.addEventListener('beforeunload', emitDwellTime);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', emitDwellTime);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasConsent]);

  // 3. Scroll Depth Tracking (25%, 50%, 75%, 90%)
  useEffect(() => {
    if (!hasConsent) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight =
          document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (scrollHeight > 0) {
          const percent = Math.round((scrollTop / scrollHeight) * 100);
          maxScrollPercentRef.current = Math.max(maxScrollPercentRef.current, percent);

          for (const milestone of SCROLL_MILESTONES) {
            if (percent >= milestone && !reachedMilestonesRef.current.has(milestone)) {
              reachedMilestonesRef.current.add(milestone);
              trackGAEvent('scroll_milestone', {
                percent: milestone,
                page_path: currentPathRef.current,
                ...getGA4VisitorParams(),
              });
            }
          }
        }
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasConsent, currentPath]);

  // 4. Form Interactions (form_start) & Primary CTA Clicks (cta_button_click)
  useEffect(() => {
    if (!hasConsent) return;

    // Detect when user focuses inside any form input for the first time
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      // Identify the enclosing form or modal
      const formEl = target.closest('form');
      const modalEl = target.closest('[role="dialog"]');
      const chatWidgetEl = target.closest('#constil-salesbot-widget, [data-widget="salesbot"]');

      let formName = 'lead_form';
      let formId = 'unnamed_form';

      if (formEl) {
        formId = formEl.id || formEl.getAttribute('name') || 'form';
        formName = formEl.getAttribute('name') || formEl.id || (formEl.action ? 'contact_page' : 'standard_form');
      } else if (modalEl) {
        formId = 'lead_modal';
        formName = 'lead_modal';
      } else if (chatWidgetEl) {
        formId = 'salesbot_inline_form';
        formName = 'salesbot';
      }

      const formKey = `${currentPathRef.current}:${formId}`;
      if (!startedFormsRef.current.has(formKey)) {
        startedFormsRef.current.add(formKey);
        trackGAEvent('form_start', {
          form_name: formName,
          form_id: formId,
          page_path: currentPathRef.current,
          ...getGA4VisitorParams(),
        });
      }
    };

    // Detect clicks on primary CTA buttons
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        'button, a, [role="button"]'
      );
      if (!target) return;

      const buttonText = (target.textContent || target.getAttribute('aria-label') || '').trim();
      const isExplicitCta = target.hasAttribute('data-cta');
      const isRegexCta = PRIMARY_CTA_REGEX.test(buttonText);

      if (isExplicitCta || isRegexCta) {
        let destination = 'action';

        if (target.tagName === 'A' && (target as HTMLAnchorElement).href) {
          destination = (target as HTMLAnchorElement).href;
        } else if (target.getAttribute('data-href')) {
          destination = target.getAttribute('data-href') || 'action';
        } else if (/demo/i.test(buttonText)) {
          destination = 'demo_modal';
        } else if (/started/i.test(buttonText)) {
          destination = 'signup_or_contact';
        } else if (/plan/i.test(buttonText)) {
          destination = 'pricing_page';
        }

        trackGAEvent('cta_button_click', {
          button_text: buttonText,
          destination,
          page_path: currentPathRef.current,
          ...getGA4VisitorParams(),
        });
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [hasConsent]);
};
