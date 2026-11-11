/**
 * Comprehensive Visitor Context & Forensics Service
 * 
 * Captures visitor identity, attribution, device, environment,
 * navigation journeys, and geolocations.
 * 
 * Compliance:
 * - Raw IP is NEVER sent to Google Analytics (gtag) per Google Terms of Service.
 * - Raw IP, Geo, and Full Navigation History are captured for internal Supabase leads.
 */

export interface GeoLocationData {
  ip_address: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  postal?: string;
  asn_org?: string;
}

export interface VisitorContext {
  visitor_id: string;
  is_new_user: boolean;
  first_visit_timestamp: string;
  session_count: number;
  session_id: string;
  referrer: string;
  landing_page: string;
  current_page: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  screen_resolution: string;
  user_agent: string;
  browser_language: string;
  timezone: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  geo: GeoLocationData;
  navigation_history: string[];
}

const STORAGE_KEYS = {
  VISITOR_ID: 'constil_visitor_id',
  FIRST_VISIT: 'constil_first_visit',
  SESSION_COUNT: 'constil_session_count',
  SESSION_ACTIVE: 'constil_session_active',
  SESSION_ID: 'constil_session_id',
  INITIAL_REFERRER: 'constil_initial_referrer',
  LANDING_PAGE: 'constil_landing_page',
  GEO_CACHE: 'constil_geo_cache',
  BREADCRUMBS: 'constil_breadcrumbs',
  UTM_PREFIX: 'constil_utm_',
};

/**
 * Generate a RFC4122 version 4 compliant UUID
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback below
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Safe local storage reader
 */
function safeGetLocal(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safe local storage writer
 */
function safeSetLocal(key: string, val: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, val);
  } catch {
    // Ignore storage quota / restricted errors
  }
}

/**
 * Safe session storage reader
 */
function safeGetSession(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safe session storage writer
 */
function safeSetSession(key: string, val: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, val);
  } catch {
    // Ignore storage quota / restricted errors
  }
}

/**
 * Detect device type based on user agent and screen dimensions
 */
export function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua);
  if (isTablet) return 'tablet';
  const isMobile = /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo)/i.test(ua);
  if (isMobile || (window.innerWidth && window.innerWidth <= 768)) return 'mobile';
  return 'desktop';
}

/**
 * Parse UTM parameters from current URL and persist in session storage
 */
export function extractAndPersistUTMs(): Record<string, string> {
  const utms: Record<string, string> = {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  };

  if (typeof window === 'undefined') return utms;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const keys: (keyof typeof utms)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    keys.forEach((k) => {
      const urlVal = searchParams.get(k);
      if (urlVal) {
        utms[k] = urlVal;
        safeSetSession(`${STORAGE_KEYS.UTM_PREFIX}${k}`, urlVal);
      } else {
        const stored = safeGetSession(`${STORAGE_KEYS.UTM_PREFIX}${k}`);
        if (stored) {
          utms[k] = stored;
        }
      }
    });
  } catch {
    // Ignore URL parse errors
  }

  return utms;
}

/**
 * Record a route into the breadcrumbs navigation history
 */
export function recordNavigationBreadcrumb(pathname: string): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = safeGetSession(STORAGE_KEYS.BREADCRUMBS);
    let breadcrumbs: string[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(breadcrumbs)) breadcrumbs = [];

    // Avoid duplicate adjacent visits
    if (breadcrumbs.length === 0 || breadcrumbs[breadcrumbs.length - 1] !== pathname) {
      breadcrumbs.push(pathname);
      // Keep only the most recent 25 navigation stops
      if (breadcrumbs.length > 25) {
        breadcrumbs = breadcrumbs.slice(breadcrumbs.length - 25);
      }
      safeSetSession(STORAGE_KEYS.BREADCRUMBS, JSON.stringify(breadcrumbs));
    }
    return breadcrumbs;
  } catch {
    return [pathname];
  }
}

/**
 * Get the current navigation history array
 */
