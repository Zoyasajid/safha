import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "Karachi same-day delivery and Pakistan-wide courier from Safha.",
};

export default function ShippingPage() {
  return (
    <Container className="max-w-3xl py-14">
      <h1 className="font-serif text-4xl">Shipping</h1>
      <div className="prose-safha mt-6 space-y-4 text-sm leading-relaxed text-ink-muted">
        <p>
          Safha ships from Shahrah-e-Faisal, Karachi. All prices are in
          Pakistani Rupees (PKR).
        </p>
        <h2 className="font-serif text-2xl text-ink">Delivery charges</h2>
        <p>
          Flat Rs. 200 across Pakistan, or free on orders of Rs. 3,000 and
          above. {SITE.karachiDelivery}. {SITE.pakistanDelivery}.
        </p>
        <h2 className="font-serif text-2xl text-ink">Cash on Delivery</h2>
        <p>
          COD is available in Karachi, Lahore, Islamabad, and most major cities.
          Please keep the exact amount ready in PKR.
        </p>
      </div>
    </Container>
  );
}
