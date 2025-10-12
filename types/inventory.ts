import { Product } from "./product";

export interface CreateInventoryDto {
  productId: string;
  location: string;
  quantity: number;
  reorderTreshould: number;
  supplierId?: string;
}

export interface UpdateInventoryDto {
  productId: string;
  location: string;
  quantity: number;
  reorderTreshould: number;
  supplierId?: string;
}

export interface Inventory {
  id: string;
  productId: string;
  location: string;
  quantity: number;
  reorderTreshould: number;
  supplierId?: string;
  lastUpdated: Date;
  product: Product;
}
