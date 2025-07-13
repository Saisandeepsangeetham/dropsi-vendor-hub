import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Truck, IndianRupee, Edit, BarChart3, Settings, CheckCircle, XCircle, Tag, Plus, Trash2, Save, Percent } from "lucide-react";
import { VendorProduct, ProductManager } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";

interface MainDashboardProps {
  onAddMoreProducts: () => void;
}

const MainDashboard = ({ onAddMoreProducts }: MainDashboardProps) => {
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
  const [editForm, setEditForm] = useState<Partial<VendorProduct>>({});
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [selectedVendorProduct, setSelectedVendorProduct] = useState<VendorProduct | null>(null);
  const [newDiscount, setNewDiscount] = useState({
    discount_type: "percentage" as "percentage" | "flat",
    discount_value: 0,
    card_title: "",
    description: "",
    terms: "",
    starts_at: "",
    ends_at: ""
  });
  const { toast } = useToast();

  // Load vendor products from API
  useEffect(() => {
    const loadVendorProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const products = await ProductManager.getVendorProducts();
        console.log('Vendor products loaded:', products); // Debug log
        console.log('First product structure:', products[0]); // Debug log
        setVendorProducts(products);
      } catch (error) {
        console.error('Error loading vendor products:', error); // Debug log
        setError(error instanceof Error ? error.message : 'Failed to load products');
        toast({
          title: "Error loading products",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVendorProducts();
  }, [toast]);

  const handleEditClick = (vendorProduct: VendorProduct) => {
    setEditingProduct(vendorProduct);
    setEditForm(vendorProduct);
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      // TODO: Implement update API call
      setVendorProducts(prev => 
        prev.map(vp => 
          vp.id === editingProduct.id ? { ...vp, ...editForm } : vp
        )
      );
      setEditingProduct(null);
      toast({
        title: "Product updated",
        description: "Product details have been updated successfully.",
      });
    }
  };

  const toggleAvailability = (vendorProductId: string, isActive: boolean) => {
    // TODO: Implement update API call
    setVendorProducts(prev => 
      prev.map(vp => 
        vp.id === vendorProductId ? { ...vp, isActive } : vp
      )
    );
    toast({
      title: isActive ? "Product activated" : "Product deactivated",
      description: `Product is now ${isActive ? "available" : "unavailable"} for sale.`,
    });
  };

  const handleRemoveProduct = (vendorProductId: string, productName: string) => {
    // TODO: Implement delete API call
    setVendorProducts(prev => prev.filter(vp => vp.id !== vendorProductId));
    toast({
      title: "Product removed",
      description: `${productName} has been removed from your inventory.`,
    });
  };

  const handleCreateDiscount = (vendorProduct: VendorProduct) => {
    setSelectedVendorProduct(vendorProduct);
    setNewDiscount({
      discount_type: "percentage",
      discount_value: 0,
      card_title: "",
      description: "",
      terms: "",
      starts_at: "",
      ends_at: ""
    });
    setShowDiscountDialog(true);
  };

  const calculateDiscountedPrice = (originalPrice: number, discountType: "percentage" | "flat", discountValue: number) => {
    if (discountType === "percentage") {
      return originalPrice - (originalPrice * discountValue / 100);
    } else {
      return originalPrice - discountValue;
    }
  };

  const handleSaveDiscount = async () => {
    if (!selectedVendorProduct || !newDiscount.card_title || !newDiscount.discount_value) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Replace with actual API call
      const discountedPrice = calculateDiscountedPrice(
        selectedVendorProduct.price,
        newDiscount.discount_type,
        newDiscount.discount_value
      );

      setShowDiscountDialog(false);
      setSelectedVendorProduct(null);

      toast({
        title: "Discount created successfully",
        description: `Discount "${newDiscount.card_title}" has been created for ${selectedVendorProduct.product.name}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to create discount",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" text="Loading your products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Package className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Ensure vendorProducts is an array
  if (!Array.isArray(vendorProducts)) {
    console.error('vendorProducts is not an array:', vendorProducts);
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Package className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Invalid data format</h3>
        <p className="text-muted-foreground mb-4">Received unexpected data format from server.</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Calculate dashboard metrics
  const totalProducts = vendorProducts.length;
  const availableProducts = vendorProducts.filter(vp => vp.isActive).length;
  const totalStock = vendorProducts.reduce((sum, vp) => {
    const stockQty = typeof vp.stockQty === 'number' ? vp.stockQty : 0;
    return sum + stockQty;
  }, 0);
  const totalValue = vendorProducts.reduce((sum, vp) => {
    const price = typeof vp.price === 'number' ? vp.price : 0;
    const stockQty = typeof vp.stockQty === 'number' ? vp.stockQty : 0;
    return sum + (price * stockQty);
  }, 0);

  // Debug log for metrics
  console.log('Dashboard metrics:', { totalProducts, availableProducts, totalStock, totalValue });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-success">{availableProducts}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold">{totalStock.toFixed(2)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Your Products Inventory
            </div>
            <Button onClick={onAddMoreProducts} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add More Products
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vendorProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products configured</h3>
              <p className="text-muted-foreground mb-4">Complete the onboarding process to add products to your inventory</p>
              <Button onClick={onAddMoreProducts}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorProducts.map(vendorProduct => (
                <div key={vendorProduct.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        {vendorProduct.product.imageUrl ? (
                          <img 
                            src={vendorProduct.product.imageUrl} 
                            alt={vendorProduct.product.name}
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
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                        <Package className="h-8 w-8 text-muted-foreground" style={{ display: 'none' }} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{vendorProduct.product.name}</h3>
                          <Badge variant="secondary">{vendorProduct.product.brandName}</Badge>
                          {vendorProduct.isActive ? (
                            <Badge variant="outline" className="text-success border-success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-destructive border-destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{vendorProduct.product.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">MRP</span>
                            <span className="font-semibold">₹{vendorProduct.mrp}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Price</span>
                            <span className="font-semibold text-primary">₹{vendorProduct.price}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Stock</span>
                            <span className="font-semibold">{vendorProduct.stockQty} {vendorProduct.product.uom}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Delivery</span>
                            <span className="font-semibold">
                              {vendorProduct.deliverySupported ? "Self" : "DropSi"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Value</span>
                            <span className="font-semibold">₹{(vendorProduct.price * vendorProduct.stockQty).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={vendorProduct.isActive}
                        onCheckedChange={(checked) => toggleAvailability(vendorProduct.id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(vendorProduct)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateDiscount(vendorProduct)}
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProduct(vendorProduct.id, vendorProduct.product.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={editForm.price || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>MRP (₹)</Label>
                  <Input
                    type="number"
                    value={editForm.mrp || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, mrp: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={editForm.stockQty || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, stockQty: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editForm.deliverySupported || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, deliverySupported: checked }))}
                />
                <Label>I provide delivery</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Discount Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={newDiscount.discount_type}
                  onValueChange={(value: "percentage" | "flat") => 
                    setNewDiscount(prev => ({ ...prev, discount_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  value={newDiscount.discount_value}
                  onChange={(e) => setNewDiscount(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Discount Title</Label>
              <Input
                value={newDiscount.card_title}
                onChange={(e) => setNewDiscount(prev => ({ ...prev, card_title: e.target.value }))}
                placeholder="e.g., Weekend Special"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newDiscount.description}
                onChange={(e) => setNewDiscount(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the discount offer"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDiscountDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveDiscount}>
                <Save className="h-4 w-4 mr-2" />
                Create Discount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainDashboard;