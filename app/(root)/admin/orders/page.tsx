"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Order, OrderStatus } from "@/types/order";
import { getOrders } from "@/lib/api/services/order.service";
import { findUserById } from "@/lib/api/services/user.service";


export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

   const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Badge variant="secondary">Pending</Badge>;
      case OrderStatus.PAID:
        return <Badge variant="outline" className="text-blue-600">Paid</Badge>;
      case OrderStatus.SHIPPED:
        return <Badge variant="outline" className="text-purple-600">Shipped</Badge>;
      case OrderStatus.DELIVERED:
        return <Badge variant="outline" className="text-green-600">Delivered</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getOrders();
      const finOrds: Order[] = []
      for (const order of orders) {
        const user = await findUserById(order.userId);
        const newOrder = {
          user,
          ...order,
        }
        finOrds.push(newOrder);
      }
      setOrders(finOrds);
    };
    fetchOrders();
  }, [])

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case OrderStatus.PAID:
        return <CheckCircle className="h-4 w-4" />;
      case OrderStatus.SHIPPED:
        return <Truck className="h-4 w-4" />;
      case OrderStatus.DELIVERED:
        return <Package className="h-4 w-4" />;
      case OrderStatus.CANCELLED:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

   return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Order Management</h1>
            <p className="text-muted-foreground">Track and manage all customer orders</p>
          </div>
          {/* <div className="flex gap-2">
            <Button variant="outline">Export Orders</Button>
            <Button variant="outline">Print Invoices</Button>
          </div> */}
        </div>
  
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === OrderStatus.PENDING).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === OrderStatus.SHIPPED).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === OrderStatus.DELIVERED).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ETB {orders.filter(o => o.status !== OrderStatus.DELIVERED).reduce((sum, o) => sum + Number(o.total), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              {filteredOrders.length} of {orders.length} orders shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {/* Orders Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id.slice(-8).toUpperCase()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.user?.name}</div>
                          <div className="text-sm text-muted-foreground">{order.user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                          <div className="text-muted-foreground">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">ETB {order.total}</div>
                        <div className="text-sm text-muted-foreground">
                          +ETB {order.tax} tax
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(order.placedAt).toLocaleString()}</div>
                          <div className="text-muted-foreground">
                            {new Date(order.placedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* {order.status === 'paid' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(order.id, 'shipped')}
                            >
                              Ship
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                            >
                              Deliver
                            </Button>
                          )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
  
            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No orders found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
  
        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
              <DialogHeader>
                <DialogTitle>Order Details - #{selectedOrder.id.slice(-8).toUpperCase()}</DialogTitle>
                <DialogDescription>
                  Complete order information and management options
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium">Order Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Order Date</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedOrder.placedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedOrder.updatedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
  
                {/* Customer Information */}
                <div>
                  <h4>Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="text-sm font-medium">Customer Name</label>
                      <p className="text-sm text-muted-foreground">{selectedOrder.user?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <p className="text-sm text-muted-foreground">{selectedOrder.user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Customer ID</label>
                      <p className="text-sm text-muted-foreground font-mono">{selectedOrder.userId.slice(-8)}</p>
                    </div>
                  </div>
                </div>
  
                {/* Order Items */}
                <div>
                  <h4>Order Items</h4>
                  <div className="border rounded-lg mt-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">ETB {item.unitPrice}</TableCell>
                            <TableCell className="text-right">ETB {(item.quantity * item.unitPrice)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
  
                {/* Order Totals */}
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="w-72 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>ETB {selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>ETB {selectedOrder.tax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>ETB {selectedOrder.shippingFee}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>ETB {selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Status Management
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    {selectedOrder.status === 'pending' && (
                      <Button onClick={() => {
                        handleStatusChange(selectedOrder.id, 'paid');
                        setSelectedOrder(null);
                      }}>
                        Mark as Paid
                      </Button>
                    )}
                    {selectedOrder.status === 'paid' && (
                      <Button onClick={() => {
                        handleStatusChange(selectedOrder.id, 'shipped');
                        setSelectedOrder(null);
                      }}>
                        <Truck className="h-4 w-4 mr-2" />
                        Mark as Shipped
                      </Button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, 'delivered');
                          setSelectedOrder(null);
                        }}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                )} */}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
}
   
