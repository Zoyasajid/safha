import { authors } from "@/data/authors";
import { books, coupons } from "@/data/books";
import type { Book, CategorySlug, Coupon } from "@/types";

export function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export function discountPercent(book: Book) {
  if (!book.originalPrice || book.originalPrice <= book.price) return 0;
  return Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
}

export function getBookBySlug(slug: string) {
  return books.find((b) => b.slug === slug);
}

export function getBookById(id: string) {
  return books.find((b) => b.id === id);
}

export function getAuthorName(authorId: string) {
  return authors.find((a) => a.id === authorId)?.name ?? "Unknown";
}

export function booksByCategory(slug: CategorySlug) {
  return books.filter((b) => b.categorySlugs.includes(slug));
}

export function relatedBooks(book: Book, limit = 8) {
  return books
    .filter((b) => b.id !== book.id)
    .map((b) => ({
      b,
      score:
        b.authorId === book.authorId
          ? 5
          : b.categorySlugs.filter((c) => book.categorySlugs.includes(c)).length,
    }))
    .sort((a, c) => c.score - a.score)
    .slice(0, limit)
    .map((x) => x.b);
}

export function searchBooks(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return books.filter((b) => {
    const author = getAuthorName(b.authorId).toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      (b.titleUrdu ?? "").includes(query) ||
      author.includes(q) ||
      b.isbn.includes(q) ||
      b.categorySlugs.some((c) => c.includes(q))
    );
  });
}

export function applyCoupon(
  code: string,
  subtotal: number,
): { coupon: Coupon; discount: number } | { error: string } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) return { error: "This code isn’t valid." };
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      error: `Add ${formatPKR(coupon.minSubtotal - subtotal)} more to use ${coupon.code}.`,
    };
  }
  const discount =
    coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  return { coupon, discount: Math.min(discount, subtotal) };
}

export function shippingForCity(city: string, subtotal: number) {
  if (subtotal >= 3000) return 0;
  if (city.toLowerCase() === "karachi") return 150;
  return 350;
}

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
  { value: "title", label: "Title A–Z" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export function sortBooks(list: Book[], sort: SortValue) {
  const copy = [...list];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => b.year - a.year);
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  }
}
