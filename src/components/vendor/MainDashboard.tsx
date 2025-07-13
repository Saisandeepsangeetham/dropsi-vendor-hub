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
import { Package, Truck, IndianRupee, Edit, BarChart3, Settings, CheckCircle, XCircle, Tag, Plus, Trash2, Save, Percent, X, ArrowRight, Loader2 } from "lucide-react";
import { VendorProduct, ProductManager, Product, DiscountManager } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";
import { toTitleCase } from "@/lib/utils";

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
  const [productDiscounts, setProductDiscounts] = useState<Record<string, any>>({});
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);

  // Add More Products Modal State
  const [showAddProductsModal, setShowAddProductsModal] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [productConfigs, setProductConfigs] = useState<Record<string, {
    price: number;
    mrp: number;
    stockQty: number;
    deliverySupported: boolean;
  }>>({});
  const [isAddingProducts, setIsAddingProducts] = useState(false);
  const [addProductsStep, setAddProductsStep] = useState<'catalog' | 'pricing'>('catalog');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories from allProducts
  const categories = [
    "All",
    ...Array.from(
      new Set(
        allProducts
          .map((p) => (p as any).category || (p as any).categories?.[0] || "")
          .filter((cat) => !!cat)
      )
    ),
  ];

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

  // Load all available products for the modal
  const loadAllProducts = async () => {
    try {
      const products = await ProductManager.getAllProducts();
      setAllProducts(products);
    } catch (error) {
      toast({
        title: "Error loading products",
        description: "Failed to load product catalog.",
        variant: "destructive",
      });
    }
  };

  const handleAddMoreProducts = () => {
    setShowAddProductsModal(true);
    setSelectedProducts(new Set());
    setProductConfigs({});
    setAddProductsStep('catalog');
    setSearchTerm(""); // Reset search term
    loadAllProducts();
  };

  const handleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
      const newConfigs = { ...productConfigs };
      delete newConfigs[productId];
      setProductConfigs(newConfigs);
    } else {
      newSelected.add(productId);
      setProductConfigs(prev => ({
        ...prev,
        [productId]: {
          price: 0,
          mrp: 0,
          stockQty: 0,
          deliverySupported: false
        }
      }));
    }
    setSelectedProducts(newSelected);
  };

  const handleContinueToPricing = () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product to continue.",
        variant: "destructive",
      });
      return;
    }
    setAddProductsStep('pricing');
  };

  const handleUpdateProductConfig = (productId: string, field: string, value: any) => {
    setProductConfigs(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const isPricingFormValid = () => {
    return Array.from(selectedProducts).every(productId => {
      const config = productConfigs[productId];
      return config?.price && config.price > 0 && 
             config?.mrp && config.mrp > 0 &&
             config?.stockQty && config.stockQty > 0 &&
             config.mrp >= config.price;
    });
  };

  const handleAddProducts = async () => {
    if (!isPricingFormValid()) {
      toast({
        title: "Invalid configuration",
        description: "Please ensure all fields are filled and MRP is greater than or equal to selling price.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAddingProducts(true);

      const productsToAdd = Array.from(selectedProducts).map(productId => {
        const config = productConfigs[productId];
        return {
          productId,
          price: config.price,
          mrp: config.mrp,
          stockQty: config.stockQty,
          deliverySupported: config.deliverySupported
        };
      });

      const response = await ProductManager.bulkAddProducts(productsToAdd);

      toast({
        title: "Products added successfully",
        description: `Added ${response.results?.success?.length || 0} product${(response.results?.success?.length || 0) !== 1 ? 's' : ''} to your inventory.`,
      });

      // Refresh vendor products
      const updatedProducts = await ProductManager.getVendorProducts();
      setVendorProducts(updatedProducts);

      // Close modal and reset state
      setShowAddProductsModal(false);
      setSelectedProducts(new Set());
      setProductConfigs({});
      setAddProductsStep('catalog');
      setSearchTerm("");
    } catch (error) {
      toast({
        title: "Failed to add products",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsAddingProducts(false);
    }
  };

  const handleEditClick = (vendorProduct: VendorProduct) => {
    setEditingProduct(vendorProduct);
    setEditForm({
      price: vendorProduct.price,
      mrp: vendorProduct.mrp,
      stockQty: vendorProduct.stockQty,
      deliverySupported: vendorProduct.deliverySupported
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      await ProductManager.updateVendorProduct(editingProduct.id, editForm);
      
      // Update local state
      setVendorProducts(prev => prev.map(vp => 
        vp.id === editingProduct.id 
          ? { ...vp, ...editForm }
          : vp
      ));

      setEditingProduct(null);
      setEditForm({});

      toast({
        title: "Product updated successfully",
        description: `${editingProduct.product.name} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update product",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (vendorProductId: string, isActive: boolean) => {
    try {
      await ProductManager.updateVendorProduct(vendorProductId, { isActive });
      
      // Update local state
      setVendorProducts(prev => prev.map(vp => 
        vp.id === vendorProductId 
          ? { ...vp, isActive }
          : vp
      ));

      toast({
        title: isActive ? "Product activated" : "Product deactivated",
        description: `Product has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update product status",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveProduct = async (vendorProductId: string, productName: string) => {
    if (!confirm(`Are you sure you want to remove ${productName} from your inventory?`)) {
      return;
    }

    try {
      await ProductManager.deleteVendorProduct(vendorProductId);
      
      // Update local state
      setVendorProducts(prev => prev.filter(vp => vp.id !== vendorProductId));

      toast({
        title: "Product removed successfully",
        description: `${productName} has been removed from your inventory.`,
      });
    } catch (error) {
      toast({
        title: "Failed to remove product",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
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
      console.error('Error loading discounts:', error);
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
            <Button onClick={handleAddMoreProducts} className="flex items-center gap-2">
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
              <Button onClick={handleAddMoreProducts}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorProducts.map(vendorProduct => {
                // Safety check for missing product information
                if (!vendorProduct.product) {
                  console.warn('Vendor product missing product information:', vendorProduct);
                  return null; // Skip rendering this item
                }
                
                const hasDiscount = !!productDiscounts[vendorProduct.id];
                
                return (
                <div key={vendorProduct.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
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
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg break-words">{toTitleCase(vendorProduct.product.name)}</h3>
                          <Badge variant="secondary" className="flex-shrink-0">{vendorProduct.product.brandName}</Badge>
                          {vendorProduct.isActive ? (
                            <Badge variant="outline" className="text-success border-success flex-shrink-0">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-destructive border-destructive flex-shrink-0">
                              <XCircle className="h-3 w-3 mr-1" />
                              Out of Stock
                            </Badge>
                          )}
                          {hasDiscount && (
                            <Badge variant="secondary" className="bg-primary text-primary-foreground flex-shrink-0">
                              Active Discount
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 break-words">{vendorProduct.product.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 text-sm">
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
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
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
                        onClick={() => handleRemoveProduct(vendorProduct.id, vendorProduct.product.name)}
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
      <Dialog open={showAddProductsModal} onOpenChange={setShowAddProductsModal}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add More Products
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col flex-1 min-h-0">
            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
              <div className={`flex items-center gap-2 ${addProductsStep === 'catalog' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${addProductsStep === 'catalog' ? 'bg-primary text-white' : 'bg-muted'}`}>
                  1
                </div>
                <span className="text-sm font-medium">Select Products</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className={`flex items-center gap-2 ${addProductsStep === 'pricing' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${addProductsStep === 'pricing' ? 'bg-primary text-white' : 'bg-muted'}`}>
                  2
                </div>
                <span className="text-sm font-medium">Configure Pricing</span>
              </div>
            </div>

            {/* Search Bar */}
            {addProductsStep === 'catalog' && (
              <div className="mb-4">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {/* Category Filter */}
            {addProductsStep === 'catalog' && categories.length > 1 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-2">
              {addProductsStep === 'catalog' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allProducts
                      .filter(product => {
                        const name = (product.name || "").toLowerCase();
                        const description = (product.description || "").toLowerCase();
                        const brand = (product.brandName || "").toLowerCase();
                        const term = searchTerm.toLowerCase();
                        const cat = (product as any).category || (product as any).categories?.[0] || "";
                        const matchesCategory = selectedCategory === "All" || cat === selectedCategory;
                        return (
                          (name.includes(term) || description.includes(term) || brand.includes(term)) &&
                          matchesCategory
                        );
                      })
                      .map(product => {
                        const isSelected = selectedProducts.has(product.id);
                        const isAlreadyAdded = vendorProducts.some(vp => vp.productId === product.id);

                        return (
                          <Card 
                            key={product.id} 
                            className={`cursor-pointer transition-all ${
                              isSelected ? 'ring-2 ring-primary' : ''
                            } ${isAlreadyAdded ? 'opacity-50' : ''}`}
                            onClick={() => !isAlreadyAdded && handleProductSelection(product.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-1">{toTitleCase(product.name)}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">{product.brandName}</Badge>
                                    <Badge variant="secondary" className="text-xs">UoM: {product.uom}</Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isAlreadyAdded && (
                                    <Badge variant="outline" className="text-success border-success">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Added
                                    </Badge>
                                  )}
                                  {!isAlreadyAdded && (
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleProductSelection(product.id)}
                                      className="ml-2"
                                    />
                                  )}
                                </div>
                              </div>
                              
                              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
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
                                  <Package className="h-8 w-8 text-muted-foreground" />
                                )}
                                <Package className="h-8 w-8 text-muted-foreground" style={{ display: 'none' }} />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(selectedProducts).map(productId => {
                    const product = allProducts.find(p => p.id === productId);
                    const config = productConfigs[productId];
                    
                    if (!product) return null;

                    return (
                      <Card key={productId} className="shadow-card">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
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
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{toTitleCase(product.name)}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{product.brandName}</Badge>
                                <Badge variant="secondary" className="text-xs">UoM: {product.uom}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>MRP (₹)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={config?.mrp || ""}
                                onChange={(e) => handleUpdateProductConfig(productId, 'mrp', parseFloat(e.target.value) || 0)}
                                disabled={isAddingProducts}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Selling Price (₹)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={config?.price || ""}
                                onChange={(e) => handleUpdateProductConfig(productId, 'price', parseFloat(e.target.value) || 0)}
                                disabled={isAddingProducts}
                              />
                              {config?.price && config?.mrp && config.price > config.mrp && (
                                <p className="text-xs text-destructive">Price cannot exceed MRP</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Stock Quantity</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                value={config?.stockQty || ""}
                                onChange={(e) => handleUpdateProductConfig(productId, 'stockQty', parseFloat(e.target.value) || 0)}
                                disabled={isAddingProducts}
                              />
                              <p className="text-xs text-muted-foreground">Per {product.uom}</p>
                            </div>
                            <div className="space-y-2">
                              <Label>Delivery Service</Label>
                              <div className="flex items-center space-x-2 mt-3">
                                <Switch
                                  checked={config?.deliverySupported || false}
                                  onCheckedChange={(checked) => handleUpdateProductConfig(productId, 'deliverySupported', checked)}
                                  disabled={isAddingProducts}
                                />
                                <Label className="text-sm">I provide delivery</Label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
              <div className="text-sm text-muted-foreground">
                {addProductsStep === 'catalog' 
                  ? `${selectedProducts.size} product${selectedProducts.size !== 1 ? 's' : ''} selected`
                  : `Configure pricing for ${selectedProducts.size} product${selectedProducts.size !== 1 ? 's' : ''}`
                }
              </div>
              <div className="flex gap-2">
                {addProductsStep === 'pricing' ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setAddProductsStep('catalog')}
                      disabled={isAddingProducts}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleAddProducts}
                      disabled={!isPricingFormValid() || isAddingProducts}
                    >
                      {isAddingProducts ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding Products...
                        </>
                      ) : (
                        <>
                          Add {selectedProducts.size} Product{selectedProducts.size !== 1 ? 's' : ''}
                          <Plus className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleContinueToPricing}
                    disabled={selectedProducts.size === 0}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* View Discount Dialog */}
      <Dialog open={showDiscountDialog && !!selectedDiscount} onOpenChange={setShowDiscountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discount Details</DialogTitle>
          </DialogHeader>
          {selectedDiscount && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Discount Type</span>
                  <span>{selectedDiscount.discountType === 'percentage' ? 'Percentage' : 'Flat'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Discount Value</span>
                  <span>
                    {selectedDiscount.discountType === 'percentage' 
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
                  <span>{new Date(selectedDiscount.startsAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Valid Until</span>
                  <span>{new Date(selectedDiscount.endsAt).toLocaleDateString()}</span>
                </div>
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedDiscount.description}</p>
                </div>
                {selectedDiscount.terms && (
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-muted-foreground">{selectedDiscount.terms}</p>
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