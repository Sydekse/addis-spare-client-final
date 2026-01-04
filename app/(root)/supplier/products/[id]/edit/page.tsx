"use client";
import { use, useEffect, useState } from "react";
import EditProduct from "@/components/products/edit-product";
import { getProductById } from "@/lib/api/services/product.service";
import { Product } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ id?: string }>;
}

export default function Page({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const product = await getProductById(id);
          setProduct(product);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <EditProduct product={product} />
    </div>
  );
}
