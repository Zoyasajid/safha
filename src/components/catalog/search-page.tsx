"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import { books } from "@/data/books";
import { searchBooks } from "@/lib/books";

export function SearchPageClient() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const results = useMemo(() => (q ? searchBooks(q) : books), [q]);

  return (
    <CatalogView
      eyebrow="Search"
      title={q ? `Results for “${q}”` : "Search the shelves"}
      description="Find Urdu and English titles by name, author, ISBN, or category."
      books={results}
    />
  );
}
