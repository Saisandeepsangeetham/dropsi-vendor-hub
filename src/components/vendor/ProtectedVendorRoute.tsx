import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/loading";
import VendorAuth from "@/components/vendor/VendorAuth";

interface ProtectedVendorRouteProps {
    children: React.ReactNode;
}

const ProtectedVendorRoute = ({ children }: ProtectedVendorRouteProps) => {
    const { vendor, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If not loading and no vendor, redirect to auth
        if (!isLoading && !vendor) {
            navigate('/vendor-auth');
        }
    }, [vendor, isLoading, navigate]);

    // Show loading while checking auth
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

    // If authenticated, render children
    return <>{children}</>;
};

export default ProtectedVendorRoute;
