import { usePageTracking } from '../hooks/usePageTracking';

export const GoogleAnalytics = ({ hasConsent }: { hasConsent: boolean }) => {
  usePageTracking(hasConsent);
  return null;
};
