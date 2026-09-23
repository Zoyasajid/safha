"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { BookSection } from "@/components/books/book-section";
import { RatingStars } from "@/components/books/rating-stars";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { useStore } from "@/context/store-context";
import { getReviewsForBook } from "@/data/reviews";
import { discountPercent, formatPKR, getAuthorName, relatedBooks } from "@/lib/books";
import { SITE } from "@/lib/constants";
import type { Book } from "@/types";
import Link from "next/link";
import { getAuthorById } from "@/data/authors";

export function ProductView({ book }: { book: Book }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const off = discountPercent(book);
  const author = getAuthorById(book.authorId);
  const reviews = getReviewsForBook(book.id);
  const related = useMemo(() => relatedBooks(book, 4), [book]);
  const also = useMemo(() => relatedBooks(book, 8).slice(4), [book]);
  const saved = isWishlisted(book.id);

  return (
    <div className="pb-8">
      <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <BookCover book={book} className="max-w-md mx-auto lg:mx-0" />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            {book.language} · {book.format}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">{book.title}</h1>
          {book.titleUrdu ? (
            <p className="mt-2 font-urdu text-2xl text-ink-muted" dir="rtl">
              {book.titleUrdu}
            </p>
          ) : null}
          {author ? (
            <Link href={`/authors/${author.slug}`} className="mt-3 inline-block text-sm text-gold">
              {author.name}
            </Link>
          ) : (
            <p className="mt-3 text-sm">{getAuthorName(book.authorId)}</p>
          )}
          <div className="mt-4">
            <RatingStars rating={book.rating} count={book.reviewCount} size="md" />
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-medium text-ink">{formatPKR(book.price)}</span>
            {book.originalPrice ? (
              <>
                <span className="text-lg text-ink-muted line-through">
                  {formatPKR(book.originalPrice)}
                </span>
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-ink">
                  Save {off}%
                </span>
              </>
            ) : null}
          </div>
          <p className={`mt-3 text-sm ${book.stock > 5 ? "text-emerald-800" : book.stock > 0 ? "text-amber-800" : "text-red-800"}`}>
            {book.stock > 5
              ? "In stock — ready to ship from Clifton"
              : book.stock > 0
                ? `Only ${book.stock} left`
                : "Currently unavailable"}
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-muted">{book.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-line bg-white">
              <button
                type="button"
                className="px-4 py-3"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                type="button"
                className="px-4 py-3"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(book.stock, q + 1))}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              disabled={book.stock <= 0}
              onClick={() => addToCart(book.id, qty)}
            >
              Add to cart
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              className="btn-ghost"
              disabled={book.stock <= 0}
              onClick={() => {
                addToCart(book.id, qty);
                router.push("/checkout");
              }}
            >
              Buy now
            </motion.button>
            <button
              type="button"
              onClick={() => toggleWishlist(book.id)}
              className="inline-flex items-center gap-2 text-sm"
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-gold text-gold" : ""}`} />
              Wishlist
            </button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl border border-line bg-white/70 p-5 text-sm">
            <p className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-gold" />
              {SITE.karachiDelivery}. {SITE.pakistanDelivery}.
            </p>
            <p className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-gold" />
              Cash on delivery across Pakistan. Easy returns within 7 days if the copy is unused.
            </p>
          </div>
        </Reveal>
      </Container>

      <Container className="grid gap-8 pb-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white/70 p-6">
          <h2 className="font-serif text-2xl">Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{book.description}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white/70 p-6">
          <h2 className="font-serif text-2xl">Book details</h2>
          <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-ink-muted">ISBN</dt>
            <dd>{book.isbn}</dd>
            <dt className="text-ink-muted">Publisher</dt>
            <dd>{book.publisher}</dd>
            <dt className="text-ink-muted">Language</dt>
            <dd>{book.language}</dd>
            <dt className="text-ink-muted">Pages</dt>
            <dd>{book.pages}</dd>
            <dt className="text-ink-muted">Edition</dt>
            <dd>{book.edition}</dd>
            <dt className="text-ink-muted">Year</dt>
            <dd>{book.year}</dd>
            <dt className="text-ink-muted">Format</dt>
            <dd>{book.format}</dd>
          </dl>
        </div>
      </Container>

      <Container className="pb-8">
        <div className="rounded-2xl border border-line bg-white/70 p-6">
          <h2 className="font-serif text-2xl">Reviews</h2>
          <div className="mt-6 space-y-6">
            {reviews.map((r) => (
              <article key={r.id} className="border-t border-line pt-5 first:border-0 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{r.author}</p>
                  <p className="text-xs text-ink-muted">
                    {r.city} · {r.date}
                  </p>
                </div>
                <div className="mt-1">
                  <RatingStars rating={r.rating} />
                </div>
                <h3 className="mt-2 text-sm font-medium">{r.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{r.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>

      <BookSection title="Related books" books={related} />
      <BookSection eyebrow="For you" title="You may also like" books={also.length ? also : related} />
    </div>
  );
}
