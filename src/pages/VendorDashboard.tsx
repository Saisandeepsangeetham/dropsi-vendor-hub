import { useState } from "react";
import VendorAuth from "@/components/vendor/VendorAuth";
import VendorProfile from "@/components/vendor/VendorProfile";
import PincodeManagement from "@/components/vendor/PincodeManagement";
import OrderPerformance from "@/components/vendor/OrderPerformance";
import ProductCatalog from "@/components/vendor/ProductCatalog";
import PricingSetup from "@/components/vendor/PricingSetup";
import MainDashboard from "@/components/vendor/MainDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, User, MapPin, BarChart3, Package } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  description: string;
};

export type SelectedProduct = Product & {
  price: number;
  capacity: string;
  stock: number;
  isAvailable: boolean;
  hasDelivery: boolean;
};

export type OnboardingStep = 'catalog' | 'pricing' | 'completed';

const VendorDashboard = () => {
  const [vendor, setVendor] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('catalog');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [configuredProducts, setConfiguredProducts] = useState<SelectedProduct[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const handleProductsSelected = (products: Product[]) => {
    setSelectedProducts(products);
    setCurrentStep('pricing');
  };

  const handlePricingComplete = (products: SelectedProduct[]) => {
    setConfiguredProducts(products);
    setCurrentStep('completed');
  };

  const handleUpdateProduct = (productId: string, updates: Partial<SelectedProduct>) => {
    setConfiguredProducts(prev => 
      prev.map(product => 
        product.id === productId ? { ...product, ...updates } : product
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
    setConfiguredProducts([]);
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
                <Package className="h-8 w-8" />
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
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
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
              products={configuredProducts}
              onUpdateProduct={handleUpdateProduct}
            />
          </TabsContent>

          <TabsContent value="profile">
            <VendorProfile 
              vendor={vendor}
              onUpdate={handleVendorUpdate}
            />
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