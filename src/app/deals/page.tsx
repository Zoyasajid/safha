import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { books } from "@/data/books";

export const metadata: Metadata = {
  title: "Deals",
  description: "Discounted books at Safha, priced in PKR with Karachi delivery.",
};

export default function DealsPage() {
  return (
    <CatalogView
      eyebrow="For a short while"
      title="Deals & discounts"
      description="Marked-down editions while stocks last. Combine with SAFHA10 at checkout when eligible."
      books={books.filter((b) => b.originalPrice)}
    />
  );
}
