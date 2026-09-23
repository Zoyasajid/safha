import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageClient } from "@/components/catalog/search-page";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Urdu and English books at Safha Karachi.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-6 py-20 text-center text-ink-muted">Searching the shelves…</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
