import { useEffect, useRef } from 'react';
import { trackViewContent } from '../utils/pixel';
import { useConsent } from '../contexts/ConsentContext';

export const PageTracker = ({ contentName }: { contentName: string }) => {
  const hasConsent = useConsent();
  const tracked = useRef(false);

  useEffect(() => {
    if (hasConsent && !tracked.current) {
      trackViewContent({ content_name: contentName });
      tracked.current = true;
    }
  }, [contentName, hasConsent]);

  return null;
};
