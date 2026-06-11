import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import ClientManagementPage from "./pages/ClientManagementPage";
import ConstructionEstimatingPage from "./pages/ConstructionEstimatingPage";
import SmartConstructionPage from "./pages/SmartConstructionPage";
import InvoiceManagementPage from "./pages/InvoicesManagementPage";
import EstimatesSoftwarePage from "./pages/EstimatesSoftwarePage";
import PaymentTrackingPage from "./pages/PaymentTrackingPage";
import ClientManagementSoftwarePage from "./pages/ClientManagementSoftwarePage";
import PaymentTrackingManagementPage from "./pages/PaymentTrackingManagementPage";
import ContactPage from "./pages/ContactPage";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/smart-construction" element={<SmartConstructionPage />} />
          <Route path="/client-management" element={<ClientManagementPage />} />
          <Route path="/construction-estimating" element={<ConstructionEstimatingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/invoices_management" element={<InvoiceManagementPage />} />
          <Route path="/estimates_software" element={<EstimatesSoftwarePage />} />
          <Route path="/payment_tracking" element={<PaymentTrackingManagementPage />} />
          <Route path="/client_management_software" element={<ClientManagementSoftwarePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
