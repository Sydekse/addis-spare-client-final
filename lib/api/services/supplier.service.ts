import api from "../client";
import type { SupplierDetails, User } from "@/types/user";

export async function getSuppliers() {
  const response = await api.get<User[]>("/users/suppliers");
  return response.data;
}

export async function createSupplier(id: string, data: SupplierDetails) {
  const response = await api.post<User>(`/users/${id}/supplier-details`, data);
  return response.data;
}

export async function verifySupplier(id: string) {
  const response = await api.put<User>(`/users/${id}/verify-supplier`);
  return response.data;
}

export async function updateSupplier(id: string, data: SupplierDetails) {
  const response = await api.put<User>(`/users/${id}/supplier-details`, data);
  return response.data;
}
