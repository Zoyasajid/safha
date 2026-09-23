import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { booksByCategory } from "@/lib/books";

export const metadata: Metadata = {
  title: "Urdu Books",
  description: "اردو ناول، شاعری اور کلاسک — Safha Karachi.",
};

export default function UrduPage() {
  return (
    <CatalogView
      eyebrow="اردو کتب"
      title="Urdu books"
      description="Novels, poetry, and spiritual literature in authentic Pakistani printings."
      books={booksByCategory("urdu")}
      hideCategoryFilter
    />
  );
}