export function getNavigationHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = safeGetSession(STORAGE_KEYS.BREADCRUMBS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Fallback empty geo data
 */
const DEFAULT_GEO: GeoLocationData = {
  ip_address: 'unknown',
  city: '',
  region: '',
  country: '',
  country_code: '',
  postal: '',
  asn_org: '',
};

let geoFetchPromise: Promise<GeoLocationData> | null = null;

/**
 * Fetch IP and location with caching and timeout
 */
export async function fetchGeoLocation(forceFresh = false): Promise<GeoLocationData> {
  if (typeof window === 'undefined') return DEFAULT_GEO;

  // 1. Check session cache first
  if (!forceFresh) {
    const cached = safeGetSession(STORAGE_KEYS.GEO_CACHE);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.ip_address) return parsed;
      } catch {
        // Cache corrupted, refetch
      }
    }
  }

  // Deduplicate in-flight fetch promises
  if (geoFetchPromise) {
    return geoFetchPromise;
  }

  geoFetchPromise = (async () => {
    // Timeout of 3500ms so we never hang the app or form submissions
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      // Primary: ipapi.co (provides rich geo + ASN info)
      const res = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const d = await res.json();
        const data: GeoLocationData = {
          ip_address: d.ip || 'unknown',
          city: d.city || '',
          region: d.region || '',
          country: d.country_name || d.country || '',
          country_code: d.country_code || '',
          postal: d.postal || '',
          asn_org: d.org || '',
        };
        safeSetSession(STORAGE_KEYS.GEO_CACHE, JSON.stringify(data));
        return data;
      }
      throw new Error(`ipapi returned status ${res.status}`);
    } catch {
      // Fallback: ipify.org for raw IP
      try {
        const fallbackRes = await fetch('https://api.ipify.org?format=json', {
          signal: controller.signal,
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const data: GeoLocationData = {
            ...DEFAULT_GEO,
            ip_address: fallbackData.ip || 'unknown',
          };
          safeSetSession(STORAGE_KEYS.GEO_CACHE, JSON.stringify(data));
          return data;
        }
      } catch {
        // Both failed or blocked by client adblocker
      }
      return DEFAULT_GEO;
    } finally {
      clearTimeout(timeoutId);
      geoFetchPromise = null;
    }
  })();

  return geoFetchPromise;
}

/**
 * Returns cached geo information synchronously if available
 */
export function getCachedGeoLocationSync(): GeoLocationData {
  if (typeof window === 'undefined') return DEFAULT_GEO;
  const cached = safeGetSession(STORAGE_KEYS.GEO_CACHE);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return DEFAULT_GEO;
    }
  }
  return DEFAULT_GEO;
}

/**
 * Synchronously retrieves the base visitor context (with cached geo data)
 */
export function getVisitorContextSync(): VisitorContext {
  if (typeof window === 'undefined') {
    return {
      visitor_id: 'ssr',
      is_new_user: false,
      first_visit_timestamp: new Date().toISOString(),
      session_count: 1,
      session_id: 'ssr',
      referrer: 'Direct',
      landing_page: '/',
      current_page: '/',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      screen_resolution: '1920x1080',
      user_agent: 'server',
      browser_language: 'en-US',
      timezone: 'UTC',
      device_type: 'desktop',
      geo: DEFAULT_GEO,
      navigation_history: [],
    };
  }

  // 1. Persistent Visitor ID & New User Check
  let visitorId = safeGetLocal(STORAGE_KEYS.VISITOR_ID);
  let isNewUser = false;
  let firstVisit = safeGetLocal(STORAGE_KEYS.FIRST_VISIT);

  if (!visitorId) {
    visitorId = generateUUID();
    isNewUser = true;
    firstVisit = new Date().toISOString();
    safeSetLocal(STORAGE_KEYS.VISITOR_ID, visitorId);
    safeSetLocal(STORAGE_KEYS.FIRST_VISIT, firstVisit);
  }

  // 2. Session Count & Session ID
  let sessionId = safeGetSession(STORAGE_KEYS.SESSION_ID);
  const isSessionActive = safeGetSession(STORAGE_KEYS.SESSION_ACTIVE) === 'true';
  let sessionCount = parseInt(safeGetLocal(STORAGE_KEYS.SESSION_COUNT) || '0', 10);

  if (!isSessionActive) {
    sessionCount += 1;
    sessionId = generateUUID();
    safeSetLocal(STORAGE_KEYS.SESSION_COUNT, String(sessionCount));
    safeSetSession(STORAGE_KEYS.SESSION_ACTIVE, 'true');
    safeSetSession(STORAGE_KEYS.SESSION_ID, sessionId);
  } else if (!sessionId) {
    sessionId = generateUUID();
    safeSetSession(STORAGE_KEYS.SESSION_ID, sessionId);
  }

  // 3. Attribution (Referrer & Landing Page)
  let initialReferrer = safeGetSession(STORAGE_KEYS.INITIAL_REFERRER);
  if (!initialReferrer) {
    initialReferrer = document.referrer || 'Direct';
    safeSetSession(STORAGE_KEYS.INITIAL_REFERRER, initialReferrer);
  }

  let landingPage = safeGetSession(STORAGE_KEYS.LANDING_PAGE);
  const currentPathWithSearch = window.location.pathname + window.location.search;
  if (!landingPage) {
    landingPage = currentPathWithSearch;
    safeSetSession(STORAGE_KEYS.LANDING_PAGE, landingPage);
  }

  const utms = extractAndPersistUTMs();
  const screenResolution = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
  const userAgent = navigator.userAgent || '';
  const browserLanguage = navigator.language || 'en-US';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const deviceType = detectDeviceType();
  const geo = getCachedGeoLocationSync();
  const navigationHistory = getNavigationHistory();

  return {
    visitor_id: visitorId,
    is_new_user: isNewUser,
    first_visit_timestamp: firstVisit || new Date().toISOString(),
    session_count: sessionCount || 1,
    session_id: sessionId || 'default-session',
    referrer: initialReferrer,
    landing_page: landingPage,
    current_page: currentPathWithSearch,
    ...utms,
    screen_resolution: screenResolution,
    user_agent: userAgent,
    browser_language: browserLanguage,
    timezone,
    device_type: deviceType,
    geo,
    navigation_history: navigationHistory,
  };
}

