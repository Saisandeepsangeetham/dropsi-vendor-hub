import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  Package,
  Truck,
  X,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Loader2,
  ChevronDown,
  Image as ImageIcon,
  DollarSign,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { Product, VendorProduct, ProductManager } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";
import { toTitleCase } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

interface ProductCatalogProps {
  onProductsSelected: (products: VendorProduct[]) => void;
  existingVendorProducts?: VendorProduct[];
  isAddingToExisting?: boolean;
  onCancel?: () => void;
}

interface ProductPricing {
  [productId: string]: {
    mrp: number;
    sellingPrice: number;
    stockQty: number;
    deliverySupported: boolean;
    mrp_display?: string;
    sellingPrice_display?: string;
    stockQty_display?: string;
  };
}

const ProductCatalog = ({
  onProductsSelected,
  existingVendorProducts = [],
  isAddingToExisting = false,
  onCancel,
}: ProductCatalogProps) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [productPricing, setProductPricing] = useState<ProductPricing>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vendor, logout } = useAuth();

  // Get existing product IDs to show them as already added
  const existingProductIds = new Set(
    existingVendorProducts.map((vp) => vp.productId)
  );

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allProducts = await ProductManager.getAllProducts();
        setProducts(allProducts);
      } catch (error) {
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

    loadProducts();
  }, [toast]);

  // Initialize product pricing when products are selected
  useEffect(() => {
    const newPricing: ProductPricing = {};

    selectedProducts.forEach((productId) => {
      if (!productPricing[productId]) {
        newPricing[productId] = {
          mrp: 0,
          sellingPrice: 0,
          stockQty: 0,
          deliverySupported: true,
        };
      }
    });

    if (Object.keys(newPricing).length > 0) {
      setProductPricing((prev) => ({ ...prev, ...newPricing }));
    }
  }, [selectedProducts]);

  // Get unique categories and brands from products
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.brandName))),
  ];
  const brands = [
    "All",
    ...Array.from(new Set(products.map((p) => p.brandName))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.brandName === selectedCategory;
    const matchesBrand =
      selectedBrand === "All" || product.brandName === selectedBrand;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch && product.isActive;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle pagination
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleProductToggle = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  // Check if form is valid
  const isFormValid = () => {
    return Array.from(selectedProducts).every((productId) => {
      const config = productPricing[productId];
      return (
        config?.sellingPrice > 0 &&
        config?.mrp > 0 &&
        config?.stockQty > 0 &&
        config.mrp >= config.sellingPrice
      ); // MRP should be >= selling price
    });
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      toast({
        title: "Invalid configuration",
        description:
          "Please ensure all fields are filled and MRP is greater than or equal to selling price.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for bulk add API
      const productsToAdd = Array.from(selectedProducts).map((productId) => {
        const config = productPricing[productId];
        return {
          productId: productId,
          price: config.sellingPrice,
          mrp: config.mrp,
          stockQty: config.stockQty,
          deliverySupported: config.deliverySupported,
        };
      });

      // Call bulk add API
      const response = await ProductManager.bulkAddProducts(productsToAdd);

      if (response.success) {
        // Convert the response to VendorProduct format for the dashboard
        const vendorProducts: VendorProduct[] = response.results.success.map(
          (vp: any) => ({
            id: vp.id,
            vendorId: vp.vendorId,
            productId: vp.productId,
            price: vp.price,
            mrp: vp.mrp,
            stockQty: vp.stockQty,
            isActive: vp.isActive,
            deliverySupported: vp.deliverySupported,
            product: products.find((p) => p.id === vp.productId)!,
          })
        );

        onProductsSelected(vendorProducts);

        toast({
          title: "Products added successfully",
          description: `${response.summary.successful} products have been added to your inventory.`,
        });
      } else {
        throw new Error("Failed to add products");
      }
    } catch (error) {
      toast({
        title: "Failed to add products",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSelected = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    newSelected.delete(productId);
    setSelectedProducts(newSelected);
  };

  const handleClearAll = () => {
    setSelectedProducts(new Set());
  };

  // Select all visible products
  const handleSelectAllVisible = () => {
    const newSelected = new Set(selectedProducts);
    paginatedProducts.forEach((product) => {
      if (!existingProductIds.has(product.id)) {
        newSelected.add(product.id);
      }
    });
    setSelectedProducts(newSelected);
  };

  // Deselect all visible products
  const handleDeselectAllVisible = () => {
    const newSelected = new Set(selectedProducts);
    paginatedProducts.forEach((product) => {
      newSelected.delete(product.id);
    });
    setSelectedProducts(newSelected);
  };

  // Handle row click
  const handleRowClick = (product: Product) => {
    if (!existingProductIds.has(product.id)) {
      handleProductToggle(product.id);
    }
  };

  // Update product pricing
  const updateProductPricing = (
    productId: string,
    field: string,
    value: number | boolean
  ) => {
    setProductPricing((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  // Format number input value
  const handleNumberInputChange = (
    productId: string,
    field: string,
    value: string
  ) => {
    // Allow empty string, single decimal point, or valid number input
    if (value === "" || value === "." || value === "0.") {
      // For empty or just decimal point, store as is temporarily
      setProductPricing((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [field]:
            value === "" || value === "." || value === "0."
              ? 0
              : prev[productId][field],
        },
      }));
      return;
    }

    // Validate input is a proper number format
    const numberRegex = /^[0-9]*\.?[0-9]*$/;
    if (!numberRegex.test(value)) {
      return; // Reject invalid input
    }

    // Remove leading zeros but keep decimal values
    let formattedValue = value;
    if (value.length > 1 && value.startsWith("0") && !value.startsWith("0.")) {
      formattedValue = value.replace(/^0+/, "");
    }

    // Parse as float for price fields, as integer for stock
    const numValue =
      field === "stockQty"
        ? parseInt(formattedValue) || 0
        : parseFloat(formattedValue) || 0;

    // Store both the display value and the numeric value
    setProductPricing((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [`${field}_display`]: value, // Store display value
        [field]: numValue, // Store numeric value
      },
    }));
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <Loading size="lg" text="Loading product catalog..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Package className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Failed to load products
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-[#5CB8FF] text-white">
        <div className="flex items-center justify-between w-full gap-4">
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

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="/lovable-uploads/60937367-1e73-4f00-acf4-a275a8cff443.png"
                alt="DropSi Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Partner Dashboard</h1>
              <p className="text-blue-100 text-sm">
                {isAddingToExisting
                  ? "Select additional products to add to your inventory"
                  : "Select products from our standardized catalog to start selling"}
              </p>
            </div>
          </div>

          {vendor && (
            <div className="flex items-center gap-3 ml-auto">
              <Badge
                variant="secondary"
                className="text-sm bg-white/20 text-white font-bold uppercase"
              >
                {vendor.displayName}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={undefined} alt={vendor.displayName} />
                    <AvatarFallback className="bg-[#E3F4FF] text-[#1976D2] font-bold">
                      {vendor.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Legal
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 pb-24">
        {/* Search and Filter Section */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products by name, brand, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Categories:
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Brands:
              </p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <Button
                    key={brand}
                    variant={selectedBrand === brand ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedBrand(brand)}
                  >
                    {brand}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Products Summary */}
        {selectedProducts.size > 0 && (
          <Card className="mb-6 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">
                  Selected Products ({selectedProducts.size})
                </h3>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {products
                  .filter((product) => selectedProducts.has(product.id))
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">
                        {toTitleCase(product.name)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSelected(product.id)}
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        <Card className="shadow-card overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                Products ({filteredProducts.length})
              </h3>
              <Badge variant="secondary">
                {selectedProducts.size} selected
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSelectAllVisible}>
                    Select all on this page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeselectAllVisible}>
                    Deselect all on this page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleClearAll}>
                    Clear all selections
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">Select</TableHead>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>UoM</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No products found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => {
                    const isSelected = selectedProducts.has(product.id);
                    const isAlreadyAdded = existingProductIds.has(product.id);
                    const pricing = productPricing[product.id];

                    return (
                      <>
                        <TableRow
                          key={product.id}
                          className={`${isSelected ? "bg-primary/5" : ""} ${
                            isAlreadyAdded
                              ? "opacity-60"
                              : "cursor-pointer hover:bg-muted/50"
                          }`}
                          onClick={() =>
                            !isAlreadyAdded && handleRowClick(product)
                          }
                        >
                          <TableCell
                            className="text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isAlreadyAdded ? (
                              <CheckCircle className="h-4 w-4 text-success mx-auto" />
                            ) : (
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleProductToggle(product.id)
                                }
                                className="mx-auto"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                    {product.imageUrl ? (
                                      <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src =
                                            "/placeholder.svg";
                                        }}
                                      />
                                    ) : (
                                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="w-48">
                                  <div className="w-full aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
                                    {product.imageUrl ? (
                                      <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src =
                                            "/placeholder.svg";
                                        }}
                                      />
                                    ) : (
                                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <ImageIcon className="h-8 w-8 mb-2" />
                                        <span className="text-xs">
                                          No image
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="mt-2 text-sm font-medium">
                                    {toTitleCase(product.name)}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="font-medium">
                            {toTitleCase(product.name)}
                          </TableCell>
                          <TableCell>{product.brandName}</TableCell>
                          <TableCell>{product.uom}</TableCell>
                          <TableCell className="text-center">
                            {isAlreadyAdded ? (
                              <Badge
                                variant="outline"
                                className="text-success border-success"
                              >
                                Added
                              </Badge>
                            ) : isSelected ? (
                              <Badge variant="secondary">Selected</Badge>
                            ) : (
                              <Badge variant="outline">Available</Badge>
                            )}
                          </TableCell>
                        </TableRow>

                        {/* Pricing row for selected products */}
                        {isSelected && !isAlreadyAdded && (
                          <TableRow
                            className="bg-muted/30 border-t border-dashed"
                            key={`${product.id}-pricing`}
                          >
                            <TableCell colSpan={6} className="py-2 px-4">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">
                                    MRP (₹)
                                  </div>
                                  <Input
                                    type="text"
                                    inputMode="decimal"
                                    value={
                                      pricing?.mrp_display ||
                                      pricing?.mrp?.toString() ||
                                      "0"
                                    }
                                    onChange={(e) =>
                                      handleNumberInputChange(
                                        product.id,
                                        "mrp",
                                        e.target.value
                                      )
                                    }
                                    className="h-8"
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="0.00"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">
                                    Selling Price (₹)
                                  </div>
                                  <Input
                                    type="text"
                                    inputMode="decimal"
                                    value={
                                      pricing?.sellingPrice_display ||
                                      pricing?.sellingPrice?.toString() ||
                                      "0"
                                    }
                                    onChange={(e) =>
                                      handleNumberInputChange(
                                        product.id,
                                        "sellingPrice",
                                        e.target.value
                                      )
                                    }
                                    className="h-8"
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="0.00"
                                  />
                                  {pricing?.sellingPrice > pricing?.mrp && (
                                    <p className="text-xs text-destructive mt-1">
                                      Price cannot exceed MRP
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">
                                    Stock Quantity
                                  </div>
                                  <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={
                                      pricing?.stockQty_display ||
                                      pricing?.stockQty?.toString() ||
                                      "0"
                                    }
                                    onChange={(e) =>
                                      handleNumberInputChange(
                                        product.id,
                                        "stockQty",
                                        e.target.value.replace(/\./g, "")
                                      )
                                    }
                                    className="h-8"
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="0"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">
                                    Delivery Service
                                  </div>
                                  <div
                                    className="flex items-center space-x-2 h-8"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Switch
                                      checked={
                                        pricing?.deliverySupported ?? true
                                      }
                                      onCheckedChange={(checked) =>
                                        updateProductPricing(
                                          product.id,
                                          "deliverySupported",
                                          checked
                                        )
                                      }
                                    />
                                    <span className="text-sm">
                                      DropSi handles delivery
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * itemsPerPage + 1} to{" "}
                {Math.min(page * itemsPerPage, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Continue Button */}
        {/* Floating Action Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            size="lg"
            onClick={handleContinue}
            className="px-8 shadow-xl"
            disabled={
              selectedProducts.size === 0 || !isFormValid() || isSubmitting
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Adding Products...
              </>
            ) : (
              <>
                Add {selectedProducts.size} Product
                {selectedProducts.size !== 1 ? "s" : ""}
                <Truck className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {/* No Products Message */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
