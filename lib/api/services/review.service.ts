import { CreateReviewDto, Review, UpdateReviewDto } from "@/types/review";
import { getApi } from "../api";

// Create a review
export async function createReview(data: CreateReviewDto) {
  const api = getApi();
  const response = await api.post<Review>("/reviews", data);
  return response.data;
}

// Update a review
export async function updateReview(id: string, data: UpdateReviewDto) {
  const api = getApi();
  const response = await api.patch<{ message: string }>(`/reviews/${id}`, data);
  return response.data;
}

// Get all reviews for a product
export async function getReviewsForProduct(productId: string) {
  const api = getApi();
  const response = await api.get<Review[]>(`/reviews/for-product/${productId}`);
  return response.data;
}


// Get all reviews for a product
export async function getReviews() {
  const api = getApi();
  const response = await api.get<Review[]>(`/reviews`);
  return response.data;
}
