/**
 * Centralized Google Analytics 4 (GA4) Event Helper
 * Provides a safe wrapper around window.gtag('event', eventName, params).
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-E16MPY5M0L';

/**
 * Helper function to safely emit GA4 events.
 * Safely calls window.gtag('event', eventName, params) if window.gtag exists.
 */
export const trackGAEvent = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (typeof window === 'undefined') return;

  // Respect user consent and GA disable flag
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return;

  const eventPayload = {
    send_to: GA_MEASUREMENT_ID,
    ...(params || {}),
  };

  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, eventPayload);
    } catch (err) {
      console.warn(`[GA4] Failed to emit event "${eventName}":`, err);
    }
  } else if (Array.isArray(window.dataLayer)) {
    // Fallback to dataLayer push if gtag wrapper is not directly available
    window.dataLayer.push({
      event: eventName,
      ...eventPayload,
    });
  }
};

