import { getProductById, getProducts } from "@/lib/api/services/product.service";
import ProductDetailClient from "@/components/products/product-detail";
import { getRatingById, getRatingsForProduct } from "@/lib/api/services/ratings.service";
import { getReviews } from "@/lib/api/services/review.service";

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  const relatedProducts = await getProducts();
  const productRatings: any[] = [];
  const productReviews: any[] = [];

  return (
    <ProductDetailClient
      product={product}
      type={"edit"}
      relatedProducts={relatedProducts}
    />
  );
}
