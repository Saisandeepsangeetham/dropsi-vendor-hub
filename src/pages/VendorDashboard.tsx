import { useState, useEffect } from "react";
import VendorAuth from "@/components/vendor/VendorAuth";
import VendorProfile from "@/components/vendor/VendorProfile";
import PincodeManagement from "@/components/vendor/PincodeManagement";
import OrderPerformance from "@/components/vendor/OrderPerformance";
import DiscountManagement from "@/components/vendor/DiscountManagement";
import ProductCatalog from "@/components/vendor/ProductCatalog";
import PricingSetup from "@/components/vendor/PricingSetup";
import MainDashboard from "@/components/vendor/MainDashboard";
import { OrderManagement } from "@/components/vendor/OrderManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { LogOut, User, MapPin, BarChart3, Package, Tag, Bell, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Product, VendorProduct, ProductManager } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export type Discount = {
  id: string;
  vendor_product_id: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  discounted_price: number;
  card_title: string;
  description: string;
  terms: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

export type OnboardingStep = 'catalog' | 'pricing' | 'completed';

const VendorDashboard = () => {
  const { vendor, isLoading, isNewVendor, logout, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('catalog');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const { toast } = useToast();

  // Load vendor products when component mounts
  useEffect(() => {
    const loadVendorProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const products = await ProductManager.getVendorProducts();
        setVendorProducts(products);
      } catch (error) {
        console.error('Error loading vendor products:', error);
        toast({
          title: "Error loading products",
          description: error instanceof Error ? error.message : "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadVendorProducts();
  }, [toast]);

  const handleProductsSelected = (products: Product[]) => {
    setSelectedProducts(products);
    setCurrentStep('pricing');
  };

  const handlePricingComplete = (vendorProducts: VendorProduct[]) => {
    setCurrentStep('completed');
    completeOnboarding(); // Mark onboarding as completed
  };

  const handleAddMoreProducts = () => {
    setSelectedProducts([]);
    setCurrentStep('catalog');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentStep('catalog');
    setSelectedProducts([]);
  };

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

  // Onboarding flow for NEW vendors only (not for existing vendors logging in)
  if (isNewVendor && currentStep === 'catalog') {
    return (
      <ProductCatalog 
        onProductsSelected={handleProductsSelected}
        onCancel={undefined}
      />
    );
  }

  if (isNewVendor && currentStep === 'pricing') {
    return (
      <PricingSetup 
        selectedProducts={selectedProducts}
        onComplete={handlePricingComplete}
        onCancel={() => setCurrentStep('catalog')}
      />
    );
  }

  // Main dashboard for existing vendors
  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="flex items-center justify-between p-6 border-b bg-gradient-primary text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
              <img 
                src="/lovable-uploads/60937367-1e73-4f00-acf4-a275a8cff443.png" 
                alt="DropSi Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">DropSi Vendor Dashboard</h1>
              <p className="text-blue-100 text-sm">Manage your grocery business</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm bg-white/20 text-white border-white/30">
            {vendor.displayName}
          </Badge>
        </div>
        <Button variant="outline" onClick={handleLogout} className="border-white text-white bg-white/10">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Discounts
            </TabsTrigger>
            <TabsTrigger value="areas" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Service Areas
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <MainDashboard 
              onAddMoreProducts={handleAddMoreProducts}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="profile">
            <VendorProfile />
          </TabsContent>

          <TabsContent value="discounts">
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <Loading size="lg" text="Loading products..." />
              </div>
            ) : (
              <DiscountManagement vendorProducts={vendorProducts} />
            )}
          </TabsContent>

          <TabsContent value="areas">
            <PincodeManagement vendorId={vendor.id} />
          </TabsContent>

          <TabsContent value="performance">
            <OrderPerformance vendorId={vendor.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;