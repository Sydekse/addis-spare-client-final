"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  RefreshCw,
  Download,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { Order, OrderItem, OrderStatus } from "@/types/order";
import { getOrderById } from "@/lib/api/services/order.service";
import { findUserById } from "@/lib/api/services/user.service";
import { getProductById } from "@/lib/api/services/product.service";
import Image from "next/image";

export default function OrderDetailPage({ ord }: {ord: Order}) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [order, setOrder ] = useState<Order>(ord);

  useEffect(() => {
    const fetchProducts = async () => {
        const items: OrderItem[] = []
        for (const item of order.items) {
            const product = await getProductById(item.productId);
            const it = {
                product,
                ...item
            };
            items.push(it);
        }

        setOrder({...order, items})
    }
    fetchProducts();

  }, [])   

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
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
    minute: "2-digit",
    });

  const formatAddress = (address: any) =>
    `${address.street}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country}`;

  const handleStatusUpdate = () => {
    console.log("Updating order status:", { id: order.id, orderStatus, trackingNumber, notes });
  };

  const handleRefund = () => {
    console.log("Processing refund for order:", order.id);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/supplier/orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order {order.id}</h1>
            <p className="text-muted-foreground">Placed on {order.placedAt.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Image src={item.product?.images[0] || "/image.jpg"} alt={item.name} width={64} height={64} className="h-16 w-16 rounded object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ETB {(item.quantity * item.unitPrice).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ETB {item.unitPrice.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>ETB {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>ETB {order.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>ETB {order.shippingFee.toLocaleString()}</span>
                </div>
                {order.discounts && order.discounts?.length > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discounts:</span>
                    <span>
                      -ETB {order.discounts.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>ETB {order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" /> Update Order Status
              </CardTitle>
              <CardDescription>Change the order status and add tracking info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">scr
                <div className="space-y-2">
                  <Label>Order Status</Label>
                  <Select value={orderStatus} onValueChange={(v) => setOrderStatus(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {orderStatus === OrderStatus.SHIPPED && (
                  <div className="space-y-2">
                    <Label>Tracking Number</Label>
                    <Input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleStatusUpdate} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Update Status
                </Button>
                {orderStatus === OrderStatus.PAID && (
                  <Button variant="destructive" onClick={handleRefund} className="gap-2">
                    <AlertTriangle className="h-4 w-4" /> Process Refund
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.customer?.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer?.email}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <MessageSquare className="h-4 w-4" /> Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {/* {order.shippingFee && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{formatAddress(order.customer?.address)}</p>
              </CardContent>
            </Card>
          )} */}

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">ETB {order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
