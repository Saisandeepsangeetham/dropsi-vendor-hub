import OrderPerformance from "@/components/vendor/OrderPerformance";
import { useAuth } from "@/contexts/AuthContext";

const VendorPerformance = () => {
    const { vendor } = useAuth();

    if (!vendor) {
        return null;
    }

    return (
        <div className="p-6">
            <OrderPerformance vendorId={vendor.id} />
        </div>
    );
};

export default VendorPerformance;
