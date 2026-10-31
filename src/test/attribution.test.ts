import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  extractAttributionFromUrl,
  getStoredAttribution,
  storeAttribution,
  decorateUrlWithAttribution,
  isConstilAppUrl,
  initAttribution,
  AttributionData,
} from '../utils/attribution';
import {
  initConsentDefaults,
  initGA4,
  trackGAPageView,
  trackGASignupStarted,
  GA_MEASUREMENT_ID,
} from '../utils/analytics';
import { getMetaCookies } from '../utils/pixel';

describe('CONSTIL Attribution & Cross-Subdomain Tracking Suite', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Clear storage and cookies before each test
    window.sessionStorage.clear();
    window.localStorage.clear();
    document.cookie = 'constil_utm=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_fbp=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_fbc=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    delete window.dataLayer;
    delete window.gtag;
    delete window[`ga-disable-${GA_MEASUREMENT_ID}`];
  });

  afterEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    document.cookie = 'constil_utm=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_fbp=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_fbc=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  describe('1. UTM Parameter & Campaign Extraction', () => {
    it('accurately captures campaign constil_usa_traffic_oct2026 with fb and paid_social', () => {
      const search =
        '?utm_source=fb&utm_medium=paid_social&utm_campaign=constil_usa_traffic_oct2026&utm_content=blueprint_ai&utm_term=estimating_software&fbclid=IwAR123456789';

      const attribution = extractAttributionFromUrl(search);

      expect(attribution.utm_source).toBe('fb');
      expect(attribution.utm_medium).toBe('paid_social');
      expect(attribution.utm_campaign).toBe('constil_usa_traffic_oct2026');
      expect(attribution.utm_content).toBe('blueprint_ai');
      expect(attribution.utm_term).toBe('estimating_software');
      expect(attribution.fbclid).toBe('IwAR123456789');
    });

    it('accurately captures ig (Instagram) source with paid_social', () => {
      const search =
        '?utm_source=ig&utm_medium=paid_social&utm_campaign=constil_usa_traffic_oct2026&fbclid=IwAR987654321';

      const attribution = extractAttributionFromUrl(search);

      expect(attribution.utm_source).toBe('ig');
      expect(attribution.utm_medium).toBe('paid_social');
      expect(attribution.utm_campaign).toBe('constil_usa_traffic_oct2026');
      expect(attribution.fbclid).toBe('IwAR987654321');
    });

    it('returns empty object when no attribution parameters are present', () => {
      expect(extractAttributionFromUrl('')).toEqual({});
      expect(extractAttributionFromUrl('?page=1&sort=desc')).toEqual({});
    });
  });

  describe('2. Attribution Persistence Across Sessions & Storage', () => {
    it('persists attribution into sessionStorage, localStorage, and cookies', () => {
      const campaignData: AttributionData = {
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
        fbclid: 'IwARTestPersistence',
      };

      storeAttribution(campaignData);

      const stored = getStoredAttribution();
      expect(stored.utm_source).toBe('fb');
      expect(stored.utm_medium).toBe('paid_social');
      expect(stored.utm_campaign).toBe('constil_usa_traffic_oct2026');
      expect(stored.fbclid).toBe('IwARTestPersistence');
      expect(stored.first_touch_timestamp).toBeDefined();
      expect(stored.last_touch_timestamp).toBeDefined();

      // Check cookie presence
      expect(document.cookie).toContain('constil_utm=');
    });

    it('retains attribution parameters when navigating to pages without query strings', () => {
      // Step 1: User arrives with campaign parameters on landing page
      const landingData: AttributionData = {
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
      };
      storeAttribution(landingData);

      // Step 2: User navigates internally to /estimates-software (window.location.search is empty)
      const restored = getStoredAttribution();
      expect(restored.utm_campaign).toBe('constil_usa_traffic_oct2026');
      expect(restored.utm_source).toBe('fb');
      expect(restored.utm_medium).toBe('paid_social');
    });
  });

  describe('3. Cross-Subdomain Attribution (constil.com -> app.constil.com)', () => {
    it('decorates app.constil.com signup URLs with active campaign parameters', () => {
      const campaignData: AttributionData = {
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
        fbclid: 'IwAROutboundLink',
      };
      storeAttribution(campaignData);

      const targetUrl = 'https://app.constil.com/signup';
      const decorated = decorateUrlWithAttribution(targetUrl);

      expect(decorated).toContain('https://app.constil.com/signup?');
      expect(decorated).toContain('utm_source=fb');
      expect(decorated).toContain('utm_medium=paid_social');
      expect(decorated).toContain('utm_campaign=constil_usa_traffic_oct2026');
      expect(decorated).toContain('fbclid=IwAROutboundLink');
    });

    it('preserves existing query parameters on target URL without overwriting them', () => {
      const campaignData: AttributionData = {
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
      };
      storeAttribution(campaignData);

      const targetUrl = 'https://app.constil.com/signup?plan=contractor_pro&billing=annual';
      const decorated = decorateUrlWithAttribution(targetUrl);

      expect(decorated).toContain('plan=contractor_pro');
      expect(decorated).toContain('billing=annual');
      expect(decorated).toContain('utm_source=fb');
      expect(decorated).toContain('utm_campaign=constil_usa_traffic_oct2026');
    });

    it('does not decorate external third-party URLs to avoid leaking attribution', () => {
      const campaignData: AttributionData = {
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
      };
      storeAttribution(campaignData);

      const thirdPartyUrl = 'https://google.com/search?q=constil';
      const decorated = decorateUrlWithAttribution(thirdPartyUrl);

      expect(decorated).toBe(thirdPartyUrl);
      expect(decorated).not.toContain('utm_source');
    });

    it('validates isConstilAppUrl correctly', () => {
      expect(isConstilAppUrl('https://app.constil.com/signup')).toBe(true);
      expect(isConstilAppUrl('https://constil.com/pricing')).toBe(true);
      expect(isConstilAppUrl('/signup')).toBe(true);
      expect(isConstilAppUrl('http://localhost:5173/')).toBe(true);
      expect(isConstilAppUrl('https://malicious-constil.com/')).toBe(false);
      expect(isConstilAppUrl('https://facebook.com/')).toBe(false);
    });
  });

  describe('4. Meta Pixel & CAPI Identifier Coordination (_fbp / _fbc)', () => {
    it('generates and persists compliant _fbp cookie if not yet set by fbevents.js', () => {
      const cookies = getMetaCookies();

      expect(cookies.fbp).toBeDefined();
      expect(cookies.fbp).toMatch(/^fb\.1\.\d+\.\d+$/);
      // Confirms cookie was persisted into document.cookie
      expect(document.cookie).toContain('_fbp=');
    });

    it('extracts fbclid from stored attribution when window.location.search is clean', () => {
      storeAttribution({
        fbclid: 'IwARStoredClickId',
      });

      const cookies = getMetaCookies();
      expect(cookies.fbc).toBeDefined();
      expect(cookies.fbc).toContain('fb.1.');
      expect(cookies.fbc).toContain('IwARStoredClickId');
    });
  });

  describe('5. GA4 Campaign Attribution Enrichment', () => {
    it('enriches GA4 page_view events with active campaign constil_usa_traffic_oct2026', () => {
      initConsentDefaults();
      initGA4(true, true);

      storeAttribution({
        utm_source: 'fb',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
        utm_content: 'ai_estimating',
      });

      trackGAPageView('/smart-construction', 'Smart Construction');

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const pageViewCall = dataLayerEvents.find(
        (args) => args[0] === 'event' && args[1] === 'page_view'
      );

      expect(pageViewCall).toBeDefined();
      const params = pageViewCall?.[2];

      expect(params).toMatchObject({
        page_path: '/smart-construction',
        send_to: GA_MEASUREMENT_ID,
        campaign: 'constil_usa_traffic_oct2026',
        source: 'fb',
        medium: 'paid_social',
        content: 'ai_estimating',
      });
    });

    it('enriches GA4 signup_started with active campaign attribution', () => {
      initConsentDefaults();
      initGA4(true, true);

      storeAttribution({
        utm_source: 'ig',
        utm_medium: 'paid_social',
        utm_campaign: 'constil_usa_traffic_oct2026',
      });

      trackGASignupStarted({ cta_name: 'hero_free_trial' });

      const dataLayerEvents = Array.from(window.dataLayer || []).map((args) =>
        Array.from(args)
      );
      const signupStartedCall = dataLayerEvents.find(
        (args) => args[0] === 'event' && args[1] === 'signup_started'
      );

      expect(signupStartedCall).toBeDefined();
      const params = signupStartedCall?.[2];

      expect(params).toMatchObject({
        send_to: GA_MEASUREMENT_ID,
        cta_name: 'hero_free_trial',
        campaign: 'constil_usa_traffic_oct2026',
        source: 'ig',
        medium: 'paid_social',
      });
    });
  });
});

