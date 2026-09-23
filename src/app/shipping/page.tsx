import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Karachi same-day delivery and Pakistan-wide courier from Safha.",
};

export default function ShippingPage() {
  return (
    <Container className="max-w-3xl py-14">
      <h1 className="font-serif text-4xl">Shipping</h1>
      <div className="prose-safha mt-6 space-y-4 text-sm leading-relaxed text-ink-muted">
        <p>
          Safha ships from Clifton, Karachi. All prices are in Pakistani Rupees (PKR).
        </p>
        <h2 className="font-serif text-2xl text-ink">Karachi</h2>
        <p>{SITE.karachiDelivery}. Shipping is Rs. 150, or free on orders of Rs. 3,000 and above.</p>
        <h2 className="font-serif text-2xl text-ink">Rest of Pakistan</h2>
        <p>{SITE.pakistanDelivery}. Flat Rs. 350 below Rs. 3,000; free above.</p>
        <h2 className="font-serif text-2xl text-ink">Cash on Delivery</h2>
        <p>
          COD is available in Karachi, Lahore, Islamabad, and most major cities. Please keep the exact
          amount ready in PKR.
        </p>
      </div>
    </Container>
  );
}
