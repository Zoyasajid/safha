import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import { categories } from "@/data/categories";
import { booksByCategory } from "@/lib/books";
import type { CategorySlug } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  return (
    <CatalogView
      eyebrow="Category"
      title={cat.name}
      description={cat.description}
      books={booksByCategory(slug as CategorySlug)}
      hideCategoryFilter
    />
  );
}
