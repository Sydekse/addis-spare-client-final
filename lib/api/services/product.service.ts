import api from "../client";
import type { Product, CreateProductDto, UpdateProductDto } from "@/types/product";

export async function searchProducts(query: string) {
  const response = await api.get<Product[]>(`/products/search?q=${query}`);
  return response.data;
}

export async function createProduct(data: CreateProductDto) {
  const response = await api.post<Product>("/products", data);
  return response.data;
}

export async function getCompatibleProducts(params: {
  make?: string;
  model?: string;
  year?: number;
  useOr?: boolean;
}) {
  const response = await api.get<Product[]>("/products/compatible", {
    params,
  });
  return response.data;
}

export async function getProducts(filters?: Record<string, string>) {
  const response = await api.get<Product[]>("/products", { params: filters });
  return response.data;
}

export async function getProductById(id: string) {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function updateProduct(id: string, data: UpdateProductDto) {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
