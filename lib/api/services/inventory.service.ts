import api from "../client";
import type {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
} from "@/types/inventory";

// ➕ Create a new inventory item
export async function createInventory(data: CreateInventoryDto) {
  const response = await api.post<Inventory>("/inventories", data);
  return response.data;
}

// 🔍 Get a single inventory item by ID
export async function getInventoryById(id: string) {
  const response = await api.get<Inventory>(`/inventories/${id}`);
  return response.data;
}

// 📦 Get all inventory items
export async function getInventories() {
  const response = await api.get<Inventory[]>("/inventories");
  return response.data;
}

// ✏️ Update an inventory item
export async function updateInventory(id: string, data: UpdateInventoryDto) {
  const response = await api.put<Inventory>(`/inventories/${id}`, data);
  return response.data;
}

export async function getInventoryByProduct(productId: string) {
  const response = await api.get<Inventory[]>(
    `/inventories/product/${productId}`
  );
  return response.data;
}

// 🗑️ Delete an inventory item
export async function deleteInventory(id: string) {
  const response = await api.delete(`/inventories/${id}`);
  return response.data;
}
