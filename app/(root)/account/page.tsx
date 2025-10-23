"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Package,
  MessageSquare,
  RotateCcw,
  Edit,
  Save,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Order } from "@/types/order";
import { getOrdersByUserId } from "@/lib/api/services/order.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CreateTransactionDto, TransactionType } from "@/types/transactions";
import { capturePayment } from "@/lib/api/services/transactions.service";
import SupplierMessagesPage from "./components/messages";

export default function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const [isCheckingout, setCheckingOut] = useState(false);

  const handleCheckout = async (orderId: string) => {
    const payload: CreateTransactionDto = {
      orderId: orderId,
      type: TransactionType.CAPTURE,
    };

    setCheckingOut(true);
    try {
      const response = await capturePayment(payload);
      const url = response.gatewayResponse;
      window.location.href = url;
    } catch {
      toast.error("unable to complete the checkout data.");
    } finally {
      setCheckingOut(false);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const profileData = {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.contact?.phone || "",
      address: user?.contact?.address || "",
      city: user?.contact?.city || "",
      country: user?.contact?.country || "Ethiopia",
    };
    setProfileData(profileData);
  }, [user]);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.contact?.phone || "",
    address: user?.contact?.address || "",
    city: user?.contact?.city || "",
    country: user?.contact?.country || "Ethiopia",
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    setIsEditing(false);
  };

  const handleNavigate = (tab: string) => {
    router.push(`/account?tab=${tab}`);
  };

  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      try {
        const orders = await getOrdersByUserId(user.id);
        setUserOrders(orders);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      } finally {
      }
    };

    fetchOrders();
  }, [user?.id]);
  //   const userOrders = [];
  //   const wishlistItems = [];

  const returnRequests = [
    {
      id: "1",
      orderId: "12345",
      productName: "Toyota Camry Brake Pads",
      reason: "Wrong part received",
      status: "pending",
      requestDate: new Date(Date.now() - 172800000),
    },
  ];

  // const [selectedMessage ] = useState(messages[0]);

  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderOpen(true);
  };

  const handleDownloadInvoice = async () => {
    if (!selectedOrder) {
      toast.error("No order selected");
      return;
    }

    if (typeof window === "undefined") {
      toast.error("Cannot export PDF during server-side rendering");
      return;
    }

    try {
      const jsPDF = (await import("jspdf")).default;
      const { toPng } = await import("html-to-image");

      const element = document.getElementById("order-dialog-content");
      if (!element) throw new Error("Dialog content not found");

      // Convert dialog content to PNG
      const dataUrl = await toPng(element, { cacheBust: true });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      const { width, height } = element.getBoundingClientRect();
      const margin = 10;
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (height * imgWidth) / width;

      pdf.addImage(dataUrl, "PNG", margin, margin, imgWidth, imgHeight);

      pdf.save(`Order-${selectedOrder.id.slice(-6)}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export invoice. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account and orders
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleNavigate}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          {/* <TabsTrigger value="returns">Returns</TabsTrigger> */}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={
                      isEditing ? handleSaveProfile : () => setIsEditing(true)
                    }
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your orders and account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional emails and product updates
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get SMS updates for order status changes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Member since {formatDate(user?.createdAt || new Date())}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {userOrders.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Orders
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Track Order
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Return Item
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          {userOrders.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Latest Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const latestOrder = [...userOrders].sort(
                    (a, b) =>
                      new Date(b.placedAt).getTime() -
                      new Date(a.placedAt).getTime()
                  )[0];
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Order #{latestOrder.id.slice(-6)}
                        </span>
                        <Badge
                          variant={
                            latestOrder.status === "DELIVERED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {latestOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Placed on {formatDate(latestOrder.placedAt)}
                        </span>
                        <span>{latestOrder.items.length} items</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(latestOrder.total)}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(latestOrder)}
                      >
                        View Details
                      </Button>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.slice(-6)}
                      </TableCell>
                      <TableCell>{formatDate(order.placedAt)}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "DELIVERED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
            <DialogContent className="sm:max-w-6xl p-6 sm:p-8">
              {selectedOrder && (
                <>
                  <div id="order-dialog-content">
                    {/* Header */}
                    <DialogHeader className="space-y-2">
                      <DialogTitle className="text-xl font-bold">
                        Order #{selectedOrder.id.slice(-6)}
                      </DialogTitle>
                      <DialogDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                        <span>
                          Placed on {formatDate(selectedOrder.placedAt)}
                        </span>
                        <Badge className="w-fit">{selectedOrder.status}</Badge>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-8">
                      {/* Items */}
                      <section>
                        <h4 className="font-semibold text-lg mb-4">Items</h4>
                        <div className="overflow-x-auto rounded-lg border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-center">
                                  Quantity
                                </TableHead>
                                <TableHead className="text-right">
                                  Unit Price
                                </TableHead>
                                <TableHead className="text-right">
                                  Subtotal
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedOrder.items.map((item) => (
                                <TableRow key={item.productId}>
                                  <TableCell>{item.sku}</TableCell>
                                  <TableCell className="font-medium">
                                    {item.name}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatPrice(item.unitPrice)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatPrice(
                                      item.unitPrice * item.quantity
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </section>

                      {/* Order Summary */}
                      <section>
                        <h4 className="font-semibold text-lg mb-4">
                          Order Summary
                        </h4>
                        <div className="grid gap-2 text-sm sm:text-base">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(selectedOrder.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{formatPrice(selectedOrder.tax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span>
                              {formatPrice(selectedOrder.shippingFee)}
                            </span>
                          </div>
                          {selectedOrder.discounts &&
                            selectedOrder.discounts?.length > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>
                                  Discount ({selectedOrder.discounts[0].code})
                                </span>
                                <span>
                                  -
                                  {formatPrice(
                                    selectedOrder.discounts[0].amount
                                  )}
                                </span>
                              </div>
                            )}
                          <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-4">
                            <span>Total</span>
                            <span>{formatPrice(selectedOrder.total)}</span>
                          </div>
                        </div>
                      </section>

                      {/* Metadata */}
                      <section>
                        <h4 className="font-semibold text-lg mb-4">
                          Order Info
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base">
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Order ID</p>
                            <p className="font-medium">{selectedOrder.id}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">User ID</p>
                            <p className="font-medium">
                              {selectedOrder.userId}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Placed At</p>
                            <p className="font-medium">
                              {formatDate(selectedOrder.placedAt)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">
                              Last Updated
                            </p>
                            <p className="font-medium">
                              {formatDate(selectedOrder.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      variant="default"
                      disabled={isCheckingout}
                      onClick={() => handleCheckout(selectedOrder.id)}
                    >
                      Checkout Payment
                    </Button>
                    <Button onClick={handleDownloadInvoice} variant="default">
                      Download Invoice
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplierMessagesPage />
            </CardContent>
          </Card>
          {/* Dialog for message details
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
              {selectedMessage && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedMessage.subject}</DialogTitle>
                    <DialogDescription>
                      From: {selectedMessage.from} •{" "}
                      {formatDate(selectedMessage.date)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {selectedMessage.message}
                    </p>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog> */}
        </TabsContent>

        {/* Returns Tab */}
        <TabsContent value="returns" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Return Requests</CardTitle>
                  <Button>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Return Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          #{request.id}
                        </TableCell>
                        <TableCell>#{request.orderId}</TableCell>
                        <TableCell>{request.productName}</TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{request.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm">
                <ul className="space-y-2">
                  <li>Returns are accepted within 30 days of delivery</li>
                  <li>Items must be in original condition and packaging</li>
                  <li>Free returns for defective or wrong items</li>
                  <li>Customer pays return shipping for change of mind</li>
                  <li>Refunds processed within 5-7 business days</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
