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
import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api/services/order.service";
import { getProducts } from "@/lib/api/services/product.service";
import { getInventories } from "@/lib/api/services/inventory.service";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Inventory } from "@/types/inventory";

const quickActions = [
  { label: "Add Product", icon: Plus, action: "add-product" },
  { label: "View Orders", icon: Eye, action: "view-orders" },
  { label: "Inventory Report", icon: Package, action: "inventory-report" },
];

export default function DashboardPage() {
  const onNavigate = (page: string) => {
    console.log("Navigate to:", page);
  };

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [lowStockInventories, setLowStockInventories] = useState<Inventory[]>(
    []
  );

  useEffect(() => {
    const fetchDetails = async () => {
      const orders = await getOrders();
      setRecentOrders(orders);
      const products = await getProducts();
      setRecentProducts(products);
      const inventories = await getInventories();
      const lowStock = inventories.filter(
        (inv) => inv.quantity < inv.reorderTreshould
      );
      setLowStockInventories(lowStock);
    };

    fetchDetails();
  }, []);

  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
  const ordersToday = recentOrders.filter(
    (o) => o.placedAt.toDateString() === todayStr
  ).length;
  const ordersYesterday = recentOrders.filter(
    (o) => o.placedAt.toDateString() === yesterdayStr
  ).length;

  let ordersChange = "+0%";
  let ordersTrend: "up" | "down" = "up";
  if (ordersYesterday > 0) {
    const pct = (
      ((ordersToday - ordersYesterday) / ordersYesterday) *
      100
    ).toFixed(1);
    ordersChange = `${Number(pct) > 0 ? "+" : ""}${pct}%`;
    ordersTrend = Number(pct) > 0 ? "up" : "down";
  } else if (ordersToday > 0) {
    ordersChange = "+100%";
    ordersTrend = "up";
  }

  const statsData = [
    {
      title: "Total Revenue",
      value: `ETB ${recentOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      description: "This month",
      icon: DollarSign,
    },
    {
      title: "Orders Today",
      value: ordersToday.toString(),
      change: ordersChange,
      trend: ordersTrend,
      description: "vs yesterday",
      icon: ShoppingCart,
    },
    {
      title: "Active Products",
      value: recentProducts
        .filter((p) => p.status === "active")
        .length.toLocaleString(),
      change: "+23",
      trend: "up",
      description: "Total listed",
      icon: Package,
    },
    {
      title: "Low Stock Alerts",
      value: lowStockInventories.length.toString(),
      change: "-3",
      trend: "down",
      description: "Need attention",
      icon: AlertTriangle,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getStockStatus = (quantity: number): "critical" | "low" => {
    return quantity < 5 ? "critical" : "low";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Welcome back! Here is what is happening with your store.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              onClick={() => onNavigate(action.action)}
              className="gap-2 text-sm sm:text-base"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 md:grid-cols-2">
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
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 rounded-lg border"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer?.name || "Unknown Customer"} •{" "}
                      {order.items.length} items
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.placedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ETB {order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mb-2" />
                <p>No recent orders</p>
              </div>
            )}
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
            {lowStockInventories.length > 0 ? (
              lowStockInventories.map((inventory) => {
                const status = getStockStatus(inventory.quantity);
                return (
                  <div
                    key={inventory.id}
                    className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {inventory.product.sku}
                        </span>
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {inventory.product.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{inventory.quantity} left</p>
                      <p className="text-xs text-muted-foreground">
                        Min: {inventory.reorderTreshould}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p>No low stock alerts</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Products (added section to utilize the state) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Newly added or updated products</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("products")}
          >
            View All
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentProducts.length > 0 ? (
            recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.sku}</span>
                    {product.status && (
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ETB {product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created: {product.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
              <Package className="h-8 w-8 mb-2" />
              <p>No recent products</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
