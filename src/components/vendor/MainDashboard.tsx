import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Truck,
  IndianRupee,
  Edit,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Tag,
  Plus,
  Trash2,
  Save,
  Percent,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  VendorProduct,
  ProductManager,
  Product,
  DiscountManager,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";
import { toTitleCase } from "@/lib/utils";
import ProductCatalog from "@/components/vendor/ProductCatalog";
import { useTranslation } from "react-i18next";

interface MainDashboardProps {
  onAddMoreProducts: () => void;
}

const MainDashboard = ({ onAddMoreProducts }: MainDashboardProps) => {
  const { t } = useTranslation();
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(
    null
  );
  const [editForm, setEditForm] = useState<Partial<VendorProduct>>({});
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [productDiscounts, setProductDiscounts] = useState<Record<string, any>>(
    {}
  );
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);

  // Add More Products Modal State
  const [showAddProductsModal, setShowAddProductsModal] = useState(false);
  const { toast } = useToast();

  // Load vendor products from API
  useEffect(() => {
    const loadVendorProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const products = await ProductManager.getVendorProducts();
        console.log("Vendor products loaded:", products); // Debug log
        console.log("First product structure:", products[0]); // Debug log
        setVendorProducts(products);
      } catch (error) {
        console.error("Error loading vendor products:", error); // Debug log
        setError(
          error instanceof Error ? error.message : "Failed to load products"
        );
        toast({
          title: "Error loading products",
          description:
            error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVendorProducts();
  }, [toast]);

  const handleAddMoreProducts = () => {
    setShowAddProductsModal(true);
  };

  const handleProductsAdded = async (newVendorProducts: VendorProduct[]) => {
    // Update local state with the new products
    setVendorProducts((prev) => [...prev, ...newVendorProducts]);

    // Close the modal
    setShowAddProductsModal(false);

    // Show success message
    toast({
      title: "Products added successfully",
      description: `${newVendorProducts.length} products have been added to your inventory.`,
    });
  };

  const handleEditClick = (vendorProduct: VendorProduct) => {
    setEditingProduct(vendorProduct);
    setEditForm({
      price: vendorProduct.price,
      mrp: vendorProduct.mrp,
      stockQty: vendorProduct.stockQty,
      deliverySupported: vendorProduct.deliverySupported,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      await ProductManager.updateVendorProduct(editingProduct.id, editForm);

      // Update local state
      setVendorProducts((prev) =>
        prev.map((vp) =>
          vp.id === editingProduct.id ? { ...vp, ...editForm } : vp
        )
      );

      setEditingProduct(null);
      setEditForm({});

      toast({
        title: "Product updated successfully",
        description: `${editingProduct.product.name} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update product",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (
    vendorProductId: string,
    isActive: boolean
  ) => {
    try {
      await ProductManager.updateVendorProduct(vendorProductId, { isActive });

      // Update local state
      setVendorProducts((prev) =>
        prev.map((vp) => (vp.id === vendorProductId ? { ...vp, isActive } : vp))
      );

      toast({
        title: isActive ? "Product activated" : "Product deactivated",
        description: `Product has been ${
          isActive ? "activated" : "deactivated"
        } successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update product status",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveProduct = async (
    vendorProductId: string,
    productName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to remove ${productName} from your inventory?`
      )
    ) {
      return;
    }

    try {
      await ProductManager.deleteVendorProduct(vendorProductId);

      // Update local state
      setVendorProducts((prev) =>
        prev.filter((vp) => vp.id !== vendorProductId)
      );

      toast({
        title: "Product removed successfully",
        description: `${productName} has been removed from your inventory.`,
      });
    } catch (error) {
      toast({
        title: "Failed to remove product",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadAllDiscounts();
  }, []);

  const loadAllDiscounts = async () => {
    try {
      const { discounts } = await DiscountManager.getAllVendorDiscounts();
      const discountsByProduct = discounts.reduce((acc, discount) => {
        acc[discount.vendorProductId] = discount;
        return acc;
      }, {} as Record<string, any>);
      setProductDiscounts(discountsByProduct);
    } catch (error) {
      console.error("Error loading discounts:", error);
    }
  };

  const handleShowDiscount = (productId: string) => {
    const discount = productDiscounts[productId];
    if (discount) {
      setSelectedDiscount(discount);
      setShowDiscountDialog(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" text={t("common.loading")} />
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
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Ensure vendorProducts is an array
  if (!Array.isArray(vendorProducts)) {
    console.error("vendorProducts is not an array:", vendorProducts);
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Package className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Invalid data format</h3>
        <p className="text-muted-foreground mb-4">
          Received unexpected data format from server.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Calculate dashboard metrics
  const totalProducts = vendorProducts.length;
  const availableProducts = vendorProducts.filter((vp) => vp.isActive).length;
  const totalStock = vendorProducts.reduce((sum, vp) => {
    const stockQty = typeof vp.stockQty === "number" ? vp.stockQty : 0;
    return sum + stockQty;
  }, 0);
  const totalValue = vendorProducts.reduce((sum, vp) => {
    const price = typeof vp.price === "number" ? vp.price : 0;
    const stockQty = typeof vp.stockQty === "number" ? vp.stockQty : 0;
    return sum + price * stockQty;
  }, 0);

  // Debug log for metrics
  console.log("Dashboard metrics:", {
    totalProducts,
    availableProducts,
    totalStock,
    totalValue,
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Available
                </p>
                <p className="text-2xl font-bold text-success">
                  {availableProducts}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Stock
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Inventory Value
                </p>
                <p className="text-2xl font-bold">
                  ₹{totalValue.toLocaleString()}
                </p>
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
            <Button
              onClick={handleAddMoreProducts}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add More Products
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vendorProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No products configured
              </h3>
              <p className="text-muted-foreground mb-4">
                Complete the onboarding process to add products to your
                inventory
              </p>
              <Button onClick={handleAddMoreProducts}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorProducts.map((vendorProduct) => {
                // Safety check for missing product information
                if (!vendorProduct.product) {
                  console.warn(
                    "Vendor product missing product information:",
                    vendorProduct
                  );
                  return null; // Skip rendering this item
                }

                const hasDiscount = !!productDiscounts[vendorProduct.id];

                return (
                  <div
                    key={vendorProduct.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {vendorProduct.product.imageUrl ? (
                            <img
                              src={vendorProduct.product.imageUrl}
                              alt={vendorProduct.product.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const target =
                                  e.currentTarget as HTMLImageElement;
                                target.style.display = "none";
                                const nextSibling =
                                  target.nextElementSibling as HTMLElement;
                                if (nextSibling) {
                                  nextSibling.style.display = "flex";
                                }
                              }}
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                          )}
                          <Package
                            className="h-8 w-8 text-muted-foreground"
                            style={{ display: "none" }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg break-words">
                              {toTitleCase(vendorProduct.product.name)}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="flex-shrink-0"
                            >
                              {vendorProduct.product.brandName}
                            </Badge>
                            {vendorProduct.isActive ? (
                              <Badge
                                variant="outline"
                                className="text-success border-success flex-shrink-0"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Available
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-destructive border-destructive flex-shrink-0"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Out of Stock
                              </Badge>
                            )}
                            {hasDiscount && (
                              <Badge
                                variant="secondary"
                                className="bg-primary text-primary-foreground flex-shrink-0"
                              >
                                Active Discount
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 break-words">
                            {vendorProduct.product.description}
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 text-sm">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs">
                                MRP
                              </span>
                              <span className="font-semibold">
                                ₹{vendorProduct.mrp}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs">
                                Price
                              </span>
                              <span className="font-semibold text-primary">
                                ₹{vendorProduct.price}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs">
                                Stock
                              </span>
                              <span className="font-semibold">
                                {vendorProduct.stockQty}{" "}
                                {vendorProduct.product.uom}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs">
                                Delivery
                              </span>
                              <span className="font-semibold">
                                {vendorProduct.deliverySupported
                                  ? "Self"
                                  : "DropSi"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs">
                                Value
                              </span>
                              <span className="font-semibold">
                                ₹
                                {(
                                  vendorProduct.price * vendorProduct.stockQty
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Switch
                          checked={vendorProduct.isActive}
                          onCheckedChange={(checked) =>
                            toggleAvailability(vendorProduct.id, checked)
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(vendorProduct)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {hasDiscount && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShowDiscount(vendorProduct.id)}
                            className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRemoveProduct(
                              vendorProduct.id,
                              vendorProduct.product.name
                            )
                          }
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add More Products Modal */}
      <Dialog
        open={showAddProductsModal}
        onOpenChange={setShowAddProductsModal}
      >
        <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle>Add Products to Inventory</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <ProductCatalog
                onProductsSelected={handleProductsAdded}
                existingVendorProducts={vendorProducts}
                isAddingToExisting={true}
                onCancel={() => setShowAddProductsModal(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={() => setEditingProduct(null)}
      >
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
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>MRP (₹)</Label>
                  <Input
                    type="number"
                    value={editForm.mrp || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        mrp: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={editForm.stockQty || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      stockQty: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editForm.deliverySupported || false}
                  onCheckedChange={(checked) =>
                    setEditForm((prev) => ({
                      ...prev,
                      deliverySupported: checked,
                    }))
                  }
                />
                <Label>I provide delivery</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                >
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

      {/* View Discount Dialog */}
      <Dialog
        open={showDiscountDialog && !!selectedDiscount}
        onOpenChange={setShowDiscountDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discount Details</DialogTitle>
          </DialogHeader>
          {selectedDiscount && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Discount Type</span>
                  <span>
                    {selectedDiscount.discountType === "percentage"
                      ? "Percentage"
                      : "Flat"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Discount Value</span>
                  <span>
                    {selectedDiscount.discountType === "percentage"
                      ? `${selectedDiscount.discountValue}%`
                      : `₹${selectedDiscount.discountValue}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Original Price</span>
                  <span>₹{selectedDiscount.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Discounted Price</span>
                  <span>₹{selectedDiscount.discountedPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Valid From</span>
                  <span>
                    {new Date(selectedDiscount.startsAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Valid Until</span>
                  <span>
                    {new Date(selectedDiscount.endsAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDiscount.description}
                  </p>
                </div>
                {selectedDiscount.terms && (
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDiscount.terms}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainDashboard;
