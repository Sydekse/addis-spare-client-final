"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { getOrders } from "@/lib/api/services/order.service";
import { Order, OrderStatus } from "@/types/order";
import { findUserById } from "@/lib/api/services/user.service";

// const mockOrders = [
//   {
//     id: "ORD-001",
//     customer: {
//       name: "John Doe",
//       email: "john@example.com",
//       phone: "+91 9876543210",
//     },
//     items: [{ name: "Brake Pads Set", sku: "BP-HC-001", quantity: 1, price: 4500 }],
//     subtotal: 4500,
//     tax: 450,
//     shipping: 200,
//     total: 5150,
//     status: "pending",
//     paymentStatus: "paid",
//     placedAt: "2024-01-15T10:30:00Z",
//     shippingAddress: {
//       street: "123 Main Street",
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//       country: "India",
//     },
//   },
//   {
//     id: "ORD-002",
//     customer: {
//       name: "Sarah Johnson",
//       email: "sarah@example.com",
//       phone: "+91 9876543211",
//     },
//     items: [{ name: "Oil Filter", sku: "OF-TC-052", quantity: 2, price: 850 }],
//     subtotal: 1700,
//     tax: 170,
//     shipping: 150,
//     total: 2020,
//     status: "shipped",
//     paymentStatus: "paid",
//     placedAt: "2024-01-14T14:20:00Z",
//     trackingNumber: "TRK123456789",
//     shippingAddress: {
//       street: "456 Oak Avenue",
//       city: "Delhi",
//       state: "Delhi",
//       pincode: "110001",
//       country: "India",
//     },
//   },
//   {
//     id: "ORD-003",
//     customer: {
//       name: "Mike Wilson",
//       email: "mike@example.com",
//       phone: "+91 9876543212",
//     },
//     items: [{ name: "Spark Plugs (Set of 4)", sku: "SP-FF-203", quantity: 1, price: 2200 }],
//     subtotal: 2200,
//     tax: 220,
//     shipping: 180,
//     total: 2600,
//     status: "delivered",
//     paymentStatus: "paid",
//     placedAt: "2024-01-13T09:15:00Z",
//     deliveredAt: "2024-01-16T16:30:00Z",
//     shippingAddress: {
//       street: "789 Pine Road",
//       city: "Bangalore",
//       state: "Karnataka",
//       pincode: "560001",
//       country: "India",
//     },
//   },
//   {
//     id: "ORD-004",
//     customer: {
//       name: "Lisa Chen",
//       email: "lisa@example.com",
//       phone: "+91 9876543213",
//     },
//     items: [{ name: "Air Filter", sku: "AF-NS-101", quantity: 1, price: 1200 }],
//     subtotal: 1200,
//     tax: 120,
//     shipping: 120,
//     total: 1440,
//     status: "cancelled",
//     paymentStatus: "refunded",
//     placedAt: "2024-01-12T11:45:00Z",
//     cancelledAt: "2024-01-13T10:00:00Z",
//     shippingAddress: {
//       street: "321 Cedar Lane",
//       city: "Chennai",
//       state: "Tamil Nadu",
//       pincode: "600001",
//       country: "India",
//     },
//   },
// ];

export default function OrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const findThings = async () => {
      const orders = await getOrders();
      const ords: Order[] = [];
      for (const ord of orders) {
        const customer = await findUserById(ord.userId);
        const nord = {
          ...ord,
          customer,
        };
        ords.push(nord);
      }

      console.log(`the orders are: `, orders);
      setOrders(ords);
    };

    findThings();
  }, []);

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
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return AlertCircle;
      default:
        return Package;
    }
  };

  // Removed unused formatDate helper; places now use toLocaleString directly

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(
      (o) => o.status === OrderStatus.PENDING
    ).length;
    const shipped = orders.filter(
      (o) => o.status === OrderStatus.SHIPPED
    ).length;
    const delivered = orders.filter(
      (o) => o.status === OrderStatus.DELIVERED
    ).length;

    return { total, pending, shipped, delivered };
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeTab === "all" || order.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Orders
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shipped}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {order.items.length} item(s)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items[0].name}
                          {order.items.length > 1 &&
                            ` +${order.items.length - 1} more`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ETB {order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.placedAt.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/supplier/orders/${order.id}`)
                        }
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No orders found matching your criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
