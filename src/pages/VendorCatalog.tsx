import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCatalog from "@/components/vendor/ProductCatalog";
import { VendorProduct, ProductManager } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const VendorCatalog = () => {
    const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
    const { vendor } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Load vendor products
    useEffect(() => {
        const loadVendorProducts = async () => {
            if (!vendor) return;

            try {
                const products = await ProductManager.getVendorProducts();
                setVendorProducts(products);
            } catch (error) {
                console.error('Error loading vendor products:', error);
            }
        };

        loadVendorProducts();
    }, [vendor]);

    const handleProductsAdded = (newVendorProducts: VendorProduct[]) => {
        toast({
            title: "Products added successfully",
            description: `${newVendorProducts.length} products have been added to your inventory.`,
        });

        // Navigate back to main dashboard
        navigate('/vendor');
    };

    return (
        <ProductCatalog
            onProductsSelected={handleProductsAdded}
            existingVendorProducts={vendorProducts}
            isAddingToExisting={true}
            onCancel={() => navigate('/vendor')}
            showHeader={false}
        />
    );
};

export default VendorCatalog;
