import { Product } from "./product";
import { User } from "./user";

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItemDto {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDiscountDto {
  code: string;
  amount: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  shippingFee: number;
  discounts?: OrderDiscountDto[];
  status: OrderStatus;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderInventory {
  id: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
  inventories: OrderInventory[];
}

export interface OrderDiscount {
  code: string;
  amount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  customer?: User;
  discounts?: OrderDiscount[];
  total: number;
  status: OrderStatus;
  placedAt: Date;
  updatedAt: Date;
  user?: User;
}
