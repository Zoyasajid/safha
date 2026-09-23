import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { booksByCategory } from "@/lib/books";

export const metadata: Metadata = {
  title: "English Books",
  description: "English fiction and non-fiction delivered across Pakistan from Safha Karachi.",
};

export default function EnglishPage() {
  return (
    <CatalogView
      eyebrow="English"
      title="English books"
      description="International ideas and stories, sourced for Pakistani readers."
      books={booksByCategory("english")}
      hideCategoryFilter
    />
  );
}
