import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, IndianRupee, ArrowRight } from "lucide-react";
import { Product, SelectedProduct } from "@/pages/VendorDashboard";

const CAPACITY_OPTIONS = [
  "250ml", "500ml", "1L", "2L",
  "250g", "500g", "1kg", "2kg", "5kg",
  "1 piece", "6 pieces", "12 pieces"
];

interface PricingSetupProps {
  selectedProducts: Product[];
  onComplete: (products: SelectedProduct[]) => void;
}

const PricingSetup = ({ selectedProducts, onComplete }: PricingSetupProps) => {
  const [productConfigs, setProductConfigs] = useState<Record<string, Partial<SelectedProduct>>>(
    selectedProducts.reduce((acc, product) => ({
      ...acc,
      [product.id]: {
        price: 0,
        capacity: "",
        stock: 0,
        isAvailable: true,
        hasDelivery: false
      }
    }), {})
  );

  const updateProductConfig = (productId: string, field: keyof SelectedProduct, value: any) => {
    setProductConfigs(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const isFormValid = () => {
    return selectedProducts.every(product => {
      const config = productConfigs[product.id];
      return config?.price && config.price > 0 && 
             config?.capacity && 
             config?.stock && config.stock > 0;
    });
  };

  const handleComplete = () => {
    const configuredProducts: SelectedProduct[] = selectedProducts.map(product => ({
      ...product,
      ...productConfigs[product.id] as Omit<SelectedProduct, keyof Product>
    }));
    onComplete(configuredProducts);
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <IndianRupee className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Pricing Setup</h1>
          </div>
          <p className="text-blue-100">Configure pricing, capacity, and stock for your selected products</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {selectedProducts.map((product, index) => (
            <Card key={product.id} className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor={`price-${product.id}`}>Price (₹)</Label>
                    <Input
                      id={`price-${product.id}`}
                      type="number"
                      placeholder="0.00"
                      value={productConfigs[product.id]?.price || ""}
                      onChange={(e) => updateProductConfig(product.id, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {/* Capacity */}
                  <div className="space-y-2">
                    <Label htmlFor={`capacity-${product.id}`}>Capacity/Size</Label>
                    <Select onValueChange={(value) => updateProductConfig(product.id, 'capacity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAPACITY_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <Label htmlFor={`stock-${product.id}`}>Stock Quantity</Label>
                    <Input
                      id={`stock-${product.id}`}
                      type="number"
                      placeholder="0"
                      value={productConfigs[product.id]?.stock || ""}
                      onChange={(e) => updateProductConfig(product.id, 'stock', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Delivery Toggle */}
                  <div className="space-y-2">
                    <Label htmlFor={`delivery-${product.id}`}>Delivery Service</Label>
                    <div className="flex items-center space-x-2 mt-3">
                      <Switch
                        id={`delivery-${product.id}`}
                        checked={productConfigs[product.id]?.hasDelivery || false}
                        onCheckedChange={(checked) => updateProductConfig(product.id, 'hasDelivery', checked)}
                      />
                      <Label htmlFor={`delivery-${product.id}`} className="text-sm">
                        {productConfigs[product.id]?.hasDelivery ? "I provide delivery" : "DropSi handles delivery"}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {productConfigs[product.id]?.hasDelivery 
                        ? "You'll handle delivery for this product"
                        : "DropSi will assign a delivery partner for this product"
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Complete Setup Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleComplete}
            disabled={!isFormValid()}
            size="lg"
            className="flex items-center gap-2"
          >
            Complete Setup & Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingSetup;