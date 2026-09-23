import { NextResponse } from "next/server";
import { guard, jsonError, slugify } from "@/lib/admin/api";
import { readDb, updateDb } from "@/lib/admin/store";
import type { AdminProduct } from "@/lib/admin/types";

export async function GET() {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const db = await readDb();
  return NextResponse.json({ products: db.products, authors: db.authors, categories: db.categories });
}

export async function POST(request: Request) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const body = (await request.json()) as Partial<AdminProduct>;
  if (!body.title?.trim()) return jsonError("Title is required.");
  const now = new Date().toISOString();
  const id = `p-${Date.now()}`;
  const product: AdminProduct = normalizeProduct({
    ...emptyProduct(id, now),
    ...body,
    id,
    slug: body.slug?.trim() || slugify(body.title),
    createdAt: now,
    updatedAt: now,
  });
  await updateDb((db) => {
    if (db.products.some((p) => p.slug === product.slug)) {
      product.slug = `${product.slug}-${Date.now().toString().slice(-4)}`;
    }
    db.products.unshift(product);
  });
  return NextResponse.json({ product }, { status: 201 });
}

export function emptyProduct(id: string, now: string): AdminProduct {
  return {
    id,
    sku: `SF-${Date.now().toString().slice(-6)}`,
    slug: "",
    title: "",
    shortDescription: "",
    description: "",
    authorId: "",
    categoryIds: [],
    language: "English",
    bookType: "Paperback",
    publisher: "",
    isbn: "",
    edition: "Paperback",
    publicationDate: now.slice(0, 10),
    pages: 200,
    price: 0,
    costPrice: 0,
    currency: "PKR",
    stock: 0,
    lowStockThreshold: 5,
    allowBackorders: false,
    images: [],
    coverTone: "#2C2416",
    accent: "#C4A35A",
    featured: false,
    bestseller: false,
    newArrival: false,
    deal: false,
    status: "active",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    weightGrams: 300,
    lengthCm: 21,
    widthCm: 14,
    heightCm: 2,
    deliveryInfo: "Karachi next-day on orders before 2pm. Nationwide 2–5 working days.",
    reviewsEnabled: true,
    showRating: true,
    rating: 0,
    reviewCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeProduct(p: AdminProduct): AdminProduct {
  const sale = p.salePrice && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : undefined;
  return {
    ...p,
    title: p.title.trim(),
    slug: p.slug.trim() || slugify(p.title),
    deal: Boolean(sale),
    salePrice: sale,
    stock: Math.max(0, Number(p.stock) || 0),
    price: Math.max(0, Number(p.price) || 0),
  };
}
