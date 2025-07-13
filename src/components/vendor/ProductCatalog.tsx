import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Package, Truck } from "lucide-react";
import { Product } from "@/pages/VendorDashboard";

// Mock data matching the database schema
const SAMPLE_BRANDS = [
  { id: "brand-1", name: "Fresh Farms" },
  { id: "brand-2", name: "Dairy Fresh" },
  { id: "brand-3", name: "Baker's Best" },
  { id: "brand-4", name: "Golden Grain" },
  { id: "brand-5", name: "Tea Garden" }
];

const SAMPLE_CATEGORIES = [
  { id: "cat-1", name: "Fruits", display_order: 1 },
  { id: "cat-2", name: "Vegetables", display_order: 2 },
  { id: "cat-3", name: "Dairy", display_order: 3 },
  { id: "cat-4", name: "Bakery", display_order: 4 },
  { id: "cat-5", name: "Grains", display_order: 5 },
  { id: "cat-6", name: "Beverages", display_order: 6 }
];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Organic Bananas",
    description: "Fresh organic bananas, perfect for daily nutrition",
    brand_id: "brand-1",
    brand_name: "Fresh Farms",
    uom: "kg",
    image_url: "/api/placeholder/100/100",
    is_active: true,
    categories: [{ id: "cat-1", name: "Fruits", display_order: 1 }]
  },
  {
    id: "2", 
    name: "Whole Milk",
    description: "Fresh whole milk, rich in calcium and protein",
    brand_id: "brand-2",
    brand_name: "Dairy Fresh",
    uom: "litre",
    image_url: "/api/placeholder/100/100",
    is_active: true,
    categories: [{ id: "cat-3", name: "Dairy", display_order: 3 }]
  },
  {
    id: "3",
    name: "Brown Bread",
    description: "Healthy brown bread made with whole grains",
    brand_id: "brand-3",
    brand_name: "Baker's Best",
    uom: "piece",
    image_url: "/api/placeholder/100/100",
    is_active: true,
    categories: [{ id: "cat-4", name: "Bakery", display_order: 4 }]
  },
  {
    id: "4",
    name: "Basmati Rice",
    description: "Premium quality basmati rice",
    brand_id: "brand-4",
    brand_name: "Golden Grain",
    uom: "kg",
    image_url: "/api/placeholder/100/100",
    is_active: true,
    categories: [{ id: "cat-5", name: "Grains", display_order: 5 }]
  },
  {
    id: "5",
    name: "Green Tea",
    description: "Refreshing green tea with antioxidants",
    brand_id: "brand-5",
    brand_name: "Tea Garden",
    uom: "box",
    image_url: "/api/placeholder/100/100",
    is_active: true,
    categories: [{ id: "cat-6", name: "Beverages", display_order: 6 }]
  },
  {
    id: "6",
    name: "Greek Yogurt",
    description: "Creamy Greek yogurt with probiotics",
    brand_id: "brand-2",
    brand_name: "Dairy Fresh",
    uom: "cup",
    image_url: "/api/placeholder/100/100",
    is_active: true,
    categories: [{ id: "cat-3", name: "Dairy", display_order: 3 }]
  }
];

interface ProductCatalogProps {
  onProductsSelected: (products: Product[]) => void;
}

const ProductCatalog = ({ onProductsSelected }: ProductCatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const categories = ["All", ...SAMPLE_CATEGORIES.map(c => c.name)];
  const brands = ["All", ...SAMPLE_BRANDS.map(b => b.name)];

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === "All" || 
      product.categories.some(cat => cat.name === selectedCategory);
    const matchesBrand = selectedBrand === "All" || product.brand_name === selectedBrand;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch && product.is_active;
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
    const selected = SAMPLE_PRODUCTS.filter(product => selectedProducts.has(product.id));
    onProductsSelected(selected);
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8" />
            <h1 className="text-3xl font-bold">DropSi Vendor Portal</h1>
          </div>
          <p className="text-blue-100">Select products from our standardized catalog to start selling</p>
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => handleProductToggle(product.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="w-16 h-16 bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.brand_name}</p>
                    <div className="flex gap-2 mb-2">
                      {product.categories.map(category => (
                        <Badge key={category.id} variant="secondary">{category.name}</Badge>
                      ))}
                    </div>
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        UoM: {product.uom}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Results Info */}
        <div className="text-center text-muted-foreground mb-6">
          Showing {filteredProducts.length} of {SAMPLE_PRODUCTS.length} products
        </div>

        {/* Continue Button */}
        {selectedProducts.size > 0 && (
          <div className="fixed bottom-6 right-6">
            <Card className="shadow-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-semibold">{selectedProducts.size}</span> products selected
                  </div>
                  <Button onClick={handleContinue} className="flex items-center gap-2">
                    Continue to Pricing
                    <Truck className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;