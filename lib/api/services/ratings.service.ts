import api from "../client";
import type { Rating, CreateRatingDto, UpdateRatingDto } from "@/types/rating";

export async function createRating(data: CreateRatingDto) {
  const response = await api.post<Rating>("/ratings", data);
  return response.data;
}

export async function getRatings() {
  const response = await api.get<Rating[]>("/ratings");
  return response.data;
}

export async function getRatingById(id: string) {
  const response = await api.get<Rating>(`/ratings/${id}`);
  return response.data;
}

export async function getRatingsForProduct(productId: string) {
  const response = await api.get<Rating[]>(`/ratings/for-product/${productId}`);
  return response.data;
}

export async function updateRating(id: string, data: UpdateRatingDto) {
  const response = await api.put<Rating>(`/ratings/${id}`, data);
  return response.data;
}

export async function deleteRating(id: string) {
  const response = await api.delete(`/ratings/${id}`);
  return response.data;
}
