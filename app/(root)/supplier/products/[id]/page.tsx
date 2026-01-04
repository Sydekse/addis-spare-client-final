import {
  getProductById,
  getProducts,
} from "@/lib/api/services/product.service";
import ProductDetailClient from "@/components/products/product-detail";

export default async function Page(props: {
  params?: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const product = await getProductById(params?.id as string);
  const relatedProducts = await getProducts();

  return (
    <ProductDetailClient
      product={product}
      type={"edit"}
      relatedProducts={relatedProducts}
    />
  );
}
