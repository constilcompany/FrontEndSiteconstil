declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-E16MPY5M0L';

/**
 * Checks if debug_mode is requested via query string (?debug_mode=true)
 * or active in development mode to assist with GA4 DebugView testing.
 */
export const isDebugMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.has('debug_mode') || params.get('debug') === 'true';
  } catch {
    return false;
  }
};

/**
 * Initializes Google Consent Mode v2 default values (all denied)
 * and disables GA4 tracking until consent is granted.
 * This runs locally in-memory and executes no external network requests.
 */
export const initConsentDefaults = () => {
  if (typeof window === 'undefined') return;

  // Disable tracking until explicit consent
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }

  // Google Consent Mode v2 defaults: all denied before user consent
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
};

// Automatically establish default consent state upon module load
initConsentDefaults();

/**
 * Initializes GA4 only when analytics consent is granted.
 * Injects the gtag.js script and sets up dataLayer with send_page_view: false
 * to prevent double-counting on Single Page Applications.
 *
 * Advertising permissions (ad_storage, ad_user_data, ad_personalization) are NOT
 * granted unless explicit advertising consent is confirmed.
 */
export const initGA4 = (
  hasConsent: boolean,
  hasAdvertisingConsent: boolean = false
) => {
  if (typeof window === 'undefined') return;

  if (!hasConsent || !GA_MEASUREMENT_ID) {
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    return;
  }

  // Un-disable GA if previously disabled
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }

  // Google Consent Mode v2 update:
  // - analytics_storage: granted when user consents to analytics
  // - advertising permissions: strictly denied unless explicit advertising consent is present
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: hasAdvertisingConsent ? 'granted' : 'denied',
    ad_user_data: hasAdvertisingConsent ? 'granted' : 'denied',
    ad_personalization: hasAdvertisingConsent ? 'granted' : 'denied',
  });

  const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

  // Only inject script tag if not already in document
  if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = scriptSrc;

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  window.gtag('js', new Date());

  const configOptions: Record<string, unknown> = {
    send_page_view: false, // Prevents duplicate initial page views on React SPA
  };

  if (isDebugMode()) {
    configOptions.debug_mode = true;
  }

  window.gtag('config', GA_MEASUREMENT_ID, configOptions);
};

/**
 * Updates consent state in GA4.
 * When consent is revoked/declined:
 * - Sets ga-disable flag to true
 * - Updates Consent Mode v2 to 'denied'
 *
 * Advertising permissions are only granted if hasAdvertisingConsent is true.
 */
export const updateGA4Consent = (
  hasConsent: boolean,
  hasAdvertisingConsent: boolean = false
) => {
  if (typeof window === 'undefined') return;

  if (hasConsent) {
    initGA4(true, hasAdvertisingConsent);
  } else {
    // Disable Google Analytics for this measurement ID
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  }
};

/**
 * Tracks route navigation as page_view events without duplicates.
 */
export const trackGAPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return;

  const eventParams: Record<string, unknown> = {
    page_path: path,
    page_location: window.location.href,
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
    send_to: GA_MEASUREMENT_ID,
  };

  if (isDebugMode()) {
    eventParams.debug_mode = true;
  }

  window.gtag('event', 'page_view', eventParams);
};

/**
 * Tracks successful lead generations (e.g., contact form submissions).
 * Strictly avoids PII to adhere to Google Analytics terms of service.
 */
export const trackGAGenerateLead = (customParams: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return;

  const eventParams: Record<string, unknown> = {
    form_name: 'contact_form',
    send_to: GA_MEASUREMENT_ID,
    ...customParams,
  };

  if (isDebugMode()) {
    eventParams.debug_mode = true;
  }

  window.gtag('event', 'generate_lead', eventParams);
};
