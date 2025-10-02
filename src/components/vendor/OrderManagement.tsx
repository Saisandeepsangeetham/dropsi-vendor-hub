import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Repeat,
  ShoppingCart,
  Printer,
  Filter,
  Eye,
  TrendingUp,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/TranslationContext";

// Mock data - replace with actual API calls
const mockPackagingData = [
  {
    id: "1",
    productName: "Organic Basmati Rice",
    category: "Grains",
    totalQuantity: 25,
    unit: "kg",
    stockStatus: "sufficient",
    currentStock: 100,
    requiredStock: 25,
    orders: [
      {
        type: "one-time",
        customerCount: 3,
        quantity: 15,
        customerDetails: [
          {
            customerId: "C001",
            customerName: "Rahul Sharma",
            quantity: 5,
            address: "Sector 15, Gurugram",
          },
          {
            customerId: "C002",
            customerName: "Priya Singh",
            quantity: 3,
            address: "DLF Phase 2",
          },
          {
            customerId: "C003",
            customerName: "Amit Kumar",
            quantity: 7,
            address: "Cyber City",
          },
        ],
      },
      {
        type: "recurring",
        customerCount: 2,
        quantity: 10,
        customerDetails: [
          {
            customerId: "C004",
            customerName: "Sunita Devi",
            quantity: 4,
            address: "Sector 12, Gurugram",
            frequency: "Weekly",
          },
          {
            customerId: "C005",
            customerName: "Ravi Gupta",
            quantity: 6,
            address: "Golf Course Road",
            frequency: "Daily",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    productName: "Fresh Milk",
    category: "Dairy",
    totalQuantity: 48,
    unit: "L",
    stockStatus: "low",
    currentStock: 50,
    requiredStock: 48,
    orders: [
      {
        type: "one-time",
        customerCount: 8,
        quantity: 20,
        customerDetails: [
          {
            customerId: "C006",
            customerName: "Meera Jain",
            quantity: 2,
            address: "Sector 14",
          },
          {
            customerId: "C007",
            customerName: "Rohit Verma",
            quantity: 3,
            address: "Sector 18",
          },
          {
            customerId: "C008",
            customerName: "Kavita Agarwal",
            quantity: 1,
            address: "DLF Phase 1",
          },
          {
            customerId: "C009",
            customerName: "Suresh Yadav",
            quantity: 4,
            address: "Sector 21",
          },
          {
            customerId: "C010",
            customerName: "Deepika Roy",
            quantity: 2,
            address: "Sector 22",
          },
          {
            customerId: "C011",
            customerName: "Vikash Singh",
            quantity: 3,
            address: "Sector 23",
          },
          {
            customerId: "C012",
            customerName: "Anita Sharma",
            quantity: 2,
            address: "Sector 24",
          },
          {
            customerId: "C013",
            customerName: "Manoj Kumar",
            quantity: 3,
            address: "Sector 25",
          },
        ],
      },
      {
        type: "recurring",
        customerCount: 14,
        quantity: 28,
        customerDetails: [
          {
            customerId: "C014",
            customerName: "Rajesh Pandey",
            quantity: 2,
            address: "Sector 26",
            frequency: "Daily",
          },
          {
            customerId: "C015",
            customerName: "Sita Devi",
            quantity: 1,
            address: "Sector 27",
            frequency: "Daily",
          },
          {
            customerId: "C016",
            customerName: "Ajay Tiwari",
            quantity: 3,
            address: "Sector 28",
            frequency: "Daily",
          },
          {
            customerId: "C017",
            customerName: "Pooja Mishra",
            quantity: 2,
            address: "Sector 29",
            frequency: "Daily",
          },
          {
            customerId: "C018",
            customerName: "Ramesh Singh",
            quantity: 2,
            address: "Sector 30",
            frequency: "Daily",
          },
          {
            customerId: "C019",
            customerName: "Nisha Agrawal",
            quantity: 1,
            address: "Sector 31",
            frequency: "Daily",
          },
          {
            customerId: "C020",
            customerName: "Vinod Kumar",
            quantity: 2,
            address: "Sector 32",
            frequency: "Daily",
          },
          {
            customerId: "C021",
            customerName: "Rekha Sharma",
            quantity: 3,
            address: "Sector 33",
            frequency: "Daily",
          },
          {
            customerId: "C022",
            customerName: "Sanjay Gupta",
            quantity: 2,
            address: "Sector 34",
            frequency: "Daily",
          },
          {
            customerId: "C023",
            customerName: "Geeta Singh",
            quantity: 2,
            address: "Sector 35",
            frequency: "Daily",
          },
          {
            customerId: "C024",
            customerName: "Ashok Yadav",
            quantity: 1,
            address: "Sector 36",
            frequency: "Daily",
          },
          {
            customerId: "C025",
            customerName: "Kiran Devi",
            quantity: 3,
            address: "Sector 37",
            frequency: "Daily",
          },
          {
            customerId: "C026",
            customerName: "Vikas Jain",
            quantity: 2,
            address: "Sector 38",
            frequency: "Daily",
          },
          {
            customerId: "C027",
            customerName: "Sangita Roy",
            quantity: 2,
            address: "Sector 39",
            frequency: "Daily",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    productName: "Fresh Bananas",
    category: "Fruits",
    totalQuantity: 120,
    unit: "pieces",
    stockStatus: "out-of-stock",
    currentStock: 80,
    requiredStock: 120,
    orders: [
      {
        type: "one-time",
        customerCount: 12,
        quantity: 60,
        customerDetails: [
          {
            customerId: "C028",
            customerName: "Arjun Mehta",
            quantity: 12,
            address: "Sector 40",
          },
          {
            customerId: "C029",
            customerName: "Divya Singh",
            quantity: 6,
            address: "Sector 41",
          },
          {
            customerId: "C030",
            customerName: "Rajesh Kumar",
            quantity: 8,
            address: "Sector 42",
          },
          {
            customerId: "C031",
            customerName: "Priyanka Jain",
            quantity: 4,
            address: "Sector 43",
          },
          {
            customerId: "C032",
            customerName: "Manish Agarwal",
            quantity: 5,
            address: "Sector 44",
          },
          {
            customerId: "C033",
            customerName: "Sneha Sharma",
            quantity: 3,
            address: "Sector 45",
          },
          {
            customerId: "C034",
            customerName: "Harish Gupta",
            quantity: 7,
            address: "Sector 46",
          },
          {
            customerId: "C035",
            customerName: "Neha Singh",
            quantity: 2,
            address: "Sector 47",
          },
          {
            customerId: "C036",
            customerName: "Kailash Yadav",
            quantity: 4,
            address: "Sector 48",
          },
          {
            customerId: "C037",
            customerName: "Ritu Devi",
            quantity: 3,
            address: "Sector 49",
          },
          {
            customerId: "C038",
            customerName: "Mohan Kumar",
            quantity: 3,
            address: "Sector 50",
          },
          {
            customerId: "C039",
            customerName: "Sarita Singh",
            quantity: 3,
            address: "Sector 51",
          },
        ],
      },
      {
        type: "recurring",
        customerCount: 15,
        quantity: 60,
        customerDetails: [
          {
            customerId: "C040",
            customerName: "Dev Sharma",
            quantity: 6,
            address: "Sector 52",
            frequency: "Weekly",
          },
          {
            customerId: "C041",
            customerName: "Kavya Singh",
            quantity: 4,
            address: "Sector 53",
            frequency: "Weekly",
          },
          {
            customerId: "C042",
            customerName: "Rajiv Gupta",
            quantity: 3,
            address: "Sector 54",
            frequency: "Weekly",
          },
          {
            customerId: "C043",
            customerName: "Ananya Devi",
            quantity: 5,
            address: "Sector 55",
            frequency: "Weekly",
          },
          {
            customerId: "C044",
            customerName: "Suresh Kumar",
            quantity: 2,
            address: "Sector 56",
            frequency: "Weekly",
          },
          {
            customerId: "C045",
            customerName: "Radha Singh",
            quantity: 4,
            address: "Sector 57",
            frequency: "Weekly",
          },
          {
            customerId: "C046",
            customerName: "Manoj Jain",
            quantity: 3,
            address: "Sector 58",
            frequency: "Weekly",
          },
          {
            customerId: "C047",
            customerName: "Shilpa Agarwal",
            quantity: 5,
            address: "Sector 59",
            frequency: "Weekly",
          },
          {
            customerId: "C048",
            customerName: "Virender Kumar",
            quantity: 4,
            address: "Sector 60",
            frequency: "Weekly",
          },
          {
            customerId: "C049",
            customerName: "Sunita Sharma",
            quantity: 3,
            address: "Sector 61",
            frequency: "Weekly",
          },
          {
            customerId: "C050",
            customerName: "Ravi Singh",
            quantity: 6,
            address: "Sector 62",
            frequency: "Weekly",
          },
          {
            customerId: "C051",
            customerName: "Meenu Gupta",
            quantity: 4,
            address: "Sector 63",
            frequency: "Weekly",
          },
          {
            customerId: "C052",
            customerName: "Dinesh Yadav",
            quantity: 3,
            address: "Sector 64",
            frequency: "Weekly",
          },
          {
            customerId: "C053",
            customerName: "Lakshmi Devi",
            quantity: 4,
            address: "Sector 65",
            frequency: "Weekly",
          },
          {
            customerId: "C054",
            customerName: "Vikram Singh",
            quantity: 4,
            address: "Sector 66",
            frequency: "Weekly",
          },
        ],
      },
    ],
  },
];

const getStockStatusIcon = (status: string) => {
  switch (status) {
    case "sufficient":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "low":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "out-of-stock":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};

const getStockStatusColor = (status: string) => {
  switch (status) {
    case "sufficient":
      return "text-green-600 bg-green-50 border-green-200";
    case "low":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "out-of-stock":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-green-600 bg-green-50 border-green-200";
  }
};

interface ProductDetailProps {
  product: (typeof mockPackagingData)[0];
}

const ProductDetailSheet: React.FC<ProductDetailProps> = ({ product }) => {
  const { t } = useTranslation();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          {t("order_management.details")}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{product.productName}</SheetTitle>
          <SheetDescription>
            Detailed packaging information for tomorrow's delivery
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {product.totalQuantity}
              </div>
              <div className="text-sm text-muted-foreground">
                Total {product.unit}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {product.orders.reduce(
                  (acc, order) => acc + order.customerCount,
                  0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Customers</div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">
              {t("order_management.order_breakdown")}
            </h4>
            <div className="space-y-4">
              {product.orders.map((order, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      {order.type === "one-time" ? (
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Repeat className="h-4 w-4 text-purple-500" />
                      )}
                      <div>
                        <div className="font-medium text-sm">
                          {order.type === "one-time"
                            ? t("order_management.one_time_orders")
                            : t("order_management.recurring_plans")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.customerCount} customers • {order.quantity}{" "}
                          {product.unit} total
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {order.quantity} {product.unit}
                      </div>
                    </div>
                  </div>

                  {/* Customer Details Table */}
                  <div className="bg-background border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 px-3 py-2 border-b">
                      <h5 className="text-sm font-medium">
                        {t("order_management.customer_details")}
                      </h5>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {order.customerDetails?.map((customer, customerIndex) => (
                        <div
                          key={customerIndex}
                          className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/20"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm truncate">
                                {customer.customerName}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {customer.address}
                                </span>
                              </div>
                              {customer.frequency && (
                                <div className="text-xs text-purple-600 font-medium">
                                  {customer.frequency}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-semibold text-sm">
                              {customer.quantity} {product.unit}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">
              {t("order_management.inventory_status")}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("order_management.current_stock")}
                </span>
                <span className="font-medium">
                  {product.currentStock} {product.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("order_management.required")}
                </span>
                <span className="font-medium">
                  {product.requiredStock} {product.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("order_management.remaining")}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    product.currentStock - product.requiredStock >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {product.currentStock - product.requiredStock} {product.unit}
                </span>
              </div>
              <Progress
                value={(product.requiredStock / product.currentStock) * 100}
                className="h-2"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const OrderManagement: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(
    addDays(new Date(), 1)
  );
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isPrintMode, setIsPrintMode] = useState(false);

  const categories = [
    "all",
    ...Array.from(new Set(mockPackagingData.map((item) => item.category))),
  ];

  const filteredData =
    filterCategory === "all"
      ? mockPackagingData
      : mockPackagingData.filter((item) => item.category === filterCategory);

  const totalItems = filteredData.reduce(
    (acc, item) => acc + item.totalQuantity,
    0
  );
  const totalCustomers = filteredData.reduce(
    (acc, item) =>
      acc +
      item.orders.reduce(
        (orderAcc, order) => orderAcc + order.customerCount,
        0
      ),
    0
  );

  const stockIssues = filteredData.filter(
    (item) => item.stockStatus !== "sufficient"
  ).length;

  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white p-8 print:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 print:mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                {t("order_management.daily_packaging")}
              </h1>
              <p className="text-muted-foreground">
                {t("order_management.packaging_date")}:{" "}
                {format(selectedDate, "PPP")}
              </p>
            </div>
            <Button
              onClick={() => setIsPrintMode(false)}
              className="print:hidden"
              variant="outline"
            >
              {t("order_management.exit_print_mode")}
            </Button>
          </div>

          <div className="space-y-6">
            {categories.slice(1).map((category) => {
              const categoryItems = filteredData.filter(
                (item) => item.category === category
              );
              if (categoryItems.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                    {category}
                  </h2>
                  <div className="grid gap-3">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b border-dashed"
                      >
                        <div>
                          <span className="font-medium">
                            {item.productName}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            {item.orders.reduce(
                              (acc, order) => acc + order.customerCount,
                              0
                            )}{" "}
                            customers
                          </div>
                        </div>
                        <div className="text-lg font-bold">
                          {item.totalQuantity} {item.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("order_management.title")}</h2>
          <p className="text-muted-foreground">
            {t("order_management.daily_forecast")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsPrintMode(true)}
            variant="outline"
            size="sm"
          >
            <Printer className="h-4 w-4 mr-1" />
            {t("order_management.print_list")}
          </Button>
        </div>
      </div>

      {/* Date Selector & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("order_management.packaging_date")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t("order_management.total_items")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.length} {t("product_catalog_extended.products")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("order_management.customers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("order_management.total_orders")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t("order_management.stock_status")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stockIssues}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Filter by category:
          </span>
        </div>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Packaging List */}
      <div className="grid gap-4">
        {filteredData.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStockStatusIcon(item.stockStatus)}
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          getStockStatusColor(item.stockStatus)
                        )}
                      >
                        {item.stockStatus.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Total Quantity
                      </div>
                      <div className="font-semibold text-lg">
                        {item.totalQuantity} {item.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Customers
                      </div>
                      <div className="font-semibold text-lg">
                        {item.orders.reduce(
                          (acc, order) => acc + order.customerCount,
                          0
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Current Stock
                      </div>
                      <div className="font-semibold text-lg">
                        {item.currentStock} {item.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Remaining
                      </div>
                      <div
                        className={cn(
                          "font-semibold text-lg",
                          item.currentStock - item.requiredStock >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {item.currentStock - item.requiredStock} {item.unit}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    {item.orders.map((order, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {order.type === "one-time" ? (
                          <>
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            One-time: {order.customerCount} customers (
                            {order.quantity}
                            {item.unit})
                          </>
                        ) : (
                          <>
                            <Repeat className="h-3 w-3 mr-1" />
                            Recurring: {order.customerCount} customers (
                            {order.quantity}
                            {item.unit})
                          </>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <ProductDetailSheet product={item} />
                  {item.stockStatus !== "sufficient" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-200"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {t("order_management.update_stock")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No orders for this date
            </h3>
            <p className="text-muted-foreground">
              No packaging requirements found for {format(selectedDate, "PPP")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
