/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useMemo, useRef } from "react";
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
} from "recharts";
import { KpiCard } from "@/components/charts/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { ReportsTable } from "@/components/charts/ReportsTable";
import { ExportModal } from "@/components/charts/ExportModal";

// Mock data for different report types
const mockProductsData = [
  {
    id: "1",
    sku: "BP-HC-001",
    name: "Brake Pads Set",
    category: "Brakes",
    price: 4500,
    stock: 45,
    sales: 127,
    revenue: 571500,
    supplier: "Brembo",
  },
  {
    id: "2",
    sku: "OF-TC-052",
    name: "Oil Filter",
    category: "Filters",
    price: 850,
    stock: 12,
    sales: 89,
    revenue: 75650,
    supplier: "OEM",
  },
  {
    id: "3",
    sku: "SP-FF-203",
    name: "Spark Plugs",
    category: "Engine",
    price: 2200,
    stock: 8,
    sales: 156,
    revenue: 343200,
    supplier: "NGK",
  },
  {
    id: "4",
    sku: "AF-NS-101",
    name: "Air Filter",
    category: "Filters",
    price: 1200,
    stock: 23,
    sales: 98,
    revenue: 117600,
    supplier: "K&N",
  },
  {
    id: "5",
    sku: "TB-HY-075",
    name: "Timing Belt",
    category: "Engine",
    price: 3200,
    stock: 0,
    sales: 67,
    revenue: 214400,
    supplier: "Gates",
  },
];

const mockOrdersData = [
  { date: "2024-01-01", orders: 45, revenue: 245680, avgOrder: 5459 },
  { date: "2024-01-02", orders: 52, revenue: 287340, avgOrder: 5525 },
  { date: "2024-01-03", orders: 38, revenue: 198750, avgOrder: 5230 },
  { date: "2024-01-04", orders: 61, revenue: 342180, avgOrder: 5609 },
  { date: "2024-01-05", orders: 47, revenue: 256790, avgOrder: 5463 },
  { date: "2024-01-06", orders: 55, revenue: 301245, avgOrder: 5477 },
  { date: "2024-01-07", orders: 49, revenue: 268950, avgOrder: 5489 },
];

const mockInventoryData = [
  {
    location: "Warehouse A",
    products: 234,
    totalStock: 1250,
    lowStock: 12,
    value: 2450000,
  },
  {
    location: "Warehouse B",
    products: 187,
    totalStock: 890,
    lowStock: 8,
    value: 1890000,
  },
  {
    location: "Store Front",
    products: 98,
    totalStock: 445,
    lowStock: 5,
    value: 892000,
  },
  {
    location: "Drop Ship",
    products: 156,
    totalStock: 0,
    lowStock: 0,
    value: 0,
  },
];

const categoryDistribution = [
  { category: "Brakes", value: 35, sales: 127, color: "#ff6b35" },
  { category: "Engine", value: 28, sales: 223, color: "#2563eb" },
  { category: "Filters", value: 22, sales: 187, color: "#10b981" },
  { category: "Suspension", value: 10, sales: 89, color: "#f59e0b" },
  { category: "Other", value: 5, sales: 45, color: "#8b5cf6" },
];

const paymentMethods = [
  { method: "UPI", value: 45, amount: 567800, color: "#ff6b35" },
  { method: "Credit Card", value: 30, amount: 378900, color: "#2563eb" },
  { method: "Bank Transfer", value: 15, amount: 189450, color: "#10b981" },
  { method: "Cash", value: 10, amount: 126300, color: "#f59e0b" },
];

export default function Reports() {
  const [activeReport, setActiveReport] = useState("products");
  const [dateRange, setDateRange] = useState("7days");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const chartsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const reportTypes = [
    { id: "products", label: "Products Report", icon: Package },
    { id: "orders", label: "Orders Report", icon: ShoppingCart },
    { id: "inventory", label: "Inventory Report", icon: BarChart3 },
  ];

  // Compute KPIs based on active report
  const kpis = useMemo(() => {
    switch (activeReport) {
      case "products":
        const totalProducts = mockProductsData.length;
        const totalRevenue = mockProductsData.reduce(
          (sum, p) => sum + p.revenue,
          0
        );
        const avgPrice =
          mockProductsData.reduce((sum, p) => sum + p.price, 0) / totalProducts;
        const lowStockCount = mockProductsData.filter(
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
        const totalOrders = mockOrdersData.reduce(
          (sum, o) => sum + o.orders,
          0
        );
        const totalOrderRevenue = mockOrdersData.reduce(
          (sum, o) => sum + o.revenue,
          0
        );
        const avgOrderValue = totalOrderRevenue / totalOrders;

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
        const totalLocations = mockInventoryData.length;
        const totalInventoryValue = mockInventoryData.reduce(
          (sum, i) => sum + i.value,
          0
        );
        const totalLowStock = mockInventoryData.reduce(
          (sum, i) => sum + i.lowStock,
          0
        );
        const totalStockUnits = mockInventoryData.reduce(
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
  }, [activeReport]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
  };

  const renderCharts = () => {
    switch (activeReport) {
      case "products":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Top Products by Revenue"
              className="lg:col-span-1"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockProductsData.slice(0, 5)}>
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
                    formatter={(value: number) => [
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
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Share"]}
                  />
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
                <AreaChart data={mockOrdersData}>
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
                    formatter={(value: number) => [
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
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Share"]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Orders vs Average Value"
              className="lg:col-span-1"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockOrdersData}>
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
                  />
                  <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
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
                <BarChart data={mockInventoryData}>
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
                    data={mockInventoryData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({
                      location,
                      value,
                    }: {
                      location: string;
                      value: number;
                    }) => `${location}: ETB ${(value / 100000).toFixed(1)}L`}
                  >
                    {mockInventoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`var(--chart-${(index % 5) + 1})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `ETB ${value.toLocaleString()}`,
                      "Value",
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Products per Location" className="lg:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockInventoryData}>
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
          data: mockProductsData,
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
          data: mockOrdersData,
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
          data: mockInventoryData,
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
          {...getTableData()}
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
