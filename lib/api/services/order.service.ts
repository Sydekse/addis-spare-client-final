import api from "../client";
import type { Order, CreateOrderDto, UpdateOrderStatusDto } from "@/types/order";

// ➕ Place a new order
export async function createOrder(data: CreateOrderDto) {
  const response = await api.post<Order>("/orders", data);
  return response.data;
}

// 📦 Get all orders
export async function getOrders() {
  const response = await api.get<Order[]>("/orders");
  return response.data;
}

// 👤 Get orders by user ID
export async function getOrdersByUserId(userId: string) {
  const response = await api.get<Order[]>(`/orders/byUser/${userId}`);
  return response.data;
}

// 🔍 Get a single order by ID
export async function getOrderById(id: string) {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
}

// ❌ Cancel an order
export async function cancelOrder(id: string) {
  const response = await api.put<Order>(`/orders/${id}/cancel`);
  return response.data;
}

// ✏️ Update order status
export async function updateOrderStatus(id: string, data: UpdateOrderStatusDto) {
  const response = await api.put<Order>(`/orders/${id}`, data);
  return response.data;
}

// 🗑️ Delete an order
export async function deleteOrder(id: string) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}
