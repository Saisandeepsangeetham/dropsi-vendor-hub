import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Package, IndianRupee, ShoppingCart, Clock } from "lucide-react";

interface OrderPerformanceProps {
  vendorId: string;
}

const OrderPerformance = ({ vendorId }: OrderPerformanceProps) => {
  const [timeRange, setTimeRange] = useState("7days");

  // Mock data - Replace with actual Supabase queries
  const performanceData = {
    totalOrders: 156,
    totalRevenue: 45680,
    avgOrderValue: 293,
    topProducts: [
      { id: "1", name: "Organic Bananas", quantity: 45, revenue: 4500 },
      { id: "2", name: "Whole Milk", quantity: 38, revenue: 3800 },
      { id: "3", name: "Brown Bread", quantity: 32, revenue: 1600 },
    ],
    recentOrders: [
      { id: "ORD001", customer: "John Doe", items: 3, total: 450, status: "delivered", date: "2024-01-15" },
      { id: "ORD002", customer: "Jane Smith", items: 5, total: 680, status: "processing", date: "2024-01-15" },
      { id: "ORD003", customer: "Bob Wilson", items: 2, total: 290, status: "delivered", date: "2024-01-14" },
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "success";
      case "processing": return "warning";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Order Performance</h3>
                <p className="text-sm text-muted-foreground">Track your sales and order metrics</p>
              </div>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{performanceData.totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+12%</span>
              </div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <IndianRupee className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">₹{performanceData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+8%</span>
              </div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">₹{performanceData.avgOrderValue}</p>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+5%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Package className="h-5 w-5" />
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{order.items} items</p>
                    <p className="text-sm text-muted-foreground">₹{order.total}</p>
                  </div>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {order.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground min-w-20">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline">View All Orders</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPerformance;