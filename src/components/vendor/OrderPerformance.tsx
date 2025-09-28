import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Package, IndianRupee, ShoppingCart, Clock } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface OrderPerformanceProps {
  vendorId: string;
}

const OrderPerformance = ({ vendorId }: OrderPerformanceProps) => {
  const [timeRange, setTimeRange] = useState("today");
  const [chartMetric, setChartMetric] = useState("orders");

  // Generate mock chart data based on time range
  const generateChartData = () => {
    let days;
    switch (timeRange) {
      case "today":
        days = 1;
        break;
      case "lastweek":
        days = 7;
        break;
      case "last10days":
        days = 10;
        break;
      case "30days":
        days = 30;
        break;
      default:
        days = 7;
    }

    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Format date as "Sep 6" format
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const dateLabel = `${month} ${day}`;

      if (chartMetric === "orders") {
        data.push({
          day: dateLabel,
          value: Math.floor(Math.random() * 20) + 5,
          label: "Orders"
        });
      } else if (chartMetric === "revenue") {
        data.push({
          day: dateLabel,
          value: Math.floor(Math.random() * 5000) + 1000,
          label: "Revenue (₹)"
        });
      } else {
        // Top products data (showing top 7 products)
        const products = ["Bananas", "Milk", "Bread", "Rice", "Oil", "Sugar", "Tea"];
        return products.map(product => ({
          day: product,
          value: Math.floor(Math.random() * 50) + 10,
          label: "Units Sold"
        }));
      }
    }
    return data;
  };

  const chartData = generateChartData();

  const chartConfig = {
    value: {
      label: chartMetric === "orders" ? "Orders" : chartMetric === "revenue" ? "Revenue" : "Units",
      color: "#5CB8FF",
    },
  } satisfies ChartConfig;

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
      {
        id: "ORD001",
        customer: "John Doe",
        items: 3,
        total: 450,
        status: "delivered",
        date: "2024-01-15",
      },
      {
        id: "ORD002",
        customer: "Jane Smith",
        items: 5,
        total: 680,
        status: "processing",
        date: "2024-01-15",
      },
      {
        id: "ORD003",
        customer: "Bob Wilson",
        items: 2,
        total: 290,
        status: "delivered",
        date: "2024-01-14",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "processing":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return t("order_performance.delivered");
      case "processing":
        return t("order_performance.processing");
      case "cancelled":
        return t("order_performance.cancelled");
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Chart */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Performance Analytics</h3>
                <p className="text-sm text-muted-foreground">Track metrics over time</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="lastweek">Last Week</SelectItem>
                  <SelectItem value="last10days">Last 10 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={chartMetric} onValueChange={setChartMetric}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orders">Orders/Day</SelectItem>
                  <SelectItem value="revenue">Revenue/Day</SelectItem>
                  <SelectItem value="products">Top Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 0,
                top: 5,
                bottom: timeRange === "30days" || chartMetric === "products" ? 50 : 5
              }}
              barCategoryGap={timeRange === "today" || timeRange === "lastweek" ? "10%" : "25%"}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                fontSize={timeRange === "30days" ? 9 : 11}
                tickFormatter={(value) => chartMetric === "products" ? value : value}
                angle={chartMetric === "products" ? -45 : (timeRange === "30days" ? -45 : 0)}
                textAnchor={chartMetric === "products" ? "end" : (timeRange === "30days" ? "end" : "middle")}
                height={chartMetric === "products" ? 50 : (timeRange === "30days" ? 50 : 30)}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={chartMetric === "revenue" ? 50 : 35}
                tickFormatter={(value) =>
                  chartMetric === "revenue" ? `₹${(value / 1000).toFixed(0)}k` : value.toString()
                }
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {chartMetric === "products" ? label : `${label}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payload[0].payload.label}: {" "}
                            <span className="font-semibold text-foreground">
                              {chartMetric === "revenue" ? `₹${payload[0].value?.toLocaleString()}` : payload[0].value}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={3}
                maxBarSize={timeRange === "today" || timeRange === "lastweek" ? 60 : 40}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Overview Summary</h3>
              <p className="text-sm text-muted-foreground">Key metrics for selected period</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{performanceData.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+12%</span>
              </div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <IndianRupee className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">₹{performanceData.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+8%</span>
              </div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Package className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">₹{performanceData.avgOrderValue}</p>
              <p className="text-xs text-muted-foreground">Avg Order Value</p>
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
            {t("order_performance.top_performing_products")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity} {t("order_performance.units_sold")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₹{product.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("order_performance.revenue")}
                  </p>
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
            {t("order_performance.recent_orders")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">
                      {order.items} {t("order_performance.items")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹{order.total}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {getStatusText(order.status)}
                  </Badge>
                  <p className="text-sm text-muted-foreground min-w-20">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline">
              {t("order_performance.view_all_orders")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPerformance;
