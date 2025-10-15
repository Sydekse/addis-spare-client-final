import {
  getProductById,
  getProducts,
} from "@/lib/api/services/product.service";
import ProductDetailClient from "@/components/products/product-detail";

export default async function Page(props: {
  params?: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params?.id as string;
  const product = await getProductById(id);
  const relatedProducts = await getProducts();

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      type="show"
    />
  );
}
