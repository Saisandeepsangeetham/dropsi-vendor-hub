import { useNavigate } from "react-router-dom";
import MainDashboard from "@/components/vendor/MainDashboard";

const VendorOverview = () => {
    const navigate = useNavigate();

    const handleAddMoreProducts = () => {
        navigate('/catalog');
    };

    return (
        <div className="p-6">
            <MainDashboard onAddMoreProducts={handleAddMoreProducts} />
        </div>
    );
};

export default VendorOverview;
