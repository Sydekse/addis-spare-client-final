import OrderDetailPage from "@/components/orders/order-details";
import { getOrderById } from "@/lib/api/services/order.service";

export default async function OrderDetailPageWrapper({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) return <p className="min-h-[400px] flex items-center justify-center">Loading...</p>;
  return <OrderDetailPage ord={order} />;
}
