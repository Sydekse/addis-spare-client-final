import OrderDetailPage from "@/components/orders/order-details";
import { getOrderById } from "@/lib/api/services/order.service";

export default async function OrderDetailPageWrapper(props: {
  params?: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const order = await getOrderById(params?.id as string);
  if (!order)
    return (
      <p className="min-h-[400px] flex items-center justify-center">
        Loading...
      </p>
    );
  return <OrderDetailPage ord={order} />;
}
