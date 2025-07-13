import { useState } from "react";
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
import { VendorProduct, Discount } from "@/pages/VendorDashboard";
import { useToast } from "@/hooks/use-toast";

interface MainDashboardProps {
  vendorProducts: VendorProduct[];
  onUpdateVendorProduct: (vendorProductId: string, updates: Partial<VendorProduct>) => void;
  onRemoveVendorProduct: (vendorProductId: string) => void;
  onAddMoreProducts: () => void;
}

const MainDashboard = ({ vendorProducts, onUpdateVendorProduct, onRemoveVendorProduct, onAddMoreProducts }: MainDashboardProps) => {
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

  const handleRemoveProduct = (vendorProductId: string, productName: string) => {
    onRemoveVendorProduct(vendorProductId);
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
      // TODO: Replace with actual Supabase insert
      // const { error } = await supabase
      //   .from('discounts')
      //   .insert([{
      //     vendor_product_id: selectedVendorProduct.id,
      //     ...newDiscount,
      //     discounted_price: calculateDiscountedPrice(selectedVendorProduct.price, newDiscount.discount_type, newDiscount.discount_value)
      //   }]);

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
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">MRP</span>
                            <span className="font-semibold">₹{vendorProduct.mrp}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Price</span>
                            <span className="font-semibold">₹{vendorProduct.price}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Stock</span>
                            <span className="font-semibold">{vendorProduct.stock_qty} {vendorProduct.product.uom}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Value</span>
                            <span className="font-semibold">₹{(vendorProduct.price * vendorProduct.stock_qty).toFixed(2)}</span>
                          </div>
                          <div className="flex flex-col col-span-2 sm:col-span-1">
                            <span className="text-muted-foreground text-xs">Delivery</span>
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {vendorProduct.delivery_supported ? "Self" : "DropSi"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateDiscount(vendorProduct)}
                          >
                            <Tag className="h-4 w-4 mr-1" />
                            Discount
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Create Discount for {selectedVendorProduct?.product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="discount-type">Discount Type</Label>
                                <Select 
                                  value={newDiscount.discount_type} 
                                  onValueChange={(value: "percentage" | "flat") => setNewDiscount(prev => ({ ...prev, discount_type: value }))}
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
                                <Label htmlFor="discount-value">
                                  Discount Value {newDiscount.discount_type === "percentage" ? "(%)" : "(₹)"}
                                </Label>
                                <Input
                                  id="discount-value"
                                  type="number"
                                  step="0.01"
                                  value={newDiscount.discount_value || ""}
                                  onChange={(e) => setNewDiscount(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="card-title">Discount Title</Label>
                              <Input
                                id="card-title"
                                placeholder="e.g., Weekend Special, Flash Sale"
                                value={newDiscount.card_title || ""}
                                onChange={(e) => setNewDiscount(prev => ({ ...prev, card_title: e.target.value }))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                placeholder="Describe the discount offer"
                                value={newDiscount.description || ""}
                                onChange={(e) => setNewDiscount(prev => ({ ...prev, description: e.target.value }))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="terms">Terms & Conditions</Label>
                              <Textarea
                                id="terms"
                                placeholder="Enter terms and conditions"
                                value={newDiscount.terms || ""}
                                onChange={(e) => setNewDiscount(prev => ({ ...prev, terms: e.target.value }))}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="start-date">Start Date & Time</Label>
                                <Input
                                  id="start-date"
                                  type="datetime-local"
                                  value={newDiscount.starts_at || ""}
                                  onChange={(e) => setNewDiscount(prev => ({ ...prev, starts_at: e.target.value }))}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="end-date">End Date & Time (Optional)</Label>
                                <Input
                                  id="end-date"
                                  type="datetime-local"
                                  value={newDiscount.ends_at || ""}
                                  onChange={(e) => setNewDiscount(prev => ({ ...prev, ends_at: e.target.value }))}
                                />
                              </div>
                            </div>

                            {/* Price Preview */}
                            {selectedVendorProduct && newDiscount.discount_value > 0 && (
                              <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-2">Price Preview</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Original Price:</span>
                                    <span className="font-semibold ml-1">₹{selectedVendorProduct.price}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {newDiscount.discount_type === "percentage" ? (
                                      <Percent className="h-3 w-3" />
                                    ) : (
                                      <IndianRupee className="h-3 w-3" />
                                    )}
                                    <span className="font-medium">
                                      {newDiscount.discount_value}{newDiscount.discount_type === "percentage" ? "%" : "₹"} off
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Final Price:</span>
                                    <span className="font-semibold ml-1 text-success">
                                      ₹{calculateDiscountedPrice(selectedVendorProduct.price, newDiscount.discount_type, newDiscount.discount_value).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProduct(vendorProduct.id, vendorProduct.product.name)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
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