/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  BarChart3,
  TrendingUp,
  Download,
  RefreshCw,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  Legend,
  Line,
} from "recharts";
import { KpiCard } from "@/components/charts/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { ReportsTable } from "@/components/charts/ReportsTable";
import { ExportModal } from "@/components/charts/ExportModal";
import { Product } from "@/types/product";
import { Inventory } from "@/types/inventory";
import { Order } from "@/types/order";
import { getProducts } from "@/lib/api/services/product.service";
import { getOrders } from "@/lib/api/services/order.service";
import { getInventories } from "@/lib/api/services/inventory.service";

// Color maps
const categoryColors = {
  Brakes: "#ff6b35",
  Engine: "#2563eb",
  Filters: "#10b981",
  Suspension: "#f59e0b",
  Other: "#8b5cf6",
};

const paymentColors = {
  UPI: "#ff6b35",
  "Credit Card": "#2563eb",
  "Bank Transfer": "#10b981",
  Cash: "#f59e0b",
};

export default function Reports() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [activeReport, setActiveReport] = useState("products");
  const [dateRange, setDateRange] = useState("7days");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Fetch data for products, orders, and inventory
    const fetchData = async () => {
      const productsData = await getProducts();
      const ordersData = await getOrders();
      const inventoryData = await getInventories();
      setProducts(productsData);
      setOrders(ordersData);
      setInventory(inventoryData);
    };
    fetchData();
  }, []);

  const chartsRef = useRef(null);
  const tableRef = useRef(null);

  const reportTypes = [
    { id: "products", label: "Products Report", icon: Package },
    { id: "orders", label: "Orders Report", icon: ShoppingCart },
    { id: "inventory", label: "Inventory Report", icon: BarChart3 },
  ];

  const filteredOrders = useMemo(() => {
    const current = new Date();
    let start = new Date(current);
    switch (dateRange) {
      case "7days":
        start.setDate(start.getDate() - 7);
        break;
      case "30days":
        start.setDate(start.getDate() - 30);
        break;
      case "90days":
        start.setDate(start.getDate() - 90);
        break;
      case "1year":
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setDate(start.getDate() - 7);
    }
    return orders.filter((o) => o.placedAt >= start && o.placedAt <= current);
  }, [dateRange, orders]);

  const productReportData = useMemo(() => {
    return products.map((p) => {
      const stock = inventory
        .filter((i) => i.productId === p.id)
        .reduce((sum, i) => sum + i.quantity, 0);
      const sales = filteredOrders
        .flatMap((o) => o.items)
        .filter((i) => i.productId === p.id)
        .reduce((sum, i) => sum + i.quantity, 0);
      const revenue = sales * p.price;
      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category,
        price: p.price,
        stock,
        sales,
        revenue,
        supplier: p.brand,
      };
    });
  }, [products, inventory, filteredOrders]);

  const orderDailyData = useMemo(() => {
    const dailyMap = {};
    filteredOrders.forEach((o) => {
      const dateStr = o.placedAt.toISOString().slice(0, 10);
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = {
          date: dateStr,
          orders: 0,
          revenue: 0,
          avgOrder: 0,
        };
      }
      dailyMap[dateStr].orders += 1;
      dailyMap[dateStr].revenue += o.total;
    });
    const list = Object.values(dailyMap);
    list.forEach((d) => {
      d.avgOrder = d.orders > 0 ? d.revenue / d.orders : 0;
    });
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredOrders]);

  const inventorySummary = useMemo(() => {
    const summaryMap = {};
    inventory.forEach((i) => {
      if (!summaryMap[i.location]) {
        summaryMap[i.location] = {
          location: i.location,
          products: new Set(),
          totalStock: 0,
          lowStock: 0,
          value: 0,
        };
      }
      const s = summaryMap[i.location];
      s.products.add(i.productId);
      s.totalStock += i.quantity;
      if (i.quantity < i.reorderTreshould) {
        s.lowStock += 1;
      }
      const p = products.find((p) => p.id === i.productId);
      if (p) {
        s.value += p.price * i.quantity;
      }
    });
    Object.values(summaryMap).forEach((s) => {
      s.products = s.products.size;
    });
    return Object.values(summaryMap);
  }, [inventory, products]);

  const categoryDistribution = useMemo(() => {
    const catMap = {};
    productReportData.forEach((p) => {
      if (!catMap[p.category]) {
        catMap[p.category] = {
          category: p.category,
          value: 0,
          sales: 0,
          color: categoryColors[p.category] || "#000000",
        };
      }
      catMap[p.category].sales += p.sales;
      catMap[p.category].value += p.revenue;
    });
    const totalRevenue = productReportData.reduce(
      (sum, p) => sum + p.revenue,
      0
    );
    Object.values(catMap).forEach((c) => {
      c.value =
        totalRevenue > 0 ? ((c.value / totalRevenue) * 100).toFixed(0) : 0;
    });
    return Object.values(catMap);
  }, [productReportData]);

  const paymentMethods = useMemo(() => {
    const payMap = {};
    filteredOrders.forEach((o) => {
      const m = o.paymentMethod || "Unknown";
      if (!payMap[m]) {
        payMap[m] = {
          method: m,
          value: 0,
          amount: 0,
          color: paymentColors[m] || "#000000",
        };
      }
      payMap[m].amount += o.total;
    });
    const total = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    Object.values(payMap).forEach((p) => {
      p.value = total > 0 ? ((p.amount / total) * 100).toFixed(0) : 0;
    });
    return Object.values(payMap);
  }, [filteredOrders]);

  // Compute KPIs based on active report
  const kpis = useMemo(() => {
    switch (activeReport) {
      case "products":
        const totalProducts = productReportData.length;
        const totalRevenue = productReportData.reduce(
          (sum, p) => sum + p.revenue,
          0
        );
        const avgPrice =
          totalProducts > 0
            ? productReportData.reduce((sum, p) => sum + p.price, 0) /
              totalProducts
            : 0;
        const lowStockCount = productReportData.filter(
          (p) => p.stock < 10
        ).length;

        return [
          {
            title: "Total Products",
            value: totalProducts.toString(),
            delta: "+12",
            trend: "up",
            icon: Package,
          },
          {
            title: "Total Revenue",
            value: `ETB ${(totalRevenue / 1000).toFixed(0)}K`,
            delta: "+18.2%",
            trend: "up",
            icon: DollarSign,
          },
          {
            title: "Avg Price",
            value: `ETB ${avgPrice.toFixed(0)}`,
            delta: "+5.4%",
            trend: "up",
            icon: TrendingUp,
          },
          {
            title: "Low Stock Items",
            value: lowStockCount.toString(),
            delta: "-2",
            trend: "down",
            icon: AlertTriangle,
          },
        ];

      case "orders":
        const totalOrders = filteredOrders.length;
        const totalOrderRevenue = filteredOrders.reduce(
          (sum, o) => sum + o.total,
          0
        );
        const avgOrderValue =
          totalOrders > 0 ? totalOrderRevenue / totalOrders : 0;

        return [
          {
            title: "Total Orders",
            value: totalOrders.toString(),
            delta: "+15.3%",
            trend: "up",
            icon: ShoppingCart,
          },
          {
            title: "Revenue",
            value: `ETB ${(totalOrderRevenue / 100000).toFixed(1)}L`,
            delta: "+22.1%",
            trend: "up",
            icon: DollarSign,
          },
          {
            title: "Avg Order Value",
            value: `ETB ${avgOrderValue.toFixed(0)}`,
            delta: "+8.7%",
            trend: "up",
            icon: TrendingUp,
          },
          {
            title: "Conversion Rate",
            value: "3.2%",
            delta: "+0.5%",
            trend: "up",
            icon: Users,
          },
        ];

      case "inventory":
        const totalLocations = inventorySummary.length;
        const totalInventoryValue = inventorySummary.reduce(
          (sum, i) => sum + i.value,
          0
        );
        const totalLowStock = inventorySummary.reduce(
          (sum, i) => sum + i.lowStock,
          0
        );
        const totalStockUnits = inventorySummary.reduce(
          (sum, i) => sum + i.totalStock,
          0
        );

        return [
          {
            title: "Total Locations",
            value: totalLocations.toString(),
            delta: "0",
            trend: "neutral",
            icon: Package,
          },
          {
            title: "Inventory Value",
            value: `ETB ${(totalInventoryValue / 1000000).toFixed(1)}M`,
            delta: "+12.3%",
            trend: "up",
            icon: DollarSign,
          },
          {
            title: "Stock Units",
            value: totalStockUnits.toLocaleString(),
            delta: "+156",
            trend: "up",
            icon: BarChart3,
          },
          {
            title: "Low Stock Alerts",
            value: totalLowStock.toString(),
            delta: "-3",
            trend: "down",
            icon: AlertTriangle,
          },
        ];

      default:
        return [];
    }
  }, [activeReport, productReportData, filteredOrders, inventorySummary]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
  };

  const renderCharts = () => {
    let data = [];
    switch (activeReport) {
      case "products":
        data = productReportData;
        break;
      case "orders":
        data = orderDailyData;
        break;
      case "inventory":
        data = inventorySummary;
        break;
    }
    if (data.length < 5) {
      return (
        <Card className="border border-border">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-8 w-8 mb-4" />
            <p className="text-center text-muted-foreground">
              Please add more records
            </p>
          </CardContent>
        </Card>
      );
    }

    switch (activeReport) {
      case "products":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Top Products by Revenue"
              className="lg:col-span-1"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productReportData.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="sku"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                    }}
                    formatter={(value) => [
                      `ETB ${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#ff6b35" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Category Distribution" className="lg:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        );

      case "orders":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Daily Revenue Trend" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={orderDailyData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                    }}
                    formatter={(value) => [
                      `ETB ${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-IN")
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ff6b35"
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Payment Methods" className="lg:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ method, value }) => `${method} (${value}%)`}
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Orders vs Average Value"
              className="lg:col-span-1"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderDailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                    }}
                    formatter={(value, name) => {
                      if (name === "orders") return [value, "Orders"];
                      if (name === "avgOrder")
                        return [`ETB ${value}`, "Avg Order Value"];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="orders"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    yAxisId="left"
                  />
                  <Line
                    dataKey="avgOrder"
                    stroke="#ff6b35"
                    yAxisId="right"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        );

      case "inventory":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Stock by Location" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventorySummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="location"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  />
                  <Bar
                    dataKey="totalStock"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="lowStock"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Inventory Value Distribution"
              className="lg:col-span-1"
            >
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={inventorySummary.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ location, value }) =>
                      `${location}: ETB ${(value / 100000).toFixed(1)}L`
                    }
                  >
                    {inventorySummary.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`var(--chart-${(index % 5) + 1})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `ETB ${value.toLocaleString()}`,
                      "Value",
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Products per Location" className="lg:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventorySummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="location"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  />
                  <Bar
                    dataKey="products"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        );

      default:
        return null;
    }
  };

  const getTableData = () => {
    switch (activeReport) {
      case "products":
        return {
          columns: [
            "SKU",
            "Name",
            "Category",
            "Price",
            "Stock",
            "Sales",
            "Revenue",
            "Supplier",
          ],
          data: productReportData,
          keyMapping: {
            SKU: "sku",
            Name: "name",
            Category: "category",
            Price: "price",
            Stock: "stock",
            Sales: "sales",
            Revenue: "revenue",
            Supplier: "supplier",
          },
        };
      case "orders":
        return {
          columns: ["Date", "Orders", "Revenue", "Avg Order"],
          data: orderDailyData,
          keyMapping: {
            Date: "date",
            Orders: "orders",
            Revenue: "revenue",
            "Avg Order": "avgOrder",
          },
        };
      case "inventory":
        return {
          columns: [
            "Location",
            "Products",
            "Total Stock",
            "Low Stock",
            "Value",
          ],
          data: inventorySummary,
          keyMapping: {
            Location: "location",
            Products: "products",
            "Total Stock": "totalStock",
            "Low Stock": "lowStock",
            Value: "value",
          },
        };
      default:
        return { columns: [], data: [], keyMapping: {} };
    }
  };

  const tableData = getTableData();

  return (
    <div className="space-y-6" id="main-report">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
            />
            {isGenerating ? "Generating..." : "Refresh Data"}
          </Button>
          <Button onClick={() => setShowExportModal(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Tabs value={activeReport} onValueChange={setActiveReport}>
                <TabsList className="grid w-full grid-cols-3">
                  {reportTypes.map((type) => (
                    <TabsTrigger
                      key={type.id}
                      value={type.id}
                      className="gap-2"
                    >
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div ref={chartsRef}>{renderCharts()}</div>

      {/* Data Table */}
      <div ref={tableRef}>
        <ReportsTable
          title={`${reportTypes.find((t) => t.id === activeReport)?.label} Data`}
          {...tableData}
        />
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        reportType={activeReport}
        chartsRef={chartsRef}
        tableRef={tableRef}
        reportData={getTableData()}
        reportMeta={{
          name:
            reportTypes.find((t) => t.id === activeReport)?.label || "Report",
          type: activeReport,
          dateRange,
          generatedAt: new Date().toISOString(),
        }}
      />
    </div>
  );
}
