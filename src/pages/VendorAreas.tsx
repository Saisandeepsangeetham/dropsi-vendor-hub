import PincodeManagement from "@/components/vendor/PincodeManagement";
import { useAuth } from "@/contexts/AuthContext";

const VendorAreas = () => {
    const { vendor } = useAuth();

    if (!vendor) {
        return null;
    }

    return (
        <div className="p-6">
            <PincodeManagement vendorId={vendor.id} />
        </div>
    );
};

export default VendorAreas;
