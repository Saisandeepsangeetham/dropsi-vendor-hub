import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/60937367-1e73-4f00-acf4-a275a8cff443.png" 
              alt="DropSi Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            DropSi
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            The complete grocery delivery platform connecting vendors with customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/vendor">
                Start as Vendor
                <Package className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/customer">
                Order Groceries
                <Truck className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DropSi?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for modern grocery delivery with powerful tools for vendors and seamless experience for customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Product Management</h3>
                <p className="text-muted-foreground mb-4">
                  Browse our standardized catalog, set your prices, and manage inventory with ease
                </p>
                <Badge variant="secondary">For Vendors</Badge>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexible Delivery</h3>
                <p className="text-muted-foreground mb-4">
                  Choose to handle delivery yourself or let DropSi assign delivery partners
                </p>
                <Badge variant="outline" className="border-success text-success">Smart Logistics</Badge>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Track sales, inventory, and performance with comprehensive dashboard insights
                </p>
                <Badge variant="outline" className="border-warning text-warning">Data Driven</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Vendor CTA Section */}
      <div className="bg-gradient-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of vendors already using DropSi to grow their grocery business
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/vendor">
              Start Your Vendor Journey
              <Package className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
