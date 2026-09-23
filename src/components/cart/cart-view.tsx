"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { Container } from "@/components/ui/container";
import { useStore } from "@/context/store-context";
import { formatPKR, getBookById, getAuthorName } from "@/lib/books";
import { shippingForCity } from "@/lib/books";

export function CartView() {
  const { cart, updateQty, removeFromCart, cartSubtotal } = useStore();
  const router = useRouter();
  const shipping = shippingForCity("Karachi", cartSubtotal);
  const total = cartSubtotal + shipping;

  if (!cart.length) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-4xl">Your basket is empty</h1>
        <p className="mt-3 text-ink-muted">The Clifton table is waiting.</p>
        <Link href="/categories" className="btn-primary mx-auto mt-8 w-fit">
          Continue browsing
        </Link>
      </Container>
    );
  }

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-serif text-4xl">Cart</h1>
        <ul className="mt-8 space-y-5">
          {cart.map((item) => {
            const book = getBookById(item.bookId);
            if (!book) return null;
            return (
              <li
                key={item.bookId}
                className="flex gap-4 rounded-2xl border border-line bg-white/70 p-4"
              >
                <Link href={`/books/${book.slug}`} className="w-20 shrink-0">
                  <BookCover book={book} />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link href={`/books/${book.slug}`} className="font-serif text-xl">
                    {book.title}
                  </Link>
                  <p className="text-sm text-ink-muted">{getAuthorName(book.authorId)}</p>
                  <p className="mt-2 font-medium">{formatPKR(book.price)}</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        className="px-3 py-2"
                        onClick={() => updateQty(item.bookId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-2"
                        onClick={() => updateQty(item.bookId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.bookId)}
                      className="text-ink-muted hover:text-ink"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="h-fit rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPKR(cartSubtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Karachi shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatPKR(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatPKR(total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-ink-muted">
          Free Karachi delivery on orders of Rs. 3,000+. Apply coupons at checkout.
        </p>
        <button type="button" className="btn-primary mt-6 w-full" onClick={() => router.push("/checkout")}>
          Checkout
        </button>
      </aside>
    </Container>
  );
}
