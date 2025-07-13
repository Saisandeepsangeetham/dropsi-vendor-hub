import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, IndianRupee, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Product, VendorProduct, ProductManager } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";

interface PricingSetupProps {
  selectedProducts: Product[];
  onComplete: (vendorProducts: VendorProduct[]) => void;
  isAddingToExisting?: boolean;
  onCancel?: () => void;
}

const PricingSetup = ({ selectedProducts, onComplete, isAddingToExisting = false, onCancel }: PricingSetupProps) => {
  const [productConfigs, setProductConfigs] = useState<Record<string, {
    price: number;
    mrp: number;
    stockQty: number;
    isActive: boolean;
    deliverySupported: boolean;
  }>>(
    selectedProducts.reduce((acc, product) => ({
      ...acc,
      [product.id]: {
        price: 0,
        mrp: 0,
        stockQty: 0,
        isActive: true,
        deliverySupported: false
      }
    }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateProductConfig = (productId: string, field: string, value: any) => {
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
             config?.stockQty && config.stockQty > 0 &&
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
      setIsSubmitting(true);

      // Prepare data for bulk add API
      const productsToAdd = selectedProducts.map(product => {
        const config = productConfigs[product.id];
        return {
          productId: product.id,
          price: config.price,
          mrp: config.mrp,
          stockQty: config.stockQty,
          deliverySupported: config.deliverySupported
        };
      });

      // Call bulk add API
      const response = await ProductManager.bulkAddProducts(productsToAdd);

      if (response.success) {
        // Convert the response to VendorProduct format for the dashboard
        const vendorProducts: VendorProduct[] = response.results.success.map((vp: any) => ({
          id: vp.id,
          vendorId: vp.vendorId,
          productId: vp.productId,
          price: vp.price,
          mrp: vp.mrp,
          stockQty: vp.stockQty,
          isActive: vp.isActive,
          deliverySupported: vp.deliverySupported,
          product: selectedProducts.find(p => p.id === vp.productId)!
        }));

        onComplete(vendorProducts);

        toast({
          title: "Products configured successfully",
          description: `${response.summary.successful} products have been added to your inventory.`,
        });
      } else {
        throw new Error("Failed to add products");
      }
    } catch (error) {
      toast({
        title: "Configuration failed",
        description: error instanceof Error ? error.message : "Failed to configure products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const nextSibling = target.nextElementSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                      <Package className="h-6 w-6 text-muted-foreground" style={{ display: 'none' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brandName}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">{product.brandName}</Badge>
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      value={productConfigs[product.id]?.stockQty || ""}
                      onChange={(e) => updateProductConfig(product.id, 'stockQty', parseFloat(e.target.value) || 0)}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">Per {product.uom}</p>
                  </div>

                  {/* Delivery Support */}
                  <div className="space-y-2">
                    <Label htmlFor={`delivery-${product.id}`}>Delivery Service</Label>
                    <div className="flex items-center space-x-2 mt-3">
                      <Switch
                        id={`delivery-${product.id}`}
                        checked={productConfigs[product.id]?.deliverySupported || false}
                        onCheckedChange={(checked) => updateProductConfig(product.id, 'deliverySupported', checked)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`delivery-${product.id}`} className="text-sm">
                        {productConfigs[product.id]?.deliverySupported ? "I provide delivery" : "DropSi handles delivery"}
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center">
          {isAddingToExisting && onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Button>
          )}
          
          <div className="ml-auto">
            <Button 
              onClick={handleComplete} 
              disabled={!isFormValid() || isSubmitting}
              className="px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Products...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSetup;