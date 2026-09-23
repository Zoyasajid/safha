import type { Metadata } from "next";
import { OrdersList } from "@/components/account/account-views";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return <OrdersList />;
}
