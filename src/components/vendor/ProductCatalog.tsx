import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Package, Truck } from "lucide-react";
import { Product } from "@/pages/VendorDashboard";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Organic Bananas",
    brand: "Fresh Farms",
    category: "Fruits",
    image: "/api/placeholder/100/100",
    description: "Fresh organic bananas, perfect for daily nutrition"
  },
  {
    id: "2", 
    name: "Whole Milk",
    brand: "Dairy Fresh",
    category: "Dairy",
    image: "/api/placeholder/100/100",
    description: "Fresh whole milk, rich in calcium and protein"
  },
  {
    id: "3",
    name: "Brown Bread",
    brand: "Baker's Best",
    category: "Bakery",
    image: "/api/placeholder/100/100",
    description: "Healthy brown bread made with whole grains"
  },
  {
    id: "4",
    name: "Basmati Rice",
    brand: "Golden Grain",
    category: "Grains",
    image: "/api/placeholder/100/100",
    description: "Premium quality basmati rice"
  },
  {
    id: "5",
    name: "Green Tea",
    brand: "Tea Garden",
    category: "Beverages",
    image: "/api/placeholder/100/100",
    description: "Refreshing green tea with antioxidants"
  },
  {
    id: "6",
    name: "Greek Yogurt",
    brand: "Dairy Fresh",
    category: "Dairy",
    image: "/api/placeholder/100/100",
    description: "Creamy Greek yogurt with probiotics"
  }
];

const CATEGORIES = ["All", "Fruits", "Vegetables", "Dairy", "Bakery", "Grains", "Beverages"];

interface ProductCatalogProps {
  onProductsSelected: (products: Product[]) => void;
}

const ProductCatalog = ({ onProductsSelected }: ProductCatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products by name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Category:</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {CATEGORIES.map(category => (
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
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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