import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { trackPageView, getMetaCookies } from '../utils/pixel';
import { supabase } from '../lib/supabase';

export const MetaPixel = ({ hasConsent }: { hasConsent: boolean }) => {
  const location = useLocation();
  const trackedLocation = useRef<string>('');

  useEffect(() => {
    if (hasConsent && trackedLocation.current !== location.pathname) {
      trackedLocation.current = location.pathname;
      const eventId = uuidv4();
      
      // Fire browser pixel event with deduplication ID
      trackPageView(eventId);
      
      // Call Supabase Edge Function for Server-Side (CAPI) tracking
      const cookies = getMetaCookies();
      supabase.functions.invoke('meta-capi', {
        body: {
          event_name: 'PageView',
          event_id: eventId,
          event_source_url: window.location.href,
          fbp: cookies.fbp,
          fbc: cookies.fbc,
        }
      }).catch(err => console.error('CAPI Error:', err));
    }
  }, [location, hasConsent]);

  return null;
};
