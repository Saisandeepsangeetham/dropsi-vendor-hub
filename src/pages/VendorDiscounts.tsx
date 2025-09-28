import { useState, useEffect } from "react";
import DiscountManagement from "@/components/vendor/DiscountManagement";
import { VendorProduct, ProductManager } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/loading";

const VendorDiscounts = () => {
    const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { vendor } = useAuth();

    // Load vendor products
    useEffect(() => {
        const loadVendorProducts = async () => {
            if (!vendor) return;

            try {
                setIsLoading(true);
                const products = await ProductManager.getVendorProducts();
                setVendorProducts(products);
            } catch (error) {
                console.error('Error loading vendor products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadVendorProducts();
    }, [vendor]);

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loading size="lg" text="Loading products..." />
            </div>
        );
    }

    return (
        <div className="p-6">
            <DiscountManagement vendorProducts={vendorProducts} />
        </div>
    );
};

export default VendorDiscounts;
