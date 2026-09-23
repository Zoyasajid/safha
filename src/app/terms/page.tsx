import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-14">
      <h1 className="font-serif text-4xl">Terms</h1>
      <p className="mt-6 text-sm leading-relaxed text-ink-muted">
        By placing an order with Safha you agree that titles are sold as described, that delivery
        estimates for Karachi and Pakistan are guidance rather than a guarantee in extraordinary
        weather or strikes, and that prices in PKR may change without notice until checkout is
        confirmed. This storefront is a complete UI ready to connect to a production inventory system.
      </p>
    </Container>
  );
}
