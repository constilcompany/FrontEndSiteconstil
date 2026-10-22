import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackGAPageView } from '../utils/analytics';

export const GoogleAnalytics = ({ hasConsent }: { hasConsent: boolean }) => {
  const location = useLocation();
  const trackedPath = useRef<string>('');

  useEffect(() => {
    if (!hasConsent) {
      trackedPath.current = '';
      return;
    }

    const currentPath = location.pathname + location.search;

    if (trackedPath.current !== currentPath) {
      trackedPath.current = currentPath;

      // Small delay (100ms) ensures React Helmet has updated document.title
      const timer = setTimeout(() => {
        trackGAPageView(currentPath, document.title);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location, hasConsent]);

  return null;
};
