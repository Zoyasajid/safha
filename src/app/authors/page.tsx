import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { authors } from "@/data/authors";
import { books } from "@/data/books";

export const metadata: Metadata = {
  title: "Authors",
  description: "Writers stocked at Safha — from Umera Ahmed to Jane Austen.",
};

export default function AuthorsPage() {
  return (
    <Container className="py-14">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">The names on the spine</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Authors</h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((a) => {
          const count = books.filter((b) => b.authorId === a.id).length;
          return (
            <Link
              key={a.id}
              href={`/authors/${a.slug}`}
              className="rounded-2xl border border-line bg-white/70 p-6 transition hover:-translate-y-0.5 hover:border-gold/50"
            >
              <p className="font-serif text-2xl">{a.name}</p>
              {a.nameUrdu ? (
                <p className="font-urdu text-ink-muted" dir="rtl">
                  {a.nameUrdu}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{a.bio}</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-gold">
                {count} title{count === 1 ? "" : "s"} · {a.location}
              </p>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
