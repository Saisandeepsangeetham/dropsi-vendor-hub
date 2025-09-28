import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import Index from "./pages/Index";
import VendorDashboard from "./pages/VendorDashboard";
import VendorLayout from "@/components/vendor/VendorLayout";
import ProtectedVendorRoute from "@/components/vendor/ProtectedVendorRoute";
import VendorOverview from "./pages/VendorOverview";
import VendorCatalog from "./pages/VendorCatalog";
import VendorDiscounts from "./pages/VendorDiscounts";
import VendorAreas from "./pages/VendorAreas";
import VendorPerformance from "./pages/VendorPerformance";
import VendorProfilePage from "./pages/VendorProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vendor-auth" element={<VendorDashboard />} />
              <Route path="/catalog" element={
                <ProtectedVendorRoute>
                  <VendorLayout />
                </ProtectedVendorRoute>
              }>
                <Route index element={<VendorCatalog />} />
              </Route>
              <Route path="/vendor" element={
                <ProtectedVendorRoute>
                  <VendorLayout />
                </ProtectedVendorRoute>
              }>
                <Route index element={<VendorOverview />} />
                <Route path="discounts" element={<VendorDiscounts />} />
                <Route path="areas" element={<VendorAreas />} />
                <Route path="performance" element={<VendorPerformance />} />
                <Route path="profile" element={<VendorProfilePage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