/**
 * Asynchronously retrieves full visitor context ensuring geo data is fetched
 */
export async function getVisitorContext(): Promise<VisitorContext> {
  const syncContext = getVisitorContextSync();
  if (syncContext.geo.ip_address !== 'unknown') {
    return syncContext;
  }
  const geo = await fetchGeoLocation();
  return {
    ...syncContext,
    geo,
  };
}

/**
 * Formats custom parameters for GA4 events.
 * 
 * STRICT PRIVACY REQUIREMENT:
 * Never sends raw IP address to GA4 (gtag) per Google Terms of Service.
 */
export function getGA4VisitorParams(): Record<string, any> {
  const ctx = getVisitorContextSync();
  return {
    visitor_id: ctx.visitor_id,
    session_count: ctx.session_count,
    is_new_visitor: ctx.is_new_user,
    entry_page: ctx.landing_page,
    referrer: ctx.referrer,
    device_category: ctx.device_type,
    screen_resolution: ctx.screen_resolution,
    browser_language: ctx.browser_language,
    timezone: ctx.timezone,
    utm_source: ctx.utm_source || undefined,
    utm_medium: ctx.utm_medium || undefined,
    utm_campaign: ctx.utm_campaign || undefined,
    utm_term: ctx.utm_term || undefined,
    utm_content: ctx.utm_content || undefined,
    geo_country: ctx.geo.country || undefined,
    geo_region: ctx.geo.region || undefined,
    geo_city: ctx.geo.city || undefined,
  };
}

/**
 * Formats the full forensic lead payload for CONSTIL internal storage (Supabase).
 * Includes raw IP, geolocation, full journey breadcrumbs, and device environment.
 */
export async function getFullForensicLeadPayload(): Promise<Record<string, any>> {
  const ctx = await getVisitorContext();
  return {
    visitor_id: ctx.visitor_id,
    is_new_user: ctx.is_new_user,
    first_visit_timestamp: ctx.first_visit_timestamp,
    session_count: ctx.session_count,
    session_id: ctx.session_id,
    referrer: ctx.referrer,
    landing_page: ctx.landing_page,
    current_page: ctx.current_page,
    utm_source: ctx.utm_source || null,
    utm_medium: ctx.utm_medium || null,
    utm_campaign: ctx.utm_campaign || null,
    utm_term: ctx.utm_term || null,
    utm_content: ctx.utm_content || null,
    ip_address: ctx.geo.ip_address || null,
    city: ctx.geo.city || null,
    region: ctx.geo.region || null,
    country: ctx.geo.country || null,
    country_code: ctx.geo.country_code || null,
    asn_org: ctx.geo.asn_org || null,
    screen_resolution: ctx.screen_resolution,
    user_agent: ctx.user_agent,
    browser_language: ctx.browser_language,
    timezone: ctx.timezone,
    device_type: ctx.device_type,
    navigation_history: ctx.navigation_history,
  };
}

