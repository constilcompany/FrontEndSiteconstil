declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fbq?: any;
  }
}

export const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '1394045752925191';

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
  
  return {
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc')
  };
};

export const trackLead = (data: Record<string, unknown> = {}, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', data, { eventID: eventId });
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
    // Meta requires the country code to be included (e.g., 15551234567 for US).
    normalized = value.replace(/\D/g, '');
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
