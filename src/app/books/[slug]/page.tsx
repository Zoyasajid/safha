import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/books/product-view";
import { books } from "@/data/books";
import { getAuthorName, getBookBySlug } from "@/lib/books";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return { title: "Book" };
  return {
    title: book.title,
    description: `${book.title} by ${getAuthorName(book.authorId)} — ${book.price} PKR at Safha Karachi. ${book.description.slice(0, 140)}`,
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();
  return <ProductView book={book} />;
}
