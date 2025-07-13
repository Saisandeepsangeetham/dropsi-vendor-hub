import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, IndianRupee, ArrowRight, ArrowLeft } from "lucide-react";
import { Product, VendorProduct } from "@/pages/VendorDashboard";
import { useToast } from "@/hooks/use-toast";

interface PricingSetupProps {
  selectedProducts: Product[];
  onComplete: (vendorProducts: VendorProduct[]) => void;
  isAddingToExisting?: boolean;
  onCancel?: () => void;
}

const PricingSetup = ({ selectedProducts, onComplete, isAddingToExisting = false, onCancel }: PricingSetupProps) => {
  const [productConfigs, setProductConfigs] = useState<Record<string, Partial<VendorProduct>>>(
    selectedProducts.reduce((acc, product) => ({
      ...acc,
      [product.id]: {
        price: 0,
        mrp: 0,
        stock_qty: 0,
        is_active: true,
        delivery_supported: false
      }
    }), {})
  );
  const { toast } = useToast();

  const updateProductConfig = (productId: string, field: keyof VendorProduct, value: any) => {
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
             config?.mrp && config.mrp > 0 &&
             config?.stock_qty && config.stock_qty > 0 &&
             config.mrp >= config.price; // MRP should be >= selling price
    });
  };

  const handleComplete = async () => {
    if (!isFormValid()) {
      toast({
        title: "Invalid configuration",
        description: "Please ensure all fields are filled and MRP is greater than or equal to selling price.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Replace with actual Supabase insert to vendor_products table
      // const vendorProductsData = selectedProducts.map(product => ({
      //   vendor_id: vendorId,
      //   product_id: product.id,
      //   price: productConfigs[product.id]?.price || 0,
      //   mrp: productConfigs[product.id]?.mrp || 0,
      //   stock_qty: productConfigs[product.id]?.stock_qty || 0,
      //   is_active: productConfigs[product.id]?.is_active || true,
      //   delivery_supported: productConfigs[product.id]?.delivery_supported || false
      // }));

      // const { data, error } = await supabase
      //   .from('vendor_products')
      //   .insert(vendorProductsData)
      //   .select('*, products!inner(*)');

      // Mock the vendor products with proper structure
      const vendorProducts: VendorProduct[] = selectedProducts.map(product => ({
        id: `vp-${product.id}`,
        vendor_id: "vendor-1",
        product_id: product.id,
        price: productConfigs[product.id]?.price || 0,
        mrp: productConfigs[product.id]?.mrp || 0,
        stock_qty: productConfigs[product.id]?.stock_qty || 0,
        is_active: productConfigs[product.id]?.is_active || true,
        delivery_supported: productConfigs[product.id]?.delivery_supported || false,
        product: product
      }));

      onComplete(vendorProducts);

      toast({
        title: "Products configured successfully",
        description: `${selectedProducts.length} products have been added to your inventory.`,
      });
    } catch (error) {
      toast({
        title: "Configuration failed",
        description: "Failed to configure products. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            {isAddingToExisting && onCancel && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCancel} 
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            {/* Title */}
            <div className="flex items-center gap-3">
              <IndianRupee className="h-10 w-10" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-poppins">
                  {isAddingToExisting ? "Configure New Products" : "Pricing Setup"}
                </h1>
                <p className="text-blue-100 text-sm md:text-base font-inter">
                  {isAddingToExisting 
                    ? "Configure pricing, stock, and delivery for your new products" 
                    : "Configure pricing, capacity, and stock for your selected products"
                  }
                </p>
              </div>
            </div>
          </div>
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
                      <p className="text-sm text-muted-foreground">{product.brand_name}</p>
                      <div className="flex gap-1 mt-1">
                        {product.categories.map(cat => (
                          <Badge key={cat.id} variant="outline" className="text-xs">{cat.name}</Badge>
                        ))}
                        <Badge variant="secondary" className="text-xs">UoM: {product.uom}</Badge>
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* MRP */}
                  <div className="space-y-2">
                    <Label htmlFor={`mrp-${product.id}`}>MRP (₹)</Label>
                    <Input
                      id={`mrp-${product.id}`}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={productConfigs[product.id]?.mrp || ""}
                      onChange={(e) => updateProductConfig(product.id, 'mrp', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {/* Selling Price */}
                  <div className="space-y-2">
                    <Label htmlFor={`price-${product.id}`}>Selling Price (₹)</Label>
                    <Input
                      id={`price-${product.id}`}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={productConfigs[product.id]?.price || ""}
                      onChange={(e) => updateProductConfig(product.id, 'price', parseFloat(e.target.value) || 0)}
                    />
                    {productConfigs[product.id]?.price && productConfigs[product.id]?.mrp && 
                     productConfigs[product.id]?.price! > productConfigs[product.id]?.mrp! && (
                      <p className="text-xs text-destructive">Price cannot exceed MRP</p>
                    )}
                  </div>

                  {/* Stock Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor={`stock-${product.id}`}>Stock Quantity</Label>
                    <Input
                      id={`stock-${product.id}`}
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={productConfigs[product.id]?.stock_qty || ""}
                      onChange={(e) => updateProductConfig(product.id, 'stock_qty', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">Per {product.uom}</p>
                  </div>

                  {/* Delivery Support */}
                  <div className="space-y-2">
                    <Label htmlFor={`delivery-${product.id}`}>Delivery Service</Label>
                    <div className="flex items-center space-x-2 mt-3">
                      <Switch
                        id={`delivery-${product.id}`}
                        checked={productConfigs[product.id]?.delivery_supported || false}
                        onCheckedChange={(checked) => updateProductConfig(product.id, 'delivery_supported', checked)}
                      />
                      <Label htmlFor={`delivery-${product.id}`} className="text-sm">
                        {productConfigs[product.id]?.delivery_supported ? "I provide delivery" : "DropSi handles delivery"}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                {productConfigs[product.id]?.price && productConfigs[product.id]?.mrp && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">MRP:</span>
                        <span className="font-semibold ml-1">₹{productConfigs[product.id]?.mrp}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Your Price:</span>
                        <span className="font-semibold ml-1">₹{productConfigs[product.id]?.price}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Margin:</span>
                        <span className="font-semibold ml-1 text-success">
                          ₹{((productConfigs[product.id]?.mrp || 0) - (productConfigs[product.id]?.price || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Info */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {productConfigs[product.id]?.delivery_supported 
                        ? "You will handle delivery for this product"
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
            {isAddingToExisting ? "Add Products to Inventory" : "Complete Setup & Go to Dashboard"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {!isFormValid() && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Please fill all required fields and ensure selling price does not exceed MRP
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingSetup;