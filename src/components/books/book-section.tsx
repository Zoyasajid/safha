"use client";

import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BookGrid } from "@/components/books/book-grid";
import type { Book } from "@/types";

export function BookSection({
  eyebrow,
  title,
  description,
  href,
  books,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  books: Book[];
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
          />
        </Reveal>
        <BookGrid books={books} />
        {href ? (
          <div className="mt-8 text-center sm:hidden">
            <Link href={href} className="text-sm font-medium text-ink underline decoration-gold underline-offset-4">
              View all
            </Link>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
