"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/use-cart";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { getInventoryByProduct } from "@/lib/api/services/inventory.service";
import { Product } from "@/types/product";
import ProductInventories from "./inventory-tab";
import RatingReview from "./rating-review";
import { Rating } from "@/types/rating";
import { getRatingsForProduct } from "@/lib/api/services/ratings.service";
import { Review } from "@/types/review";
import { getReviewsForProduct } from "@/lib/api/services/review.service";
import { toast } from "sonner";
import { CreateMessageDto, Message } from "@/types/messages";
import { createMessage } from "@/lib/api/services/message.service";
import ProductCard from "./product-card";
import { Footer } from "../layout/footer";
import Link from "next/link";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  type: "show" | "edit";
}

export default function ProductDetail({
  product,
  relatedProducts,
  type = "show",
}: ProductDetailProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  useEffect(() => {
    const fetchInventories = async () => {
      const inventories = await getInventoryByProduct(product.id);
      console.log(inventories);
    };

    const fetchProductReviews = async () => {
      const ratings = await getRatingsForProduct(product.id);
      console.log(`the ratings are: `, ratings);
      setRatings(ratings);

      const reviews = await getReviewsForProduct(product.id);
      console.log(`the reviews are: `, reviews);
      setReviews(reviews);
    };

    fetchProductReviews();
    fetchInventories();
  }, [product.id]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart, isInCart } = useCart();
  const { user } = useAuth(false);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-xl font-bold mb-4 sm:text-2xl">
          Product Not Found
        </h1>
        <Button onClick={() => router.push("/")}>Browse All Products</Button>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 0;

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    addToCart(product.id, quantity);
  };

  const handleContactSeller = async () => {
    if (!user) {
      toast.error("You must be logged in to contact the seller");
      return;
    }

    const receiverId = product.supplierId;
    const senderId = user.id;

    if (!contactMessage.trim()) {
      toast.error("Please enter a message or attach a file");
      return;
    }

    try {
      // Prepare message payload
      const messageDto: CreateMessageDto = {
        conversationId: "",
        senderId,
        recipientId: receiverId,
        body: contactMessage,
        attachments: [],
      };

      console.log(messageDto);

      const createdMessage: Message = await createMessage(messageDto);
      console.log(`the sent message is: `, createdMessage);
      toast.success("Message sent to seller");
      setShowContactDialog(false);
      setContactMessage("");
    } catch (err) {
      console.error("Failed to contact seller:", err);
      toast.error("Failed to send message. Please try again.");
    }
  };

  // const handleContactSeller = () => {
  //   if (!user) {
  //     toast.error("You must be logged in to contact the seller");
  //     return;
  //   }

  //   const recieverId = product.supplierId;
  //   const senderId = user.id;
  //   // Send message with attachments
  //   // const handleSendMessage = async () => {
  //   //   if (!selectedConversation || !user) return;
  //   //   if (!newMessage.trim() && files.length === 0) return;

  //   //   const recipientId = selectedConversation.user.id;

  //   //   try {
  //   //     // Upload files to Cloudinary
  //   //     const uploadedUrls: string[] = [];
  //   //     for (const file of files) {
  //   //       const uploaded = await uploadRawFile(file);
  //   //       console.log(uploaded);
  //   //       if (uploaded.secure_url) uploadedUrls.push(uploaded.secure_url);
  //   //     }

  //   //     const messageDto: CreateMessageDto = {
  //   //       conversationId: selectedConversation.messages[0]?.conversationId || "",
  //   //       senderId: user.id,
  //   //       recipientId,
  //   //       body: newMessage,
  //   //       attachments: uploadedUrls,
  //   //     };

  //   //     const createdMessage: Message = await createMessage(messageDto);

  //   //     // Optimistically update UI
  //   //     setSelectedConversation((prev) =>
  //   //       prev ? { ...prev, messages: [...prev.messages, createdMessage] } : prev
  //   //     );

  //   //     setNewMessage("");
  //   //     setFiles([]);
  //   //   } catch (err) {
  //   //     console.error("Failed to send message:", err);
  //   //   }
  //   // };

  //   console.log("Contact seller:", contactMessage);
  //   setShowContactDialog(false);
  //   setContactMessage("");
  // };

  return (
    <div>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          <button
            onClick={() => router.push("/")}
            className="hover:text-foreground"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/")}
            className="hover:text-foreground"
          >
            Products
          </button>
          <span>/</span>
          <button
            onClick={() => router.push(`/?category=${product.category}`)}
            className="hover:text-foreground capitalize"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="truncate max-w-[150px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-4 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
        </Button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-contain sm:object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${index === selectedImageIndex
                      ? "border-primary"
                      : "border-transparent"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Category + actions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="outline"
                  className="capitalize text-xs sm:text-sm"
                >
                  {product.category}
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-sm sm:text-lg text-muted-foreground mb-2">
                  by {product.brand}
                </p>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                SKU: {product.sku}
              </p>
              <div className="flex items-center space-x-4 mb-4 sm:mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${star <= averageRating
                        ? "fill-current text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                    ({ratings.length} users)
                  </span>
                </div>
              </div>
            </div>

            {/* Price + Add to Cart */}
            <div className="space-y-4">
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs sm:text-sm text-green-600">
                    In Stock
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-xs sm:text-sm font-medium">Qty:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  onClick={(e) => handleAddToCart(e)}
                  disabled={isInCart(product.id)}
                  className="flex-1 text-sm"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                </Button>
              </div>

              {type === "show" && <RatingReview product={product} />}
              {/* Contact Seller */}
              <Dialog
                open={showContactDialog}
                onOpenChange={setShowContactDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full text-sm" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Supplier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">
                      Contact Supplier
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder="I have a question about this product..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    className="text-sm"
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowContactDialog(false)}
                      className="text-sm"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleContactSeller} className="text-sm">
                      Send Message
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t">
              <div className="text-center">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                <div className="text-xs sm:text-sm font-medium">Warranty</div>
                <div className="text-xs text-muted-foreground">2 Years</div>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                <div className="text-xs sm:text-sm font-medium">
                  Fast Delivery
                </div>
                <div className="text-xs text-muted-foreground">24–48 hours</div>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                <div className="text-xs sm:text-sm font-medium">Returns</div>
                <div className="text-xs text-muted-foreground">30 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 sm:mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className={`flex flex-nowrap overflow-x-auto w-full ${type === "show"
                ? "sm:grid sm:grid-cols-3"
                : "sm:grid sm:grid-cols-4"
                }`}
            >
              <TabsTrigger value="description" className="text-xs sm:text-sm">
                Description
              </TabsTrigger>
              <TabsTrigger value="compatibility" className="text-xs sm:text-sm">
                Compatibility
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                Reviews ({reviews.length})
              </TabsTrigger>
              {type === "edit" && (
                <TabsTrigger value="inventories" className="text-xs sm:text-sm">
                  Inventories
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="description" className="mt-4 sm:mt-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-sm sm:text-base">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compatibility" className="mt-4 sm:mt-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">
                    Vehicle Compatibility
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.compatibility?.map((comp: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-3 sm:p-4">
                        <div className="font-medium text-sm sm:text-base">
                          {comp.make} {comp.model}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Year: {comp.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="grid gap-1 grid-cols-2 w-full">
                        <div>
                          <div className="text-xl sm:text-3xl font-bold">
                            {averageRating.toFixed(1)}
                          </div>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${star <= averageRating
                                  ? "fill-current text-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="w-full flex items-center justify-center">
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Based on {ratings.length}{" "}
                            {ratings.length === 1 ? "user" : "users"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {reviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-medium text-sm sm:text-base">
                            Anonymous User
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {review.title && (
                        <h4 className="font-medium text-sm sm:text-base mb-2">
                          {review.body.slice(0, 10)} ...
                        </h4>
                      )}
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {review.body}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <ProductInventories product={product} />
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4 mt-16">
              <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
              <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
              {relatedProducts.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
            </div>
            <Link href='/products'>
              <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                See more
              </button>
            </Link>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
