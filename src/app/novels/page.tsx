import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { booksByCategory } from "@/lib/books";

export const metadata: Metadata = {
  title: "Novels",
  description: "Urdu and English novels from Safha, Karachi.",
};

export default function NovelsPage() {
  return (
    <CatalogView
      eyebrow="Stories"
      title="Novels"
      description="Long-form fiction for weekends in Clifton and commutes to Saddar."
      books={booksByCategory("novels")}
      hideCategoryFilter
    />
  );
}
