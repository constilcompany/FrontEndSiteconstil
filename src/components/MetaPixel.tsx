import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/pixel';

export const MetaPixel = ({ hasConsent }: { hasConsent: boolean }) => {
  const location = useLocation();
  const trackedLocation = useRef<string>('');

  useEffect(() => {
    if (hasConsent && trackedLocation.current !== location.pathname) {
      trackedLocation.current = location.pathname;
      trackPageView();
    }
  }, [location, hasConsent]);

  return null;
};
