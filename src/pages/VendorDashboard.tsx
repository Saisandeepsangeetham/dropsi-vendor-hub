import { useState } from "react";
import ProductCatalog from "@/components/vendor/ProductCatalog";
import PricingSetup from "@/components/vendor/PricingSetup";
import MainDashboard from "@/components/vendor/MainDashboard";

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
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('catalog');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [configuredProducts, setConfiguredProducts] = useState<SelectedProduct[]>([]);

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

  return (
    <MainDashboard 
      products={configuredProducts}
      onUpdateProduct={handleUpdateProduct}
    />
  );
};

export default VendorDashboard;