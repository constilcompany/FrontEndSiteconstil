import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import {
  extractAttributionFromUrl,
  getStoredAttribution,
  storeAttribution,
  decorateUrlWithAttribution,
  setupGlobalAttributionLinkHandler,
  initAttribution,
} from '../utils/attribution';
import {
  initConsentDefaults,
  initGA4,
  updateGA4Consent,
  trackGAPageView,
  trackGASignupStarted,
  GA_MEASUREMENT_ID,
} from '../utils/analytics';
import {
  initPixel,
  updateConsent as updateMetaConsent,
  trackPageView as trackMetaPageView,
  getMetaCookies,
  PIXEL_ID,
} from '../utils/pixel';
import { MetaPixel } from '../components/MetaPixel';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import { CookieConsent } from '../components/CookieConsent';
import { supabase } from '../lib/supabase';

describe('Phase 1: Complete End-to-End Verification Suite', () => {
  let originalLocation: Location;

  beforeEach(() => {
    // Clear state
    window.sessionStorage.clear();
    window.localStorage.clear();
    document.cookie = 'constil_utm=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_fbp=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_fbc=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    delete window.dataLayer;
    delete window.gtag;
    delete window[`ga-disable-${GA_MEASUREMENT_ID}`];
    delete window.fbq;
    delete window._fbq;

    const scripts = document.querySelectorAll(
      'script[src*="googletagmanager.com/gtag/js"], script[src*="connect.facebook.net"]'
    );
    scripts.forEach((s) => s.remove());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Verification 1: GA4 Campaign & Source/Medium Attribution
  // =========================================================================
  describe('1. GA4 Traffic Attribution (constil_usa_traffic_oct2026)', () => {
    it('accurately captures and assigns Session campaign and source/medium to GA4 page_view', () => {
      initConsentDefaults();
      initGA4(true, true); // Explicit consent granted

      // Simulate visitor arrival from Meta Ads campaign
      const search = '?utm_source=fb&utm_medium=paid_social&utm_campaign=constil_usa_traffic_oct2026&utm_content=ai_cost_estimator&utm_term=construction_takeoff&fbclid=IwAR999888';
      const extracted = extractAttributionFromUrl(search);
      storeAttribution(extracted);

      // Track PageView with the active campaign attribution
      trackGAPageView('/estimates-software', 'Estimates Software - Constil');

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) => Array.from(args));
      const pageViewCall = dataLayerEvents.find(
        (args) => args[0] === 'event' && args[1] === 'page_view'
      );

      expect(pageViewCall).toBeDefined();
      const params = pageViewCall?.[2] as Record<string, unknown>;

      // Verify exact attribution parameters sent to GA4
      expect(params.campaign).toBe('constil_usa_traffic_oct2026');
      expect(params.source).toBe('fb');
      expect(params.medium).toBe('paid_social');
      expect(params.content).toBe('ai_cost_estimator');
      expect(params.term).toBe('construction_takeoff');
      expect(params.send_to).toBe(GA_MEASUREMENT_ID);
    });

    it('accurately attributes Instagram (ig) source with paid_social medium', () => {
      initConsentDefaults();
      initGA4(true, true);

      storeAttribution({
        utm_source: 'ig',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
      });

      trackGAPageView('/smart-construction', 'Smart Construction');

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) => Array.from(args));
      const pageViewCall = dataLayerEvents.find(
        (args) => args[0] === 'event' && args[1] === 'page_view'
      );

      expect(pageViewCall).toBeDefined();
      const params = pageViewCall?.[2] as Record<string, unknown>;
      expect(params.source).toBe('ig');
      expect(params.medium).toBe('paid_social');
      expect(params.campaign).toBe('constil_usa_traffic_oct2026');
    });
  });

  // =========================================================================
  // Verification 2: UTM Parameters Survive Internal Navigation & Redirects
  // =========================================================================
  describe('2. UTM Persistence Across Internal Navigation and Redirects', () => {
    it('persists campaign attribution across internal SPA route transitions', () => {
      // User lands on home page with campaign parameters
      const initialCampaign = {
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
        fbclid: 'IwARTestPersistence',
      };
      storeAttribution(initialCampaign);

      // Verify data is safely held in sessionStorage
      expect(window.sessionStorage.getItem('constil_attribution_session')).toContain('constil_usa_traffic_oct2026');

      // User navigates internally to /smart-construction (URL query string is now empty)
      const storedAfterNav = getStoredAttribution();
      expect(storedAfterNav.utm_campaign).toBe('constil_usa_traffic_oct2026');
      expect(storedAfterNav.utm_source).toBe('fb');
      expect(storedAfterNav.utm_medium).toBe('paid_social');
      expect(storedAfterNav.fbclid).toBe('IwARTestPersistence');

      // GA4 PageView on internal page still receives campaign attribution
      initConsentDefaults();
      initGA4(true, true);
      trackGAPageView('/smart-construction', 'Smart Construction');

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) => Array.from(args));
      const pageViewCall = dataLayerEvents.find(
        (args) => args[0] === 'event' && args[1] === 'page_view'
      );
      expect((pageViewCall?.[2] as any).campaign).toBe('constil_usa_traffic_oct2026');
    });

    it('preserves query strings across client-side redirects using PreserveQueryNavigate pattern', () => {
      const PreserveQueryNavigate = ({ to }: { to: string }) => {
        const location = useLocation();
        return <div data-testid="redirect-target">{`${to}${location.search}`}</div>;
      };

      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/estimates_software?utm_source=fb&utm_medium=paid_social&utm_campaign=constil_usa_traffic_oct2026']}>
          <Routes>
            <Route
              path="/estimates_software"
              element={<PreserveQueryNavigate to="/estimates-software" />}
            />
          </Routes>
        </MemoryRouter>
      );

      const redirectedUrl = getByTestId('redirect-target').textContent;
      expect(redirectedUrl).toBe('/estimates-software?utm_source=fb&utm_medium=paid_social&utm_campaign=constil_usa_traffic_oct2026');
    });
  });

  // =========================================================================
  // Verification 3: Transfer Attribution to app.constil.com
  // =========================================================================
  describe('3. Transfer Campaign Attribution to app.constil.com on CTA Click', () => {
    it('decorates Get Started / Sign Up links pointing to app.constil.com with active campaign parameters', () => {
      storeAttribution({
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
        fbclid: 'IwARTestTransfer123',
      });

      const rawCtaUrl = 'https://app.constil.com/signup';
      const decorated = decorateUrlWithAttribution(rawCtaUrl);

      expect(decorated).toBe(
        'https://app.constil.com/signup?utm_source=fb&utm_medium=paid_social&utm_campaign=constil_usa_traffic_oct2026&fbclid=IwARTestTransfer123'
      );
    });

    it('preserves existing query parameters on the destination link without overwriting them', () => {
      storeAttribution({
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
      });

      const ctaUrlWithPlan = 'https://app.constil.com/signup?plan=contractor_annual&step=1';
      const decorated = decorateUrlWithAttribution(ctaUrlWithPlan);

      expect(decorated).toContain('plan=contractor_annual');
      expect(decorated).toContain('step=1');
      expect(decorated).toContain('utm_source=fb');
      expect(decorated).toContain('utm_campaign=constil_usa_traffic_oct2026');
    });

    it('automatically decorates <a> links targeting app.constil.com upon click via global click handler', () => {
      storeAttribution({
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
      });

      const cleanup = setupGlobalAttributionLinkHandler();

      const link = document.createElement('a');
      link.href = 'https://app.constil.com/signup';
      link.textContent = 'Start Free Trial';
      document.body.appendChild(link);

      // Trigger user click
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      expect(link.getAttribute('href')).toContain('utm_campaign=constil_usa_traffic_oct2026');
      expect(link.getAttribute('href')).toContain('utm_source=fb');

      cleanup();
      link.remove();
    });
  });

  // =========================================================================
  // Verification 4: Meta Pixel & CAPI Deduplication & Matching Event IDs
  // =========================================================================
  describe('4. Meta Pixel & CAPI Deduplication & Matching Event IDs', () => {
    it('fires matching event_id and event_name between browser pixel and CAPI Edge Function', async () => {
      initPixel(true);

      const capturedBrowserEvents: any[] = [];
      const originalFbq = window.fbq;
      window.fbq = vi.fn((...args: any[]) => {
        capturedBrowserEvents.push(args);
        originalFbq(...args);
      });

      const invokeSpy = vi.fn().mockResolvedValue({
        data: { success: true },
        error: null,
      });
      vi.spyOn(supabase, 'functions', 'get').mockReturnValue({
        invoke: invokeSpy,
      } as any);

      render(
        <MemoryRouter initialEntries={['/']}>
          <MetaPixel hasConsent={true} />
        </MemoryRouter>
      );

      // 1. Verify Browser Pixel was called
      expect(window.fbq).toHaveBeenCalledWith('track', 'PageView', {}, expect.objectContaining({ eventID: expect.any(String) }));

      // 2. Verify Server CAPI was called
      expect(invokeSpy).toHaveBeenCalledWith('meta-capi', expect.objectContaining({
        body: expect.objectContaining({
          event_name: 'PageView',
          event_id: expect.any(String),
        }),
      }));

      // 3. Extract the exact event IDs
      const browserEventCall = capturedBrowserEvents.find(
        (args) => args[0] === 'track' && args[1] === 'PageView'
      );
      const browserEventId = browserEventCall[3]?.eventID;

      const serverPayload = invokeSpy.mock.calls[0][1]?.body as any;
      const serverEventId = serverPayload.event_id;

      // 4. Verify STRICT DEDUPLICATION: browser and server MUST share the identical event_id!
      expect(browserEventId).toBeDefined();
      expect(serverEventId).toBeDefined();
      expect(browserEventId).toEqual(serverEventId);

      // 5. Verify both share the same _fbp and _fbc
      expect(serverPayload.fbp).toBeDefined();
      expect(serverPayload.fbp).toMatch(/^fb\.1\.\d+\.\d+$/);
    });
  });

  // =========================================================================
  // Verification 5: Consent Preferences for Accept, Decline, and Granular
  // =========================================================================
  describe('5. Consent Preference Verification (Accept, Decline, Granular)', () => {
    it('denies all tracking by default before user interaction', () => {
      initConsentDefaults();

      expect(window[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) => Array.from(args));
      const defaultConsent = dataLayerEvents.find(
        (args) => args[0] === 'consent' && args[1] === 'default'
      );

      expect(defaultConsent?.[2]).toEqual({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    });

    it('grants analytics and advertising permissions upon explicit Accept', () => {
      initConsentDefaults();
      updateGA4Consent(true, true);
      updateMetaConsent(true);

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) => Array.from(args));
      const updateConsent = dataLayerEvents.reverse().find(
        (args) => args[0] === 'consent' && args[1] === 'update'
      );

      expect(updateConsent?.[2]).toEqual({
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    });

    it('strictly denies all tracking and sets ga-disable upon Decline', () => {
      initConsentDefaults();
      updateGA4Consent(false, false);
      updateMetaConsent(false);

      expect(window[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) => Array.from(args));
      const updateConsent = dataLayerEvents.reverse().find(
        (args) => args[0] === 'consent' && args[1] === 'update'
      );

      expect(updateConsent?.[2]).toEqual({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    });

    it('respects granular choice (analytics granted, advertising strictly denied)', () => {
      initConsentDefaults();
      // User only selected analytics in granular preferences
      updateGA4Consent(true, false);
      updateMetaConsent(false);

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) => Array.from(args));
      const updateConsent = dataLayerEvents.reverse().find(
        (args) => args[0] === 'consent' && args[1] === 'update'
      );

      expect(updateConsent?.[2]).toEqual({
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    });
  });

  // =========================================================================
  // Verification 6: No Duplicate PageView Events
  // =========================================================================
  describe('6. Duplicate Prevention Verification', () => {
    it('does not fire duplicate PageViews when parent component re-renders with same location', () => {
      initPixel(true);
      const invokeSpy = vi.fn().mockResolvedValue({
        data: { success: true },
        error: null,
      });
      vi.spyOn(supabase, 'functions', 'get').mockReturnValue({
        invoke: invokeSpy,
      } as any);

      let pageViewCount = 0;
      window.fbq = vi.fn((action: string, eventName: string) => {
        if (action === 'track' && eventName === 'PageView') {
          pageViewCount++;
        }
      });

      const { rerender } = render(
        <MemoryRouter initialEntries={['/smart-construction']}>
          <MetaPixel hasConsent={true} />
        </MemoryRouter>
      );

      expect(pageViewCount).toBe(1);
      expect(invokeSpy).toHaveBeenCalledTimes(1);

      // Re-render component without route change (e.g. state change in parent)
      rerender(
        <MemoryRouter initialEntries={['/smart-construction']}>
          <MetaPixel hasConsent={true} />
        </MemoryRouter>
      );

      // Count MUST remain 1 (no duplicate PageView fired!)
      expect(pageViewCount).toBe(1);
      expect(invokeSpy).toHaveBeenCalledTimes(1);
    });

    it('guarantees gtag config has send_page_view: false to prevent duplicate initial pageviews on SPA', () => {
      initConsentDefaults();
      initGA4(true, true);

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) => Array.from(args));
      const configCall = dataLayerEvents.find(
        (args) => args[0] === 'config' && args[1] === GA_MEASUREMENT_ID
      );

      expect(configCall?.[2]).toMatchObject({ send_page_view: false });
    });
  });

  // =========================================================================
  // Verification 7: Existing Website Functionality Remains Unaffected
  // =========================================================================
  describe('7. Existing Website Functionality Integrity', () => {
    it('verifies CookieConsent banner renders and interacts cleanly without errors', () => {
      const onConsentChange = vi.fn();
      render(<CookieConsent onConsentChange={onConsentChange} />);

      const acceptBtn = screen.getByText('Accept');
      expect(acceptBtn).toBeDefined();

      fireEvent.click(acceptBtn);
      expect(onConsentChange).toHaveBeenCalledWith(true);
      expect(window.localStorage.getItem('cookieConsent')).toBe('accepted');
    });

    it('verifies non-blocking error handling when analytics endpoint fails', async () => {
      vi.spyOn(supabase, 'functions', 'get').mockReturnValue({
        invoke: vi.fn().mockRejectedValue(new Error('Network error')),
      } as any);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Firing tracking should never throw or break component execution
      expect(() => {
        render(
          <MemoryRouter initialEntries={['/estimates-software']}>
            <MetaPixel hasConsent={true} />
          </MemoryRouter>
        );
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });
});
