import { useState, useEffect } from "react";
import { MapPinOff } from "lucide-react";

const GeoBlocker = ({ children }: { children: React.ReactNode }) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkGeo = async () => {
      // 1. Check for bypass query parameter
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("bypass_geo") === "true") {
        localStorage.setItem("bypass_geo", "true");
      }

      // 2. Check for localhost or bypass in local storage
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const isBypassed = localStorage.getItem("bypass_geo") === "true";

      if (isLocalhost || isBypassed) {
        setIsAllowed(true);
        return;
      }

      // 3. Fetch geolocation
      try {
        const response = await fetch("https://api.country.is");
        const data = await response.json();
        
        if (data.country === "US") {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Failed to check geolocation", error);
        // Failsafe: allow access if the Geo API goes down, to prevent blocking legitimate US users.
        setIsAllowed(true); 
      }
    };

    checkGeo();
  }, []);

  if (isAllowed === null) {
    // Show a blank screen while checking to prevent content flashing
    return <div className="min-h-screen bg-background" />;
  }

  if (isAllowed === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <MapPinOff className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Access Restricted</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Constil services are currently only accessible within the United States.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default GeoBlocker;
