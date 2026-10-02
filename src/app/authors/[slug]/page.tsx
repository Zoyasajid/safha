import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import { books } from "@/data/books";
import { readFirestoreAuthorBySlug } from "@/lib/admin/firestore-authors";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await readFirestoreAuthorBySlug(slug);
  return { title: author?.status === "active" ? author.name : "Author" };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await readFirestoreAuthorBySlug(slug);
  if (!author || author.status !== "active") notFound();
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
