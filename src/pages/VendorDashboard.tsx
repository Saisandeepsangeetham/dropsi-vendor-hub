import { useState } from "react";
import VendorAuth from "@/components/vendor/VendorAuth";
import VendorProfile from "@/components/vendor/VendorProfile";
import PincodeManagement from "@/components/vendor/PincodeManagement";
import OrderPerformance from "@/components/vendor/OrderPerformance";
import DiscountManagement from "@/components/vendor/DiscountManagement";
import ProductCatalog from "@/components/vendor/ProductCatalog";
import PricingSetup from "@/components/vendor/PricingSetup";
import MainDashboard from "@/components/vendor/MainDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, User, MapPin, BarChart3, Package, Tag } from "lucide-react";

export type Brand = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  display_order: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  brand_id: string;
  brand_name: string;
  uom: string;
  image_url: string;
  is_active: boolean;
  categories: Category[];
};

export type VendorProduct = {
  id: string;
  vendor_id: string;
  product_id: string;
  price: number;
  mrp: number;
  stock_qty: number;
  is_active: boolean;
  delivery_supported: boolean;
  product: Product;
};

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
  const [vendor, setVendor] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('catalog');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const handleProductsSelected = (products: Product[]) => {
    setSelectedProducts(products);
    setCurrentStep('pricing');
  };

  const handlePricingComplete = (products: VendorProduct[]) => {
    setVendorProducts(products);
    setCurrentStep('completed');
  };

  const handleUpdateVendorProduct = (vendorProductId: string, updates: Partial<VendorProduct>) => {
    setVendorProducts(prev => 
      prev.map(vp => 
        vp.id === vendorProductId ? { ...vp, ...updates } : vp
      )
    );
  };

  const handleVendorUpdate = (updates: any) => {
    setVendor(prev => ({ ...prev, ...updates }));
  };

  const handleLogout = () => {
    setVendor(null);
    setCurrentStep('catalog');
    setSelectedProducts([]);
    setVendorProducts([]);
  };

  // If not authenticated, show auth form
  if (!vendor) {
    return <VendorAuth onAuthenticated={setVendor} />;
  }

  // Onboarding flow for new vendors
  if (currentStep === 'catalog') {
    return (
      <ProductCatalog 
        onProductsSelected={handleProductsSelected}
      />
    );
  }

  if (currentStep === 'pricing') {
    return (
      <PricingSetup 
        selectedProducts={selectedProducts}
        onComplete={handlePricingComplete}
      />
    );
  }

  // Main vendor dashboard with tabs
  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/60937367-1e73-4f00-acf4-a275a8cff443.png" 
                    alt="DropSi Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-3xl font-bold">DropSi Vendor Portal</h1>
              </div>
              <p className="text-blue-100">Welcome back, {vendor.display_name}!</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Overview
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
              vendorProducts={vendorProducts}
              onUpdateVendorProduct={handleUpdateVendorProduct}
            />
          </TabsContent>

          <TabsContent value="profile">
            <VendorProfile 
              vendor={vendor}
              onUpdate={handleVendorUpdate}
            />
          </TabsContent>

          <TabsContent value="discounts">
            <DiscountManagement vendorProducts={vendorProducts} />
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