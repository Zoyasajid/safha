import { NextResponse } from "next/server";
import { emptyProduct, normalizeProduct } from "@/app/api/admin/products/route";
import { guard, jsonError, slugify } from "@/lib/admin/api";
import { readDb, updateDb } from "@/lib/admin/store";
import type { AdminProduct } from "@/lib/admin/types";

export type BookApiPayload = Partial<AdminProduct> & {
  id?: string;
  categorySlugs?: string[];
  format?: string;
  coverImage?: string;
  year?: number;
  titleUrdu?: string;
};

function toBook(product: AdminProduct) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    titleUrdu: product.titleUrdu,
    authorId: product.authorId,
    price: product.salePrice ?? product.price,
    originalPrice: product.salePrice ? product.price : undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: product.stock,
    language: product.language,
    categorySlugs: product.categoryIds,
    isbn: product.isbn,
    publisher: product.publisher,
    pages: product.pages,
    edition: product.edition,
    year: Number(
      product.publicationDate?.slice(0, 4) ?? new Date().getFullYear(),
    ),
    format:
      (product.bookType as "Paperback" | "Hardcover" | "2-Volume Set") ||
      "Paperback",
    description: product.description || product.shortDescription,
    featured: product.featured,
    bestseller: product.bestseller,
    newArrival: product.newArrival,
    coverImage: product.images?.[0]?.url ?? "",
    coverTone: product.coverTone,
    accent: product.accent,
  };
}

function normalizeBookPayload(body: BookApiPayload): Partial<AdminProduct> {
  const year = Number(body.year ?? new Date().getFullYear());
  const categoryIds = Array.isArray(body.categoryIds)
    ? body.categoryIds
    : Array.isArray(body.categorySlugs)
      ? body.categorySlugs
      : [];
  const coverImage = typeof body.coverImage === "string" ? body.coverImage : "";
  const images =
    Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : coverImage
        ? [
            {
              id: `img-${Date.now()}`,
              url: coverImage,
              alt: `${body.title ?? "Book"} cover`,
            },
          ]
        : [];

  return {
    ...body,
    title: typeof body.title === "string" ? body.title : "",
    slug:
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug
        : slugify(body.title ?? ""),
    shortDescription:
      typeof body.shortDescription === "string"
        ? body.shortDescription
        : typeof body.description === "string"
          ? body.description
          : "",
    description: typeof body.description === "string" ? body.description : "",
    authorId: typeof body.authorId === "string" ? body.authorId : "",
    categoryIds:
      categoryIds.length > 0 ? categoryIds.map((value) => String(value)) : [],
    language:
      body.language === "English" || body.language === "Urdu"
        ? body.language
        : "English",
    bookType: body.bookType ?? body.format ?? "Paperback",
    publisher: typeof body.publisher === "string" ? body.publisher : "",
    isbn: typeof body.isbn === "string" ? body.isbn : "",
    edition: typeof body.edition === "string" ? body.edition : "Paperback",
    publicationDate:
      typeof body.publicationDate === "string"
        ? body.publicationDate
        : `${year}-01-01`,
    pages: Number(body.pages ?? 200),
    price: Number(body.price ?? 0),
    salePrice:
      typeof body.salePrice === "number" && body.salePrice > 0
        ? body.salePrice
        : undefined,
    stock: Number(body.stock ?? 0),
    lowStockThreshold: Number(body.lowStockThreshold ?? 5),
    allowBackorders: Boolean(body.allowBackorders),
    images,
    coverTone: typeof body.coverTone === "string" ? body.coverTone : "#2C2416",
    accent: typeof body.accent === "string" ? body.accent : "#C4A35A",
    featured: Boolean(body.featured),
    bestseller: Boolean(body.bestseller),
    newArrival: Boolean(body.newArrival),
    deal: Boolean(body.deal || body.salePrice),
    status:
      body.status === "inactive" || body.status === "draft"
        ? body.status
        : "active",
    seoTitle: typeof body.seoTitle === "string" ? body.seoTitle : "",
    seoDescription:
      typeof body.seoDescription === "string" ? body.seoDescription : "",
    seoKeywords: typeof body.seoKeywords === "string" ? body.seoKeywords : "",
    weightGrams: Number(body.weightGrams ?? 300),
    lengthCm: Number(body.lengthCm ?? 21),
    widthCm: Number(body.widthCm ?? 14),
    heightCm: Number(body.heightCm ?? 2),
    deliveryInfo:
      typeof body.deliveryInfo === "string"
        ? body.deliveryInfo
        : "Karachi next-day on orders before 2pm. Nationwide 2–5 working days.",
    reviewsEnabled: body.reviewsEnabled !== false,
    showRating: body.showRating !== false,
    rating: Number(body.rating ?? 0),
    reviewCount: Number(body.reviewCount ?? 0),
  };
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ books: db.products.map(toBook) });
}

export async function POST(request: Request) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const body = (await request.json()) as BookApiPayload;
  if (!body.title?.trim()) return jsonError("Book title is required.");

  const now = new Date().toISOString();
  const id = body.id ?? `p-${Date.now()}`;
  const product = normalizeProduct({
    ...emptyProduct(id, now),
    ...normalizeBookPayload(body),
    id,
    slug: (body.slug ?? slugify(body.title)).trim() || slugify(body.title),
    createdAt: now,
    updatedAt: now,
  });

  const created = await updateDb((db) => {
    if (db.products.some((item) => item.slug === product.slug)) {
      product.slug = `${product.slug}-${Date.now().toString().slice(-4)}`;
    }
    db.products.unshift(product);
    return product;
  });

  return NextResponse.json({ book: toBook(created) }, { status: 201 });
}
