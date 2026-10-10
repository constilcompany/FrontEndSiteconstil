import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { trackViewContent, getMetaCookies } from '../utils/pixel';
import { useConsent } from '../contexts/ConsentContext';
import { supabase } from '../lib/supabase';

export const PageTracker = ({ contentName }: { contentName: string }) => {
  const hasConsent = useConsent();
  const tracked = useRef(false);

  useEffect(() => {
    if (hasConsent && !tracked.current) {
      const eventId = uuidv4();
      
      // Fire browser pixel event with deduplication ID
      trackViewContent({ content_name: contentName }, eventId);
      
      // Call Supabase Edge Function for Server-Side (CAPI) tracking
      const cookies = getMetaCookies();
      supabase.functions.invoke('meta-capi', {
        body: {
          event_name: 'ViewContent',
          event_id: eventId,
          event_source_url: window.location.href,
          content_name: contentName,
          fbp: cookies.fbp,
          fbc: cookies.fbc,
        }
      }).catch(err => console.error('CAPI Error:', err));
      
      tracked.current = true;
    }
  }, [contentName, hasConsent]);

  return null;
};
