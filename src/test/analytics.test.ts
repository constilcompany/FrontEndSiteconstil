import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initConsentDefaults,
  initGA4,
  updateGA4Consent,
  trackGAPageView,
  trackGAGenerateLead,
  trackGAEvent,
  GA_MEASUREMENT_ID,
} from '../utils/analytics';
import {
  getVisitorContextSync,
  getGA4VisitorParams,
  getFullForensicLeadPayload,
  recordNavigationBreadcrumb,
  getNavigationHistory,
} from '../lib/visitorContext';

describe('Google Analytics 4 (GA4) Production Readiness Audit', () => {
  beforeEach(() => {
    // Reset window state before each test
    delete window.dataLayer;
    delete window.gtag;
    delete window[`ga-disable-${GA_MEASUREMENT_ID}`];

    // Remove any injected scripts
    const scripts = document.querySelectorAll(
      `script[src*="googletagmanager.com/gtag/js"]`
    );
    scripts.forEach((s) => s.remove());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1 & 3. Default Consent Mode v2 and Advertising Permissions Gating', () => {
    it('sets all Google Consent Mode v2 defaults to denied and disables GA4 by default', () => {
      initConsentDefaults();

      expect(window[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);
      expect(window.dataLayer).toBeDefined();

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const defaultConsent = dataLayerEvents.find(
        (args) => args[0] === 'consent' && args[1] === 'default'
      );

      expect(defaultConsent).toBeDefined();
      expect(defaultConsent?.[2]).toEqual({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    });

    it('does not grant advertising permissions when only analytics consent is granted', () => {
      initConsentDefaults();
      initGA4(true, false); // User granted analytics consent, but not advertising consent

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const updateConsent = dataLayerEvents.find(
        (args) => args[0] === 'consent' && args[1] === 'update'
      );

      expect(updateConsent).toBeDefined();
      expect(updateConsent?.[2]).toEqual({
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    });

    it('grants advertising permissions only when explicit advertising consent is true', () => {
      initConsentDefaults();
      initGA4(true, true); // User granted both analytics and advertising consent

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const updateConsent = dataLayerEvents.find(
        (args) => args[0] === 'consent' && args[1] === 'update'
      );

      expect(updateConsent).toBeDefined();
      expect(updateConsent?.[2]).toEqual({
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    });
  });

  describe('1. No Tracking Before Analytics Consent', () => {
    it('does not inject script or fire tracking events if hasConsent is false', () => {
      initConsentDefaults();
      initGA4(false);

      const script = document.querySelector(
        `script[src*="googletagmanager.com/gtag/js"]`
      );
      expect(script).toBeNull();
      expect(window[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);

      const countBefore = (window.dataLayer || []).length;
      trackGAPageView('/invoices-management-software', 'Invoices Management');
      trackGAGenerateLead({ form_name: 'contact_form' });
      expect((window.dataLayer || []).length).toBe(countBefore);
    });
  });

  describe('2. Revoking / Withdrawing Consent', () => {
    it('disables GA4 via ga-disable flag and denies all consent permissions on withdrawal', () => {
      initConsentDefaults();
      initGA4(true);
      expect(window[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(false);

      updateGA4Consent(false);
      expect(window[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const latestUpdate = [...dataLayerEvents]
        .reverse()
        .find((args) => args[0] === 'consent' && args[1] === 'update');

      expect(latestUpdate).toBeDefined();
      expect(latestUpdate?.[2]).toEqual({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });

      // Confirm events are blocked after withdrawal
      const countBefore = (window.dataLayer || []).length;
      trackGAPageView('/contact', 'Contact Us');
      trackGAGenerateLead();
      expect((window.dataLayer || []).length).toBe(countBefore);
    });
  });

  describe('4. Single Page Application Page View & Duplicate Prevention', () => {
    it('configures gtag with send_page_view: false to prevent automatic duplicate page view', () => {
      initConsentDefaults();
      initGA4(true);

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const configCall = dataLayerEvents.find(
        (args) => args[0] === 'config' && args[1] === GA_MEASUREMENT_ID
      );

      expect(configCall).toBeDefined();
      expect(configCall?.[2]).toMatchObject({ send_page_view: false });
    });

    it('tracks client-side page views with exact path, title, and target ID', () => {
      initConsentDefaults();
      initGA4(true);

      trackGAPageView('/estimates-software', 'Estimates Software - Constil');

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const pageViewCall = dataLayerEvents.find(
        (args) => args[0] === 'event' && args[1] === 'page_view'
      );

      expect(pageViewCall).toBeDefined();
      expect(pageViewCall?.[2]).toMatchObject({
        page_path: '/estimates-software',
        page_title: 'Estimates Software - Constil',
        send_to: GA_MEASUREMENT_ID,
      });
    });
  });

  describe('5 & 9. Lead Generation Event & PII Protection', () => {
    it('sends generate_lead event without personal identifiable information (PII)', () => {
      initConsentDefaults();
      initGA4(true);

      trackGAGenerateLead({
        form_name: 'contact_form',
      });

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const leadCall = dataLayerEvents.find(
        (args) => args[0] === 'event' && args[1] === 'generate_lead'
      );

      expect(leadCall).toBeDefined();
      const params = leadCall?.[2];

      expect(params).toMatchObject({
        form_name: 'contact_form',
        send_to: GA_MEASUREMENT_ID,
      });

      // Verify no PII fields exist
      expect(params).not.toHaveProperty('email');
      expect(params).not.toHaveProperty('phone');
      expect(params).not.toHaveProperty('firstName');
      expect(params).not.toHaveProperty('lastName');
      expect(params).not.toHaveProperty('phoneNumber');
    });
  });

  describe('7 & 8. Measurement ID Validation', () => {
    it('uses the active production measurement ID G-E16MPY5M0L', () => {
      expect(GA_MEASUREMENT_ID).toBe('G-E16MPY5M0L');
    });
  });

  describe('9. Centralized trackGAEvent and Comprehensive Event Emitters', () => {
    it('safely calls window.gtag("event", ...) when gtag is available', () => {
      initConsentDefaults();
      initGA4(true);

      const gtagSpy = vi.fn();
      window.gtag = gtagSpy;

      trackGAEvent('page_dwell_time', {
        page_path: '/estimates-software',
        duration_seconds: 45,
      });

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'page_dwell_time',
        expect.objectContaining({
          page_path: '/estimates-software',
          duration_seconds: 45,
          send_to: GA_MEASUREMENT_ID,
        })
      );
    });

    it('emits lead_form_submitted for all form sources', () => {
      initConsentDefaults();
      initGA4(true);

      const gtagSpy = vi.fn();
      window.gtag = gtagSpy;

      trackGAEvent('lead_form_submitted', { form_name: 'lead_modal' });
      trackGAEvent('lead_form_submitted', { form_name: 'salesbot' });
      trackGAEvent('lead_form_submitted', { form_name: 'contact_page' });

      expect(gtagSpy).toHaveBeenCalledTimes(3);
      expect(gtagSpy).toHaveBeenNthCalledWith(1, 'event', 'lead_form_submitted', expect.objectContaining({ form_name: 'lead_modal' }));
      expect(gtagSpy).toHaveBeenNthCalledWith(2, 'event', 'lead_form_submitted', expect.objectContaining({ form_name: 'salesbot' }));
      expect(gtagSpy).toHaveBeenNthCalledWith(3, 'event', 'lead_form_submitted', expect.objectContaining({ form_name: 'contact_page' }));
    });

    it('emits scroll_milestone events correctly', () => {
      initConsentDefaults();
      initGA4(true);

      const gtagSpy = vi.fn();
      window.gtag = gtagSpy;

      trackGAEvent('scroll_milestone', { percent: 50, page_path: '/' });

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'scroll_milestone',
        expect.objectContaining({
          percent: 50,
          page_path: '/',
        })
      );
    });

    it('emits cta_button_click and form_start events correctly', () => {
      initConsentDefaults();
      initGA4(true);

      const gtagSpy = vi.fn();
      window.gtag = gtagSpy;

      trackGAEvent('cta_button_click', {
        button_text: 'Get Started',
        destination: 'signup_or_contact',
        page_path: '/',
      });

      trackGAEvent('form_start', {
        form_name: 'lead_modal',
        form_id: 'lead_modal',
        page_path: '/',
      });

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'cta_button_click',
        expect.objectContaining({
          button_text: 'Get Started',
          destination: 'signup_or_contact',
        })
      );

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'form_start',
        expect.objectContaining({
          form_name: 'lead_modal',
        })
      );
    });

    it('does not emit events when user consent is revoked / disabled', () => {
      initConsentDefaults();
      initGA4(false);

      const gtagSpy = vi.fn();
      window.gtag = gtagSpy;

      trackGAEvent('cta_button_click', { button_text: 'Get Started' });
      expect(gtagSpy).not.toHaveBeenCalled();
    });
  });

  describe('Deep Visitor Forensics & Journey Tracking', () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it('persists a unique visitor_id across calls and detects new vs returning visitors', () => {
      // First visit
      const ctx1 = getVisitorContextSync();
      expect(ctx1.visitor_id).toBeDefined();
      expect(ctx1.is_new_user).toBe(true);
      expect(ctx1.session_count).toBe(1);

      // Subsequent call in the same session
      const ctx2 = getVisitorContextSync();
      expect(ctx2.visitor_id).toBe(ctx1.visitor_id);
      expect(ctx2.is_new_user).toBe(false); // Already stored
      expect(ctx2.session_count).toBe(1);
    });

    it('tracks journey breadcrumbs without immediate duplicate repeats', () => {
      recordNavigationBreadcrumb('/');
      recordNavigationBreadcrumb('/services');
      recordNavigationBreadcrumb('/services'); // should not duplicate
      recordNavigationBreadcrumb('/pricing');
      recordNavigationBreadcrumb('/contact');

      const history = getNavigationHistory();
      expect(history).toEqual(['/', '/services', '/pricing', '/contact']);
    });

    it('ensures getGA4VisitorParams complies with Google Analytics TOS by NOT including raw IP address', () => {
      sessionStorage.setItem('constil_geo_cache', JSON.stringify({
        ip_address: '198.51.100.42',
        city: 'Dallas',
        region: 'Texas',
        country: 'United States',
      }));

      const gaParams = getGA4VisitorParams();

      // STRICT PRIVACY CHECK: raw IP must never be passed to GA4
      expect(gaParams).not.toHaveProperty('ip_address');
      expect(gaParams).not.toHaveProperty('ip');
      expect(gaParams.geo_city).toBe('Dallas');
      expect(gaParams.geo_country).toBe('United States');
      expect(gaParams.visitor_id).toBeDefined();
    });

    it('getFullForensicLeadPayload returns complete internal forensics including IP and breadcrumbs', async () => {
      sessionStorage.setItem('constil_geo_cache', JSON.stringify({
        ip_address: '203.0.113.195',
        city: 'Chicago',
        region: 'Illinois',
        country: 'United States',
        asn_org: 'AS15169 Google LLC',
      }));

      recordNavigationBreadcrumb('/');
      recordNavigationBreadcrumb('/pricing');

      const leadPayload = await getFullForensicLeadPayload();

      expect(leadPayload.ip_address).toBe('203.0.113.195');
      expect(leadPayload.city).toBe('Chicago');
      expect(leadPayload.country).toBe('United States');
      expect(leadPayload.navigation_history).toEqual(['/', '/pricing']);
      expect(leadPayload.visitor_id).toBeDefined();
      expect(leadPayload.screen_resolution).toBeDefined();
    });

    it('emits page_navigation event with journey and dwell metadata', () => {
      initConsentDefaults();
      initGA4(true);

      const gtagSpy = vi.fn();
      window.gtag = gtagSpy;

      trackGAEvent('page_navigation', {
        from_path: '/',
        to_path: '/pricing',
        dwell_time_seconds: 42,
        scroll_depth_percent: 75,
        is_new_visitor: true,
        referrer: 'https://google.com',
      });

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'page_navigation',
        expect.objectContaining({
          from_path: '/',
          to_path: '/pricing',
          dwell_time_seconds: 42,
          scroll_depth_percent: 75,
          is_new_visitor: true,
        })
      );
    });
  });
});
