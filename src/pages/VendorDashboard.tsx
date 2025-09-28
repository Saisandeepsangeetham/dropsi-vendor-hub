import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VendorAuth from "@/components/vendor/VendorAuth";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/contexts/AuthContext";

const VendorDashboard = () => {
  const { vendor, isLoading, isNewVendor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If vendor is authenticated and not new, redirect to main dashboard
    if (vendor && !isNewVendor && !isLoading) {
      navigate('/vendor');
        return;
      }

    // If vendor is authenticated and is new, redirect to catalog for onboarding
    if (vendor && isNewVendor && !isLoading) {
      navigate('/catalog');
      return;
    }
  }, [vendor, isNewVendor, isLoading, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <Loading size="lg" text="Loading vendor dashboard..." />
      </div>
    );
  }

  // If not authenticated, show auth form
  if (!vendor) {
    return <VendorAuth />;
  }

  // This component handles the initial routing, actual dashboard is now handled by the routes
  return null;
};

export default VendorDashboard;