import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MetaPixel } from "./components/MetaPixel";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { CookieConsent } from "./components/CookieConsent";
import { ConsentProvider } from "./contexts/ConsentContext";
import { initAttribution, setupGlobalAttributionLinkHandler } from "./utils/attribution";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import ClientManagementPage from "./pages/ClientManagementPage";
import ConstructionEstimatingPage from "./pages/ConstructionEstimatingPage";
import SmartConstructionPage from "./pages/SmartConstructionPage";
import InvoiceManagementPage from "./pages/InvoicesManagementPage";
import EstimatesSoftwarePage from "./pages/EstimatesSoftwarePage";
import ClientManagementSoftwarePage from "./pages/ClientManagementSoftwarePage";
import ContactPage from "./pages/ContactPage";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AboutPage from "./pages/AboutPage";
import PaymentTrackingManagementPage from "./pages/PaymentTrackingManagementPage";
import AdminLogin from "./pages/admin/AdminLogin";
import BlogDashboard from "./pages/admin/BlogDashboard";
import ScrollToTop from "./components/ScrollToTop";


const queryClient = new QueryClient();

const PreserveQueryNavigate = ({ to }: { to: string }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
};

const App = () => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Capture and persist attribution parameters on arrival
    initAttribution();
    // Intercept outbound links to app.constil.com to decorate with campaign UTMs & fbclid
    const cleanup = setupGlobalAttributionLinkHandler();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ConsentProvider hasConsent={hasConsent}>
          <MetaPixel hasConsent={hasConsent} />
          <GoogleAnalytics hasConsent={hasConsent} />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/smart-construction" element={<SmartConstructionPage />} />
          <Route path="/client-management" element={<ClientManagementPage />} />
          <Route path="/construction-estimating" element={<ConstructionEstimatingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/invoices-management-software" element={<InvoiceManagementPage />} />
          <Route path="/estimates-software" element={<EstimatesSoftwarePage />} />
          <Route path="/client-management-software" element={<ClientManagementSoftwarePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog" element={<PreserveQueryNavigate to="/blogs" />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/blog/:slug" element={<PreserveQueryNavigate to="/blogs" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/payment-tracking-software" element={<PaymentTrackingManagementPage />} />
          <Route path="/payment_tracking" element={<PreserveQueryNavigate to="/payment-tracking-software" />} />
          <Route path="/estimates_software" element={<PreserveQueryNavigate to="/estimates-software" />} />
          <Route path="/invoices_management" element={<PreserveQueryNavigate to="/invoices-management-software" />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<BlogDashboard />} />

          <Route path="*" element={<NotFound />} />
          </Routes>
        </ConsentProvider>
        <CookieConsent onConsentChange={setHasConsent} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
