"use client";

import { useMemo, useState } from "react";
import { BookGrid } from "@/components/books/book-grid";
import { Container } from "@/components/ui/container";
import { authors } from "@/data/authors";
import { categories } from "@/data/categories";
import { sortBooks, type SortValue, sortOptions } from "@/lib/books";
import type { Book, CategorySlug } from "@/types";

export function CatalogView({
  title,
  eyebrow,
  description,
  books,
  hideCategoryFilter = false,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  books: Book[];
  hideCategoryFilter?: boolean;
}) {
  const [category, setCategory] = useState<string>("all");
  const [author, setAuthor] = useState("all");
  const [language, setLanguage] = useState("all");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sort, setSort] = useState<SortValue>("featured");
  const [inStock, setInStock] = useState(false);

  const filtered = useMemo(() => {
    const list = books.filter((b) => {
      if (
        category !== "all" &&
        !b.categorySlugs.includes(category as CategorySlug)
      )
        return false;
      if (author !== "all" && b.authorId !== author) return false;
      if (language !== "all" && b.language !== language) return false;
      if (b.price > maxPrice) return false;
      if (inStock && b.stock <= 0) return false;
      return true;
    });
    return sortBooks(list, sort);
  }, [books, category, author, language, maxPrice, sort, inStock]);

  const authorIds = [...new Set(books.map((b) => b.authorId))];

  return (
    <div className="pb-20">
      <div className="border-b border-line bg-white/40">
        <Container className="py-12 sm:py-16">
          {eyebrow ? (
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-ink-muted">{description}</p>
          ) : null}
          <p className="mt-4 text-sm text-ink-muted">
            {filtered.length} titles
          </p>
        </Container>
      </div>
      <Container className="grid gap-10 pt-10 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-line bg-white/70 p-5">
          <h2 className="text-xs uppercase tracking-[0.2em] text-ink-muted">
            Filter
          </h2>
          {!hideCategoryFilter ? (
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
          <Field label="Author">
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="select "
            >
              <option value="all">All authors</option>
              {authors
                .filter((a) => authorIds.includes(a.id))
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Language">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select"
            >
              <option value="all">Urdu & English</option>
              <option value="Urdu">Urdu</option>
              <option value="English">English</option>
            </select>
          </Field>
          <Field label={`Price up to Rs. ${maxPrice.toLocaleString("en-PK")}`}>
            <input
              type="range"
              min={500}
              max={2500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C4A35A]"
            />
          </Field>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="accent-[#C4A35A]"
            />
            In stock only
          </label>
        </aside>
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">
              Showing {filtered.length} of {books.length}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              className="select max-w-xs"
              aria-label="Sort books"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <BookGrid books={filtered} />
        </div>
      </Container>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-5 block text-sm">
      <span className="mb-1.5 block text-ink">{label}</span>
      {children}
    </label>
  );
}
