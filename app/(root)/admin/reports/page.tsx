"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  PieLabelRenderProps,
} from "recharts";
import {
  Calendar,
  Download,
  FileText,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
} from "lucide-react";

// Define interfaces for data
interface SalesData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface CategoryData {
  [key: string]: string | number;
  name: string;
  value: number;
  color: string;
  revenue: number;
}

interface InventoryData {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface UserActivityData {
  week: string;
  newUsers: number;
  activeUsers: number;
  orders: number;
}

interface ReportType {
  id: string;
  name: string;
  description: string;
}

// Mock analytics data
const salesData: SalesData[] = [
  { month: "Jan", revenue: 45000, orders: 120, customers: 85 },
  { month: "Feb", revenue: 52000, orders: 140, customers: 95 },
  { month: "Mar", revenue: 48000, orders: 130, customers: 88 },
  { month: "Apr", revenue: 61000, orders: 165, customers: 110 },
  { month: "May", revenue: 55000, orders: 150, customers: 102 },
  { month: "Jun", revenue: 67000, orders: 180, customers: 125 },
  { month: "Jul", revenue: 72000, orders: 195, customers: 135 },
  { month: "Aug", revenue: 68000, orders: 185, customers: 128 },
  { month: "Sep", revenue: 74000, orders: 200, customers: 142 },
  { month: "Oct", revenue: 79000, orders: 215, customers: 150 },
  { month: "Nov", revenue: 83000, orders: 225, customers: 158 },
];

const categoryData: CategoryData[] = [
  { name: "Engine Parts", value: 35, color: "#8884d8", revenue: 45000 },
  { name: "Brake Systems", value: 25, color: "#82ca9d", revenue: 32000 },
  { name: "Suspension", value: 20, color: "#ffc658", revenue: 28000 },
  { name: "Electrical", value: 15, color: "#ff7300", revenue: 21000 },
  { name: "Others", value: 5, color: "#00ff00", revenue: 8000 },
];

const inventoryData: InventoryData[] = [
  { category: "Engine Parts", inStock: 245, lowStock: 12, outOfStock: 3 },
  { category: "Brake Systems", inStock: 189, lowStock: 8, outOfStock: 1 },
  { category: "Suspension", inStock: 156, lowStock: 15, outOfStock: 2 },
  { category: "Electrical", inStock: 203, lowStock: 6, outOfStock: 4 },
  { category: "Transmission", inStock: 134, lowStock: 9, outOfStock: 1 },
];

const userActivityData: UserActivityData[] = [
  { week: "Week 1", newUsers: 12, activeUsers: 145, orders: 45 },
  { week: "Week 2", newUsers: 18, activeUsers: 156, orders: 52 },
  { week: "Week 3", newUsers: 15, activeUsers: 162, orders: 48 },
  { week: "Week 4", newUsers: 22, activeUsers: 178, orders: 61 },
];

const reportTypes: ReportType[] = [
  {
    id: "sales",
    name: "Sales Report",
    description: "Revenue, orders, and customer analytics",
  },
  {
    id: "inventory",
    name: "Inventory Report",
    description: "Stock levels, low stock alerts, and turnover",
  },
  {
    id: "users",
    name: "User Activity Report",
    description: "User registrations, activity, and engagement",
  },
  {
    id: "suppliers",
    name: "Supplier Performance",
    description: "Supplier metrics and product performance",
  },
  {
    id: "financial",
    name: "Financial Summary",
    description: "Profit margins, costs, and financial health",
  },
];

export default function ReportsAnalytics() {
  const [selectedReportType, setSelectedReportType] = useState<string>("sales");
  const [dateRange, setDateRange] = useState<string>("last30days");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const generateReport = (type: string, format: string) => {
    // In a real app, this would make an API call to generate the report
    console.log(
      `Generating ${type} report in ${format} format for ${dateRange}`
    );
    // Simulate download
    const fileName = `${type}_report_${new Date().toISOString().split("T")[0]}.${format}`;
    alert(
      `Report "${fileName}" is being generated and will be downloaded shortly.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate insights and export business intelligence reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="thisyear">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Date
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB 682,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.2% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,827</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.7% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,456</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly revenue and order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Revenue distribution across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(props: PieLabelRenderProps) => {
                    return `${props.name}: ${props.value}%`;
                  }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Stock levels across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inStock" fill="#82ca9d" />
                <Bar dataKey="lowStock" fill="#ffc658" />
                <Bar dataKey="outOfStock" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Weekly user engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newUsers" fill="#8884d8" />
                <Bar dataKey="activeUsers" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Create and export detailed business reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="text-sm font-medium">Select Report Type</label>
              <Select
                value={selectedReportType}
                onValueChange={setSelectedReportType}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Report Details */}
            <div className="p-4 bg-muted rounded-lg">
              {reportTypes.find((type) => type.id === selectedReportType) && (
                <div>
                  <h4 className="font-medium">
                    {
                      reportTypes.find((type) => type.id === selectedReportType)
                        ?.name
                    }
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {
                      reportTypes.find((type) => type.id === selectedReportType)
                        ?.description
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7days">Last 7 days</SelectItem>
                    <SelectItem value="last30days">Last 30 days</SelectItem>
                    <SelectItem value="last90days">Last 90 days</SelectItem>
                    <SelectItem value="thisyear">This year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(selectedReportType === "sales" ||
                selectedReportType === "inventory") && (
                <div>
                  <label className="text-sm font-medium">Category Filter</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="engine">Engine Parts</SelectItem>
                      <SelectItem value="brake">Brake Systems</SelectItem>
                      <SelectItem value="suspension">Suspension</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Export Options */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => generateReport(selectedReportType, "pdf")}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => generateReport(selectedReportType, "csv")}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => generateReport(selectedReportType, "xlsx")}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Previously generated reports and exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Sales Report - November 2024",
                type: "PDF",
                date: "2024-11-19",
                size: "2.4 MB",
              },
              {
                name: "Inventory Status Report",
                type: "CSV",
                date: "2024-11-18",
                size: "156 KB",
              },
              {
                name: "User Activity Analysis",
                type: "Excel",
                date: "2024-11-17",
                size: "890 KB",
              },
              {
                name: "Supplier Performance Report",
                type: "PDF",
                date: "2024-11-16",
                size: "1.8 MB",
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {report.date} • {report.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{report.type}</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
