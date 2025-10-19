import api from "../client";
import type { SupplierDetails, User } from "@/types/user";

export function getSuppliers() {
  return api.get<User[]>("/users/suppliers");
}

export function createSupplier(id: string, data: SupplierDetails) {
  return api.post<User>(`/users/${id}/supplier-details`, data);
}

export function verifySupplier(id: string) {
  return api.post<User>(`/users/suppliers/${id}/verify`);
}

export function updateSupplier(id: string, data: SupplierDetails) {
  return api.put<User>(`/users/${id}/supplier-details`, data);
}
