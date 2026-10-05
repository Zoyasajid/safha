import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/books/product-view";
import { books } from "@/data/books";
import { getBookBySlug } from "@/lib/books";
import { readFirestoreAuthorById } from "@/lib/admin/firestore-authors";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return { title: "Book" };
  const author = await readFirestoreAuthorById(book.authorId);
  return {
    title: book.title,
    description: `${book.title} by ${author?.name ?? "Unknown"} — ${book.price} PKR at Safha Karachi. ${book.description.slice(0, 140)}`,
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();
  return <ProductView book={book} />;
}
