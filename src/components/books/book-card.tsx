"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { RatingStars } from "@/components/books/rating-stars";
import { useStore } from "@/context/store-context";
import { discountPercent, formatPKR, getAuthorName } from "@/lib/books";
import type { Book } from "@/types";
import { staggerItem } from "@/components/ui/reveal";

export function BookCard({ book }: { book: Book }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(book.id);
  const off = discountPercent(book);

  return (
    <motion.article
      variants={staggerItem}
      className="group relative flex h-full flex-col"
    >
      <div className="relative">
        <Link href={`/books/${book.slug}`} className="block">
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="overflow-hidden rounded-md">
              <div className="transition duration-500 group-hover:scale-[1.03]">
                <BookCover book={book} />
              </div>
            </div>
          </motion.div>
        </Link>
        {off > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold tracking-wide text-ink">
            {off}% off
          </span>
        ) : book.newArrival ? (
          <span className="absolute left-3 top-3 rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold tracking-wide text-ink">
            New
          </span>
        ) : null}
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(book.id)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/95 text-ink shadow-sm transition hover:scale-105"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-gold text-gold" : ""}`} />
        </button>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          {getAuthorName(book.authorId)}
        </p>
        <Link
          href={`/books/${book.slug}`}
          className="mt-1 font-serif text-lg leading-snug text-ink hover:text-gold"
        >
          {book.title}
        </Link>
        <div className="mt-2">
          <RatingStars rating={book.rating} count={book.reviewCount} />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-medium text-ink">{formatPKR(book.price)}</span>
          {book.originalPrice ? (
            <span className="text-sm text-ink-muted line-through">
              {formatPKR(book.originalPrice)}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => addToCart(book.id)}
          disabled={book.stock <= 0}
          className="btn-primary mt-4 w-full"
        >
          <ShoppingBag className="h-4 w-4" />
          {book.stock <= 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </motion.article>
  );
}
