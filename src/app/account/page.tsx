import type { Metadata } from "next";
import { AccountHome } from "@/components/account/account-views";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return <AccountHome />;
}
