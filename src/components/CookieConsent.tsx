import { useState, useEffect } from 'react';
import { updateConsent, initPixel } from '../utils/pixel';
import { updateGA4Consent, initGA4 } from '../utils/analytics';

export const CookieConsent = ({ onConsentChange }: { onConsentChange: (consent: boolean) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);

  useEffect(() => {
    const preferencesRaw = localStorage.getItem('cookiePreferences');
    if (preferencesRaw) {
      try {
        const prefs = JSON.parse(preferencesRaw);
        const hasAnalytics = Boolean(prefs.analytics);
        const hasAdvertising = Boolean(prefs.advertising);
        setCurrentStatus(hasAnalytics || hasAdvertising ? 'accepted' : 'rejected');
        onConsentChange(hasAnalytics || hasAdvertising);
        initPixel(hasAdvertising);
        initGA4(hasAnalytics, hasAdvertising);
        return;
      } catch {
        // Fallback to legacy string format
      }
    }

    const consent = localStorage.getItem('cookieConsent');
    setCurrentStatus(consent);
    if (consent === 'accepted') {
      onConsentChange(true);
      initPixel(true);
      initGA4(true, true);
    } else if (consent === 'rejected') {
      onConsentChange(false);
      initPixel(false);
      initGA4(false, false);
    } else {
      initPixel(false);
      initGA4(false, false);
      setIsVisible(true);
    }
  }, [onConsentChange]);

  useEffect(() => {
    const handleOpen = () => {
      const consent = localStorage.getItem('cookieConsent');
      setCurrentStatus(consent);
      setIsVisible(true);
    };
    window.addEventListener('openCookiePreferences', handleOpen);
    return () => {
      window.removeEventListener('openCookiePreferences', handleOpen);
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({ analytics: true, advertising: true }));
    setCurrentStatus('accepted');
    setIsVisible(false);
    onConsentChange(true);
    updateConsent(true);
    updateGA4Consent(true, true);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify({ analytics: false, advertising: false }));
    setCurrentStatus('rejected');
    setIsVisible(false);
    onConsentChange(false);
    updateConsent(false);
    updateGA4Consent(false, false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground flex-1">
        We use cookies and similar technologies to improve your browsing experience, 
        analyze site traffic, and personalize content. By clicking "Accept", you consent 
        to our use of tracking technologies like Meta Pixel and Google Analytics.
        {currentStatus && (
          <span className="block mt-1 text-xs text-primary font-medium">
            Current preference: {currentStatus === 'accepted' ? 'Tracking Accepted' : 'Tracking Declined'}
          </span>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={handleReject} className="px-4 py-2 text-sm border rounded-md hover:bg-muted font-medium transition-colors">
          Decline
        </button>
        <button onClick={handleAccept} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors">
          Accept
        </button>
      </div>
    </div>
  );
};
