"use client";

import { BookCard } from "@/components/books/book-card";
import { Stagger } from "@/components/ui/reveal";
import type { Book } from "@/types";

export function BookGrid({ books }: { books: Book[] }) {
  if (!books.length) {
    return (
      <p className="rounded-2xl border border-line bg-white/60 px-6 py-16 text-center text-ink-muted">
        No titles match these filters. Try a wider search — our shelves in Clifton are deeper than they look.
      </p>
    );
  }
  return (
    <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </Stagger>
  );
}
