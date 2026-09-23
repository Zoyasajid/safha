import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <Container className="max-w-3xl py-14">
      <h1 className="font-serif text-4xl">Returns</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-muted">
        <p>
          If a book arrives damaged or is the wrong title, photograph the parcel and write to us within
          48 hours. We will replace or refund.
        </p>
        <p>
          Unused copies in original condition may be returned within 7 days. Reading copies, marked
          pages, and opened sealed editions cannot be returned.
        </p>
        <p>Refunds for online payments are processed within 5–7 working days. COD returns are adjusted on pickup.</p>
      </div>
    </Container>
  );
}
