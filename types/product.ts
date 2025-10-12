export interface CompatibilityData {
  make: string;
  model: string;
  year: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  attributes?: Record<string, any>;
  tags?: string[];
  stockControlled: boolean;
  compatibility: CompatibilityData[];
}

export interface UpdateProductDto {
  name: string;
  description: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  attributes?: Record<string, any>;
  tags?: string[];
  stockControlled: boolean;
  compatibility: CompatibilityData[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  attributes: Record<string, any>;
  tags: string[];
  stockControlled: boolean;
  status: string | null;
  compatibility: CompatibilityData[];
  createdAt: Date;
  updatedAt: Date;
}
