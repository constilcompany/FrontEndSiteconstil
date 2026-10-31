import { getStoredAttribution } from './attribution';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fbq?: any;
  }
}

export const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '1394045752925191';

/**
 * Safely writes a cookie scoped to the root domain in production (.constil.com)
 */
const writeMetaCookie = (name: string, value: string, maxAgeSeconds: number = 7776000) => {
  if (typeof document === 'undefined') return;
  try {
    let cookieStr = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      if (hostname.endsWith('constil.com') && !hostname.startsWith('localhost')) {
        cookieStr += '; domain=.constil.com';
      }
    }
    document.cookie = cookieStr;
  } catch {
    // Ignore cookie write errors in sandboxed environments
  }
};

export const initPixel = (hasConsent: boolean) => {
  if (!hasConsent) return;
  if (!PIXEL_ID) return;
  if (typeof window === 'undefined') return;
  if (window.fbq) return;

  const f = window;
  const b = document;
  const e = 'script';
  const v = 'https://connect.facebook.net/en_US/fbevents.js';
  
  if (document.querySelector(`script[src="${v}"]`)) return;

  // eslint-disable-next-line prefer-spread, prefer-rest-params, @typescript-eslint/no-unused-expressions, @typescript-eslint/no-explicit-any
  const n: any = f.fbq = function() {
    // eslint-disable-next-line prefer-spread, prefer-rest-params, @typescript-eslint/no-unused-expressions
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = '2.0';
  n.queue = [];

  const t = b.createElement(e);
  t.async = !0;
  t.src = v;
  
  const s = b.getElementsByTagName(e)[0];
  if (s && s.parentNode) {
    s.parentNode.insertBefore(t, s);
  } else {
    document.head.appendChild(t);
  }

  f.fbq('consent', 'grant');
  f.fbq('init', PIXEL_ID);
};

export const updateConsent = (hasConsent: boolean) => {
  if (hasConsent) {
    initPixel(true);
  } else {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'revoke');
    }
  }
};

export const trackPageView = (eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView', {}, { eventID: eventId });
  }
};

export const trackViewContent = (data: Record<string, unknown> = {}, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', data, { eventID: eventId });
  }
};

export const getMetaCookies = () => {
  if (typeof document === 'undefined') return { fbp: undefined, fbc: undefined };
  
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : undefined;
  };
  
  let fbp = getCookie('_fbp');
  // If _fbp is not yet populated by fbevents.js, generate standard Meta _fbp
  // so browser events and server CAPI share the exact same identifier from first event
  if (!fbp && typeof window !== 'undefined') {
    fbp = `fb.1.${Date.now()}.${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    writeMetaCookie('_fbp', fbp);
  }

  let fbc = getCookie('_fbc');
  // Fallback: If _fbc cookie is not set yet, extract fbclid from URL or stored attribution
  if (!fbc && typeof window !== 'undefined' && window.location) {
    try {
      let fbclid: string | null = null;
      if (window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        fbclid = urlParams.get('fbclid');
      }
      if (!fbclid) {
        const stored = getStoredAttribution();
        fbclid = stored.fbclid || null;
      }
      if (fbclid) {
        fbc = `fb.1.${Date.now()}.${fbclid}`;
        writeMetaCookie('_fbc', fbc);
      }
    } catch {
      // Ignore query parsing errors
    }
  }

  return {
    fbp,
    fbc
  };
};

export const trackLead = (data: Record<string, unknown> = {}, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', data, { eventID: eventId });
  }
};

export const trackCompleteRegistration = (data: Record<string, unknown> = {}, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', data, { eventID: eventId });
  }
};

export const trackCustomEvent = (eventName: string, data: Record<string, unknown> = {}, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, data, { eventID: eventId });
  }
};

/**
 * Normalizes and SHA-256 hashes a string according to Meta's strict specifications
 * for the Conversions API.
 */
export const hashMetaField = async (value: string, type: 'email' | 'phone' | 'text'): Promise<string | undefined> => {
  if (!value) return undefined;
  
  let normalized = '';
  
  if (type === 'email') {
    normalized = value.trim().toLowerCase();
  } else if (type === 'phone') {
    // Remove all non-numeric characters (including '+', '-', spaces, parens)
    normalized = value.replace(/\D/g, '');
    // If a 10-digit US phone number is provided without country code (e.g., 5551234567),
    // prepend '1' to conform to Meta's strict country code requirement for US campaigns.
    if (normalized.length === 10) {
      normalized = '1' + normalized;
    }
  } else {
    // For first/last name: lowercase, trim, remove punctuation
    normalized = value.trim().toLowerCase().replace(/[^\w\s\u00C0-\u024F]/g, '');
  }

  if (!normalized) return undefined;

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error hashing Meta EMQ field:', error);
    return undefined;
  }
};
