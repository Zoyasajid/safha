import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { books as sourceBooks } from "@/data/books";
import { guard, jsonError, slugify } from "@/lib/admin/api";
import {
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from "@/lib/firebase-admin";
import type { AdminProduct } from "@/lib/admin/types";

function mapBookToProduct(
  book: (typeof sourceBooks)[number],
  index: number,
): AdminProduct {
  const safeYear =
    Number(book.year) > 0 ? Number(book.year) : new Date().getFullYear();
  const safeIsbn =
    book.isbn && book.isbn.trim()
      ? book.isbn.trim()
      : `B-${String(index + 1).padStart(4, "0")}-${randomUUID().slice(0, 8)}`;
  const safeSlug = slugify(book.slug || book.title) || `book-${index + 1}`;
  const regularPrice =
    book.originalPrice && book.originalPrice > book.price
      ? book.originalPrice
      : book.price;
  const salePrice =
    book.originalPrice && book.originalPrice > book.price
      ? book.price
      : undefined;
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    sku: `SF-${safeIsbn.replace(/[^a-zA-Z0-9]/g, "").slice(-6) || String(index + 1).padStart(6, "0")}`,
    slug: safeSlug,
    title: book.title,
    titleUrdu: book.titleUrdu,
    shortDescription: book.description.slice(0, 160),
    description: book.description,
    authorId: book.authorId,
    categoryIds: [...book.categorySlugs],
    language: book.language,
    bookType: book.format,
    publisher: book.publisher,
    isbn: safeIsbn,
    edition: book.edition,
    publicationDate: `${safeYear}-01-01`,
    pages: Number(book.pages) > 0 ? Number(book.pages) : 200,
    price: regularPrice,
    salePrice,
    costPrice: Math.round(regularPrice * 0.6),
    currency: "PKR",
    stock: Number(book.stock) > 0 ? Number(book.stock) : 0,
    lowStockThreshold: 5,
    allowBackorders: false,
    images: book.coverImage
      ? [{ id: randomUUID(), url: book.coverImage, alt: `${book.title} cover` }]
      : [],
    coverTone: book.coverTone,
    accent: book.accent,
    featured: Boolean(book.featured),
    bestseller: Boolean(book.bestseller),
    newArrival: Boolean(book.newArrival),
    deal: Boolean(salePrice),
    status: Number(book.stock) > 0 ? "active" : "inactive",
    seoTitle: `${book.title} | Safha`,
    seoDescription: book.description.slice(0, 160),
    seoKeywords: [book.title, book.authorId, ...book.categorySlugs].join(", "),
    weightGrams: Math.max(
      180,
      Math.round((Number(book.pages) > 0 ? Number(book.pages) : 200) * 1.8),
    ),
    lengthCm: 21,
    widthCm: 14,
    heightCm: 2.4,
    deliveryInfo:
      "Karachi next-day on orders before 2pm. Nationwide 2–5 working days.",
    reviewsEnabled: true,
    showRating: true,
    rating: Number(book.rating) || 0,
    reviewCount: Number(book.reviewCount) || 0,
    createdAt: now,
    updatedAt: now,
  };
}

export async function POST() {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  if (!isFirebaseAdminConfigured()) {
    return jsonError("Firebase Admin credentials are not configured.", 503);
  }

  try {
    const firestore = getFirebaseAdminDb();
    const collection = firestore.collection("products");
    const existingSnapshot = await collection.get();
    const existingSlugs = new Set(
      existingSnapshot.docs.map((doc) => doc.get("slug")).filter(Boolean),
    );
    const existingIsbns = new Set(
      existingSnapshot.docs.map((doc) => doc.get("isbn")).filter(Boolean),
    );
    const existingSkus = new Set(
      existingSnapshot.docs.map((doc) => doc.get("sku")).filter(Boolean),
    );
    const firestoreBooks = sourceBooks
      .map((book, index) => mapBookToProduct(book, index))
      .filter((product) => {
        if (
          existingSlugs.has(product.slug) ||
          existingIsbns.has(product.isbn)
        ) {
          return false;
        }
        existingSlugs.add(product.slug);
        existingIsbns.add(product.isbn);
        return true;
      });

    let batch = firestore.batch();
    let batchSize = 0;
    let imported = 0;

    for (const product of firestoreBooks) {
      let uniqueSku = product.sku;
      let suffix = 1;
      while (existingSkus.has(uniqueSku)) {
        uniqueSku = `${product.sku}-${suffix}`;
        suffix += 1;
      }
      product.sku = uniqueSku;
      existingSkus.add(uniqueSku);

      const ref = collection.doc();
      product.id = ref.id;
      const firestoreProduct = Object.fromEntries(
        Object.entries(product).filter(([, value]) => value !== undefined),
      );
      batch.create(ref, firestoreProduct);
      batchSize += 1;
      imported += 1;

      if (batchSize === 500) {
        await batch.commit();
        batch = firestore.batch();
        batchSize = 0;
      }
    }

    if (batchSize > 0) await batch.commit();

    return NextResponse.json(
      {
        imported,
        skipped: sourceBooks.length - imported,
        total: existingSnapshot.size + imported,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to import books to Firebase:", error);
    return jsonError("Could not import books to Firebase.", 500);
  }
}
