"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  Eye,
  Plus,
  ArrowUpRight,
} from "lucide-react";

const statsData = [
  {
    title: "Total Revenue",
    value: "ETB 2,45,680",
    change: "+12.5%",
    trend: "up",
    description: "This month",
    icon: DollarSign,
  },
  {
    title: "Orders Today",
    value: "47",
    change: "+8.2%",
    trend: "up",
    description: "vs yesterday",
    icon: ShoppingCart,
  },
  {
    title: "Active Products",
    value: "1,234",
    change: "+23",
    trend: "up",
    description: "Total listed",
    icon: Package,
  },
  {
    title: "Low Stock Alerts",
    value: "12",
    change: "-3",
    trend: "down",
    description: "Need attention",
    icon: AlertTriangle,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    items: "Brake Pads Set",
    amount: "ETB 4,500",
    status: "pending",
    time: "2 hours ago",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    items: "Engine Oil Filter",
    amount: "ETB 850",
    status: "paid",
    time: "4 hours ago",
  },
  {
    id: "ORD-003",
    customer: "Mike Wilson",
    items: "Spark Plugs (4x)",
    amount: "ETB 2,200",
    status: "shipped",
    time: "6 hours ago",
  },
  {
    id: "ORD-004",
    customer: "Lisa Chen",
    items: "Air Filter",
    amount: "ETB 650",
    status: "delivered",
    time: "1 day ago",
  },
];

const lowStockProducts = [
  {
    sku: "BP-001",
    name: "Brake Pads - Honda Civic",
    currentStock: 3,
    threshold: 10,
    status: "critical",
  },
  {
    sku: "OF-052",
    name: "Oil Filter - Toyota Camry",
    currentStock: 7,
    threshold: 15,
    status: "low",
  },
  {
    sku: "SP-203",
    name: "Spark Plugs - Ford Focus",
    currentStock: 12,
    threshold: 20,
    status: "low",
  },
];

const quickActions = [
  { label: "Add Product", icon: Plus, action: "add-product" },
  { label: "View Orders", icon: Eye, action: "view-orders" },
  { label: "Inventory Report", icon: Package, action: "inventory-report" },
];

export default function DashboardPage() {
  const onNavigate = (page: string) => {
    console.log("Navigate to:", page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "low":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here is what is happening with your store.
          </p>
        </div>
        <div className="flex gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              onClick={() => onNavigate(action.action)}
              className="gap-2"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span
                  className={`inline-flex items-center gap-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3 rotate-180" />
                  )}
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest customer orders requiring attention
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("orders")}
            >
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.id}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.customer} • {order.items}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("inventory")}
            >
              Manage Inventory
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.sku}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.sku}</span>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{product.currentStock} left</p>
                  <p className="text-xs text-muted-foreground">
                    Min: {product.threshold}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
