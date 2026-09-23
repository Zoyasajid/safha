import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { books } from "@/data/books";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Urdu, English, novels, self-help and more at Safha Karachi.",
};

export default function CategoriesPage() {
  return (
    <CatalogView
      eyebrow="The shelves"
      title="All categories"
      description="Filter by language, author, and price. Everything is priced in PKR."
      books={books}
    />
  );
}
