"use client";

import { BookGrid } from "@/components/books/book-grid";
import { Container } from "@/components/ui/container";
import { useStore } from "@/context/store-context";
import { getBookById } from "@/lib/books";

export function WishlistView() {
  const { wishlist } = useStore();
  const books = wishlist
    .map((id) => getBookById(id))
    .filter((book): book is NonNullable<ReturnType<typeof getBookById>> => Boolean(book));

  return (
    <Container className="py-12">
      <h1 className="font-serif text-4xl">Wishlist</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {books.length ? `${books.length} saved titles` : "Nothing saved yet — tap the heart on a book you love."}
      </p>
      <div className="mt-10">
        <BookGrid books={books} />
      </div>
    </Container>
  );
}
