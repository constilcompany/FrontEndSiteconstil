/**
 * CONSTIL Attribution & Campaign Tracking Foundation
 * 
 * Extracts, persists, and decorates UTM parameters, campaign identifiers,
 * and Meta/Google click IDs across routes and between domains
 * (https://constil.com -> https://app.constil.com).
 */

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  fbclid?: string;
  gclid?: string;
  landing_page?: string;
  first_touch_timestamp?: number;
  last_touch_timestamp?: number;
}

const ATTRIBUTION_SESSION_KEY = 'constil_attribution_session';
const ATTRIBUTION_LOCAL_KEY = 'constil_attribution_persistent';
const ATTRIBUTION_COOKIE_KEY = 'constil_utm';

/**
 * Extracts attribution parameters from a URL query string or window.location.search
 */
export const extractAttributionFromUrl = (searchString?: string): AttributionData => {
  const result: AttributionData = {};
  if (typeof window === 'undefined' && !searchString) return result;

  try {
    const search = searchString !== undefined 
      ? searchString 
      : (typeof window !== 'undefined' ? window.location.search : '');
    
    if (!search) return result;

    const params = new URLSearchParams(search);
    const utmKeys: (keyof AttributionData)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'fbclid',
      'gclid',
    ];

    let hasAnyParam = false;
    for (const key of utmKeys) {
      const val = params.get(key);
      if (val) {
        result[key] = val;
        hasAnyParam = true;
      }
    }

    if (hasAnyParam && typeof window !== 'undefined') {
      result.landing_page = window.location.pathname;
    }
  } catch {
    // Graceful fallback on malformed query strings
  }

  return result;
};

/**
 * Helper to write a first-party cookie with domain scoping
 */
const setAttributionCookie = (name: string, value: string, days: number = 30) => {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    let cookieStr = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    
    // Scope to root domain in production so app.constil.com can access it directly
    const hostname = window.location.hostname;
    if (hostname.endsWith('constil.com') && !hostname.startsWith('localhost')) {
      cookieStr += '; domain=.constil.com';
    }

    document.cookie = cookieStr;
  } catch {
    // Ignore cookie write errors in restricted environments
  }
};

/**
 * Helper to read a cookie by name
 */
const getAttributionCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  try {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Retrieves the currently active attribution data from storage or cookies
 */
export const getStoredAttribution = (): AttributionData => {
  if (typeof window === 'undefined') return {};

  try {
    // 1. Primary: Session storage (current active browsing session)
    const sessionRaw = window.sessionStorage?.getItem(ATTRIBUTION_SESSION_KEY);
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      if (parsed && typeof parsed === 'object') return parsed;
    }

    // 2. Secondary: Cookie (shared across subdomains like app.constil.com)
    const cookieRaw = getAttributionCookie(ATTRIBUTION_COOKIE_KEY);
    if (cookieRaw) {
      const parsed = JSON.parse(cookieRaw);
      if (parsed && typeof parsed === 'object') return parsed;
    }

    // 3. Fallback: Persistent local storage (returning visitors)
    const localRaw = window.localStorage?.getItem(ATTRIBUTION_LOCAL_KEY);
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // Ignore parsing failures
  }

  return {};
};

/**
 * Persists attribution parameters into sessionStorage, localStorage, and root-domain cookie
 */
export const storeAttribution = (data: AttributionData): void => {
  if (typeof window === 'undefined' || !data || Object.keys(data).length === 0) return;

  const now = Date.now();
  const current = getStoredAttribution();

  const merged: AttributionData = {
    ...current,
    ...data,
    first_touch_timestamp: current.first_touch_timestamp || now,
    last_touch_timestamp: now,
  };

  const payload = JSON.stringify(merged);

  try {
    window.sessionStorage?.setItem(ATTRIBUTION_SESSION_KEY, payload);
    window.localStorage?.setItem(ATTRIBUTION_LOCAL_KEY, payload);
    setAttributionCookie(ATTRIBUTION_COOKIE_KEY, payload, 30);
  } catch {
    // Safe failure in restricted sandboxes / private mode
  }
};

/**
 * Initializes attribution tracking on page load.
 * Captures query parameters if present, or restores prior attribution.
 */
export const initAttribution = (): AttributionData => {
  if (typeof window === 'undefined') return {};

  const fromUrl = extractAttributionFromUrl();
  if (Object.keys(fromUrl).length > 0) {
    storeAttribution(fromUrl);
    return getStoredAttribution();
  }

  return getStoredAttribution();
};

/**
 * Tests whether a target URL points to CONSTIL applications
 * (app.constil.com, constil.com, localhost) where campaign attribution should be preserved.
 */
export const isConstilAppUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    // Handle relative paths
    if (url.startsWith('/') && !url.startsWith('//')) {
      return true;
    }

    const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://constil.com');
    const hostname = parsed.hostname.toLowerCase();

    return (
      hostname === 'constil.com' ||
      hostname.endsWith('.constil.com') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
};

/**
 * Decorates a URL with the active UTM and campaign parameters.
 * Only decorates CONSTIL domain URLs (prevents leaking attribution to 3rd-party sites).
 * Does NOT overwrite parameters already explicitly present on the target URL.
 */
export const decorateUrlWithAttribution = (
  targetUrl: string,
  attributionOverride?: AttributionData
): string => {
  if (!targetUrl || typeof targetUrl !== 'string') return targetUrl;

  try {
    if (!isConstilAppUrl(targetUrl)) {
      return targetUrl; // Never leak attribution to external domains
    }

    const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://constil.com';
    const isRelative = targetUrl.startsWith('/') && !targetUrl.startsWith('//');
    const parsed = new URL(targetUrl, baseOrigin);

    const attribution = attributionOverride || getStoredAttribution();
    const allowedKeys: (keyof AttributionData)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'fbclid',
      'gclid',
    ];

    for (const key of allowedKeys) {
      const value = attribution[key];
      // Only append if value exists and target doesn't already specify it
      if (value && typeof value === 'string' && !parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, value);
      }
    }

    if (isRelative) {
      return parsed.pathname + parsed.search + parsed.hash;
    }

    return parsed.toString();
  } catch {
    return targetUrl;
  }
};

/**
 * Global click interceptor that ensures all clicks on <a> tags pointing to
 * app.constil.com or internal routes have attribution parameters appended seamlessly.
 */
export const setupGlobalAttributionLinkHandler = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleClick = (e: MouseEvent) => {
    try {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only decorate links pointing to app.constil.com or constil.com
      if (isConstilAppUrl(href) && (href.includes('app.constil.com') || href.includes('/signup'))) {
        const decorated = decorateUrlWithAttribution(href);
        if (decorated !== href) {
          anchor.setAttribute('href', decorated);
        }
      }
    } catch {
      // Safe no-op on event inspection error
    }
  };

  document.addEventListener('click', handleClick, { capture: true });
  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
  };
};

