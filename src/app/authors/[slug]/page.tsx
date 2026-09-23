import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import { authors } from "@/data/authors";
import { books } from "@/data/books";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  return { title: author?.name ?? "Author" };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  if (!author) notFound();
  const list = books.filter((b) => b.authorId === author.id);
  return (
    <CatalogView
      eyebrow={author.location}
      title={author.name}
      description={author.bio}
      books={list}
    />
  );
}
