export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  brand?: string;
  category: string;
  price: number;
  images?: string[];
  attributes?: Record<string, any>;
  compatibility: Array<{
    make: string;
    model: string;
    year: number;
  }>;
  tags?: string[];
  stockControlled: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  compatibilityNote?: string;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  couponCode?: string;
  discountAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

