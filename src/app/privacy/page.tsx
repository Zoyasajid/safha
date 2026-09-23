import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-14">
      <h1 className="font-serif text-4xl">Privacy</h1>
      <p className="mt-6 text-sm leading-relaxed text-ink-muted">
        Safha stores your cart, wishlist, and account details on this device so the shop can remember
        you. When a live backend is connected, we will only use your information to fulfil orders,
        send the letter you asked for, and improve the bookshop. We do not sell reader data.
      </p>
    </Container>
  );
}
