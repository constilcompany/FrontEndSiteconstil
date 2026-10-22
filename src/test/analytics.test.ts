import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initConsentDefaults,
  initGA4,
  updateGA4Consent,
  trackGAPageView,
  trackGAGenerateLead,
  GA_MEASUREMENT_ID,
} from '../utils/analytics';

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
});
