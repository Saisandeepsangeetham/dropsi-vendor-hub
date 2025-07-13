import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Truck, IndianRupee, Edit, BarChart3, Settings, CheckCircle, XCircle, Tag, Plus } from "lucide-react";
import { VendorProduct, Discount } from "@/pages/VendorDashboard";
import { useToast } from "@/hooks/use-toast";

interface MainDashboardProps {
  vendorProducts: VendorProduct[];
  onUpdateVendorProduct: (vendorProductId: string, updates: Partial<VendorProduct>) => void;
}

const MainDashboard = ({ vendorProducts, onUpdateVendorProduct }: MainDashboardProps) => {
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
  const [editForm, setEditForm] = useState<Partial<VendorProduct>>({});
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [selectedVendorProduct, setSelectedVendorProduct] = useState<VendorProduct | null>(null);
  const { toast } = useToast();

  const handleEditClick = (vendorProduct: VendorProduct) => {
    setEditingProduct(vendorProduct);
    setEditForm(vendorProduct);
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      onUpdateVendorProduct(editingProduct.id, editForm);
      setEditingProduct(null);
      toast({
        title: "Product updated",
        description: "Product details have been updated successfully.",
      });
    }
  };

  const toggleAvailability = (vendorProductId: string, isActive: boolean) => {
    onUpdateVendorProduct(vendorProductId, { is_active: isActive });
    toast({
      title: isActive ? "Product activated" : "Product deactivated",
      description: `Product is now ${isActive ? "available" : "unavailable"} for sale.`,
    });
  };

  const handleCreateDiscount = (vendorProduct: VendorProduct) => {
    setSelectedVendorProduct(vendorProduct);
    setShowDiscountDialog(true);
  };

  // Calculate dashboard metrics
  const totalProducts = vendorProducts.length;
  const availableProducts = vendorProducts.filter(vp => vp.is_active).length;
  const totalStock = vendorProducts.reduce((sum, vp) => sum + vp.stock_qty, 0);
  const totalValue = vendorProducts.reduce((sum, vp) => sum + (vp.price * vp.stock_qty), 0);

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
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Products Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vendorProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products configured</h3>
              <p className="text-muted-foreground">Complete the onboarding process to add products to your inventory</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorProducts.map(vendorProduct => (
                <div key={vendorProduct.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{vendorProduct.product.name}</h3>
                          {vendorProduct.product.categories.map(category => (
                            <Badge key={category.id} variant="secondary">{category.name}</Badge>
                          ))}
                          {vendorProduct.is_active ? (
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
                        <p className="text-sm text-muted-foreground mb-2">{vendorProduct.product.brand_name}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">MRP:</span>
                            <span className="font-semibold ml-1">₹{vendorProduct.mrp}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold ml-1">₹{vendorProduct.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stock:</span>
                            <span className="font-semibold ml-1">{vendorProduct.stock_qty} {vendorProduct.product.uom}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold ml-1">₹{(vendorProduct.price * vendorProduct.stock_qty).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {vendorProduct.delivery_supported ? "Self Delivery" : "DropSi Delivery"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateDiscount(vendorProduct)}
                      >
                        <Tag className="h-4 w-4 mr-1" />
                        Discount
                      </Button>
                      <Switch
                        checked={vendorProduct.is_active}
                        onCheckedChange={(checked) => toggleAvailability(vendorProduct.id, checked)}
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(vendorProduct)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-mrp">MRP (₹)</Label>
                              <Input
                                id="edit-mrp"
                                type="number"
                                step="0.01"
                                value={editForm.mrp || ""}
                                onChange={(e) => setEditForm(prev => ({ ...prev, mrp: parseFloat(e.target.value) || 0 }))}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-price">Selling Price (₹)</Label>
                              <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                value={editForm.price || ""}
                                onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-stock">Stock Quantity</Label>
                              <Input
                                id="edit-stock"
                                type="number"
                                step="0.01"
                                value={editForm.stock_qty || ""}
                                onChange={(e) => setEditForm(prev => ({ ...prev, stock_qty: parseFloat(e.target.value) || 0 }))}
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={editForm.delivery_supported || false}
                                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, delivery_supported: checked }))}
                              />
                              <Label className="text-sm">
                                {editForm.delivery_supported ? "I provide delivery" : "DropSi handles delivery"}
                              </Label>
                            </div>
                            
                            <Button onClick={handleSaveEdit} className="w-full">
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainDashboard;