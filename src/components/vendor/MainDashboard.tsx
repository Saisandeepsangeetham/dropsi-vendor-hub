import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Truck, IndianRupee, Edit, BarChart3, Settings, CheckCircle, XCircle } from "lucide-react";
import { SelectedProduct } from "@/pages/VendorDashboard";

const CAPACITY_OPTIONS = [
  "250ml", "500ml", "1L", "2L",
  "250g", "500g", "1kg", "2kg", "5kg",
  "1 piece", "6 pieces", "12 pieces"
];

interface MainDashboardProps {
  products: SelectedProduct[];
  onUpdateProduct: (productId: string, updates: Partial<SelectedProduct>) => void;
}

const MainDashboard = ({ products, onUpdateProduct }: MainDashboardProps) => {
  const [editingProduct, setEditingProduct] = useState<SelectedProduct | null>(null);
  const [editForm, setEditForm] = useState<Partial<SelectedProduct>>({});

  const handleEditClick = (product: SelectedProduct) => {
    setEditingProduct(product);
    setEditForm(product);
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, editForm);
      setEditingProduct(null);
    }
  };

  const toggleAvailability = (productId: string, isAvailable: boolean) => {
    onUpdateProduct(productId, { isAvailable });
  };

  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.isAvailable).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
              </div>
              <p className="text-blue-100">Manage your products, pricing, and inventory</p>
            </div>
            <Button variant="secondary" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-2xl font-bold">{totalStock}</p>
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
              Your Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge variant="secondary">{product.category}</Badge>
                          {product.isAvailable ? (
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
                        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold ml-1">₹{product.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Capacity:</span>
                            <span className="font-semibold ml-1">{product.capacity}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stock:</span>
                            <span className="font-semibold ml-1">{product.stock}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {product.hasDelivery ? "Self Delivery" : "DropSi Delivery"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.isAvailable}
                        onCheckedChange={(checked) => toggleAvailability(product.id, checked)}
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(product)}
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
                              <Label htmlFor="edit-price">Price (₹)</Label>
                              <Input
                                id="edit-price"
                                type="number"
                                value={editForm.price || ""}
                                onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-capacity">Capacity/Size</Label>
                              <Select onValueChange={(value) => setEditForm(prev => ({ ...prev, capacity: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder={editForm.capacity || "Select capacity"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {CAPACITY_OPTIONS.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-stock">Stock Quantity</Label>
                              <Input
                                id="edit-stock"
                                type="number"
                                value={editForm.stock || ""}
                                onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={editForm.hasDelivery || false}
                                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, hasDelivery: checked }))}
                              />
                              <Label className="text-sm">
                                {editForm.hasDelivery ? "I provide delivery" : "DropSi handles delivery"}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainDashboard;