"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
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

  const handleContactSeller = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    console.log("Contact seller:", contactMessage);
    setShowContactDialog(false);
    setContactMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
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
        <span>{product.name}</span>
      </nav>

      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
      </Button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    index === selectedImageIndex
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category + actions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="capitalize">
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
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-lg text-muted-foreground mb-2">
                by {product.brand}
              </p>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              SKU: {product.sku}
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= averageRating
                        ? "fill-current text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({ratings.length} users)
                </span>
              </div>
            </div>
          </div>

          {/* Price + Add to Cart */}
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">In Stock</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Qty:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded px-3 py-1"
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
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
              </Button>
            </div>

            {type === "edit" && <RatingReview product={product} />}
            {/* Contact Seller */}
            <Dialog
              open={showContactDialog}
              onOpenChange={setShowContactDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Supplier</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="I have a question about this product..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowContactDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleContactSeller}>Send Message</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Warranty</div>
              <div className="text-xs text-muted-foreground">2 Years</div>
            </div>
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Fast Delivery</div>
              <div className="text-xs text-muted-foreground">24–48 hours</div>
            </div>
            <div className="text-center">
              <RotateCcw className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Returns</div>
              <div className="text-xs text-muted-foreground">30 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className={`grid w-full ${type === "show" ? "grid-cols-3" : "grid-cols-4"}`}
          >
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
            {type === "edit" && (
              <TabsTrigger value="inventories">Inventories</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p>{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Vehicle Compatibility
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.compatibility?.map((comp: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="font-medium">
                        {comp.make} {comp.model}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Year: {comp.year}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= averageRating
                                ? "fill-current text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Based on {ratings.length}{" "}
                        {ratings.length === 1 ? "user" : "users"}
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/reviews/${product.id}`)}
                    >
                      Write a Review
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {reviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-medium">Anonymous User</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-medium mb-2">
                        {review.body.slice(0, 10)} ...
                      </h4>
                    )}
                    <p className="text-muted-foreground">{review.body}</p>
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
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related: any) =>
              related.id !== product.id ? (
                <Card
                  key={related.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                      <Image
                        src={related.images?.[0] || "/image.jpg"}
                        alt={related.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium line-clamp-2 mb-2">
                      {related.name}
                    </h3>
                    <div className="font-semibold text-primary">
                      {formatPrice(related.price)}
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => router.push(`/product/${related.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
