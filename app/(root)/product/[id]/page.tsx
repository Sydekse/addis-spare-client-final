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
    <div className="w-full px-2 md:px-16">
      <ProductDetailClient
        product={product}
        type={"show"}
        relatedProducts={relatedProducts}
      />
    </div>
  );
}
