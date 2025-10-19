"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import { createReview } from "@/lib/api/services/review.service";
import { createRating } from "@/lib/api/services/ratings.service";
import { Product } from "@/types/product";

interface RatingReviewProps {
  product: Product;
}

export default function RatingReview({ product }: RatingReviewProps) {
  const { user } = useAuth();
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const [score, setScore] = useState(0);
  const [reviewBody, setReviewBody] = useState("");

  const handleCreateRating = async () => {
    if (!user) {
      toast.error("You must be logged in to rate this product");
      return;
    }

    if (score < 1 || score > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    try {
      const rating = await createRating({ productId: product.id, score });
      console.log(`rating is created: `, rating);
      toast.success("Rating submitted successfully");
      setRatingDialogOpen(false);
      setScore(0);
    } catch (err: unknown) {
      let errMessage: string | undefined;
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        errMessage = err.response.data?.message;
      } else if (err instanceof Error) {
        errMessage = err.message;
      }

      toast.error(errMessage || "unable to create a rating");
    }
  };

  const handleCreateReview = async () => {
    if (!user) {
      toast.error("You must be logged in to write a review");
      return;
    }

    if (reviewBody.length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    try {
      const review = await createReview({
        productId: product.id,
        userId: user.id,
        body: reviewBody,
      });
      console.log(`review has been created: `, review);
      toast.success("Review submitted successfully");
      setReviewDialogOpen(false);
      setReviewBody("");
    } catch (err: unknown) {
      console.error(err);
      const errMessage = axios.isAxiosError(err)
        ? err?.response?.data?.message
        : err instanceof Error
          ? err.message
          : undefined;

      toast.error(errMessage || "unable to create a review");
    }
  };

  return (
    <div className="w-full grid grid-cols-2 gap-3 md:gap-6">
      {/* Rating Button */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogTrigger asChild>
          <Button>Rate Product</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate {product.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center space-x-2 my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${
                  star <= score
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
                onClick={() => setScore(star)}
              />
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setRatingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateRating}>Submit Rating</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Button */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Write Review</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review for {product.name}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
            placeholder="Write your review here..."
            rows={6}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateReview}>Submit Review</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
