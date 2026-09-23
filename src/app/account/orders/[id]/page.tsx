import type { Metadata } from "next";
import { OrderDetail } from "@/components/account/account-views";

export const metadata: Metadata = { title: "Order" };

type Props = { params: Promise<{ id: string }> };

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
