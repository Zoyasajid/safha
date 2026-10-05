import { NextResponse } from "next/server";
import { normalizeProduct } from "@/app/api/admin/products/route";
import { guard, jsonError } from "@/lib/admin/api";
import { readDb, updateDb } from "@/lib/admin/store";
import type { AdminProduct } from "@/lib/admin/types";

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

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const db = await readDb();
  const product = db.products.find((item) => item.id === id);
  if (!product) return jsonError("Book not found.", 404);
  return NextResponse.json({ book: toBook(product) });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { id } = await ctx.params;
  const body = (await request.json()) as Partial<AdminProduct> & {
    categorySlugs?: string[];
    format?: string;
    coverImage?: string;
    year?: number;
  };

  const updated = await updateDb((db) => {
    const index = db.products.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const current = db.products[index];
    const next = normalizeProduct({
      ...current,
      ...body,
      categoryIds:
        Array.isArray(body.categoryIds) && body.categoryIds.length > 0
          ? body.categoryIds
          : Array.isArray(body.categorySlugs)
            ? body.categorySlugs
            : current.categoryIds,
      bookType: body.bookType ?? body.format ?? current.bookType,
      shortDescription:
        typeof body.shortDescription === "string"
          ? body.shortDescription
          : (body.description ?? current.shortDescription),
      description:
        typeof body.description === "string"
          ? body.description
          : current.description,
      publicationDate:
        typeof body.publicationDate === "string"
          ? body.publicationDate
          : body.year
            ? `${body.year}-01-01`
            : current.publicationDate,
      images:
        Array.isArray(body.images) && body.images.length > 0
          ? body.images
          : typeof body.coverImage === "string" && body.coverImage
            ? [
                {
                  id: `img-${Date.now()}`,
                  url: body.coverImage,
                  alt: `${current.title} cover`,
                },
              ]
            : current.images,
      price: Number(body.price ?? current.price),
      salePrice:
        typeof body.salePrice === "number" && body.salePrice > 0
          ? body.salePrice
          : body.salePrice === 0
            ? undefined
            : current.salePrice,
      stock: Number(body.stock ?? current.stock),
      updatedAt: new Date().toISOString(),
    });

    db.products[index] = next;
    return next;
  });

  if (!updated) return jsonError("Book not found.", 404);
  return NextResponse.json({ book: toBook(updated) });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { id } = await ctx.params;
  const removed = await updateDb((db) => {
    const before = db.products.length;
    db.products = db.products.filter((item) => item.id !== id);
    return db.products.length < before;
  });

  if (!removed) return jsonError("Book not found.", 404);
  return NextResponse.json({ ok: true });
}
