import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { booksByCategory } from "@/lib/books";

export const metadata: Metadata = {
  title: "Self-Help",
  description: "Habits, money, and mindset — self-help books at Safha Karachi.",
};

export default function SelfHelpPage() {
  return (
    <CatalogView
      eyebrow="Growth"
      title="Self-help"
      description="Practical books on habits, money, and a quieter kind of ambition."
      books={booksByCategory("self-help")}
      hideCategoryFilter
    />
  );
}
