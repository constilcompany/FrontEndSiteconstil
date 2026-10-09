import { useState, useEffect } from 'react';
import { updateConsent, initPixel } from '../utils/pixel';

export const CookieConsent = ({ onConsentChange }: { onConsentChange: (consent: boolean) => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
      onConsentChange(true);
      initPixel(true);
    } else if (consent === 'rejected') {
      onConsentChange(false);
      initPixel(false);
    } else {
      initPixel(false);
      setIsVisible(true);
    }
  }, [onConsentChange]);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    onConsentChange(true);
    updateConsent(true);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
    onConsentChange(false);
    updateConsent(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground flex-1">
        We use cookies and similar technologies to improve your browsing experience, 
        analyze site traffic, and personalize content. By clicking "Accept", you consent 
        to our use of tracking technologies like Meta Pixel.
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
