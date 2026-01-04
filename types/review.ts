import { Product } from "./product";
import { User } from "./user";

export interface Review {
  id: string;
  userId: string;
  productId: string;
  body: string;
  user?: User;
  product?: Product;
  createdAt: string; // use string for ISO date when coming from API
  updatedAt: string;
}

export interface CreateReviewDto {
  userId: string;
  productId: string;
  body: string; // 10–1000 characters validation handled server-side
}

// DTO for updating a review
export interface UpdateReviewDto {
  reviewId?: string;
  body: string; // 10–1000 characters validation handled server-side
  userId?: string;
}
