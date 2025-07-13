import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Package, Truck, X, Trash2, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Product, VendorProduct, ProductManager } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";
import { toTitleCase } from "@/lib/utils";

interface ProductCatalogProps {
  onProductsSelected: (products: Product[]) => void;
  existingVendorProducts?: VendorProduct[];
  isAddingToExisting?: boolean;
  onCancel?: () => void;
}

const ProductCatalog = ({ onProductsSelected, existingVendorProducts = [], isAddingToExisting = false, onCancel }: ProductCatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get existing product IDs to show them as already added
  const existingProductIds = new Set(existingVendorProducts.map(vp => vp.productId));

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allProducts = await ProductManager.getAllProducts();
        setProducts(allProducts);
      } catch (error) {
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

    loadProducts();
  }, [toast]);

  // Get unique categories and brands from products
  const categories = ["All", ...Array.from(new Set(products.map(p => p.brandName)))];
  const brands = ["All", ...Array.from(new Set(products.map(p => p.brandName)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.brandName === selectedCategory;
    const matchesBrand = selectedBrand === "All" || product.brandName === selectedBrand;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch && product.isActive;
  });

  const handleProductToggle = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleContinue = () => {
    const selected = products.filter(product => selectedProducts.has(product.id));
    onProductsSelected(selected);
  };

  const handleRemoveSelected = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    newSelected.delete(productId);
    setSelectedProducts(newSelected);
  };

  const handleClearAll = () => {
    setSelectedProducts(new Set());
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
          <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
            
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                <img 
                  src="/lovable-uploads/60937367-1e73-4f00-acf4-a275a8cff443.png" 
                  alt="DropSi Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-poppins">
                  {isAddingToExisting ? "Add More Products" : "DropSi Vendor Portal"}
                </h1>
                <p className="text-blue-100 text-sm md:text-base font-inter">
                  {isAddingToExisting 
                    ? "Select additional products to add to your inventory" 
                    : "Select products from our standardized catalog to start selling"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
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
              <p className="text-sm font-medium text-muted-foreground mb-2">Categories:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
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
              <p className="text-sm font-medium text-muted-foreground mb-2">Brands:</p>
              <div className="flex flex-wrap gap-2">
                {brands.map(brand => (
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
                <h3 className="font-semibold">Selected Products ({selectedProducts.size})</h3>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {products
                  .filter(product => selectedProducts.has(product.id))
                  .map(product => (
                    <div key={product.id} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                      <span className="text-sm">{toTitleCase(product.name)}</span>
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const isSelected = selectedProducts.has(product.id);
            const isAlreadyAdded = existingProductIds.has(product.id);

            return (
              <Card 
                key={product.id} 
                className={`shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary' : ''
                } ${isAlreadyAdded ? 'opacity-50' : ''}`}
                onClick={() => !isAlreadyAdded && handleProductToggle(product.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{toTitleCase(product.name)}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-2">
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
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleProductToggle(product.id)}
                          className="ml-2"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Product Image */}
                  <div className="w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedProducts.size > 0 && (
          <div className="mt-8 text-center">
            <Button 
              size="lg" 
              onClick={handleContinue}
              className="px-8"
            >
              Continue with {selectedProducts.size} Product{selectedProducts.size !== 1 ? 's' : ''}
              <Truck className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

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