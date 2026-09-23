import { NextResponse } from "next/server";
import { emptyProduct, normalizeProduct } from "@/app/api/admin/products/route";
import { guard, jsonError } from "@/lib/admin/api";
import { readDb, updateDb } from "@/lib/admin/store";
import type { AdminProduct } from "@/lib/admin/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { id } = await ctx.params;
  const db = await readDb();
  const product = db.products.find((p) => p.id === id);
  if (!product) return jsonError("Product not found.", 404);
  return NextResponse.json({
    product,
    authors: db.authors,
    categories: db.categories,
  });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { id } = await ctx.params;
  const patch = (await request.json()) as Partial<AdminProduct> & { action?: string };
  const updated = await updateDb((db) => {
    const i = db.products.findIndex((p) => p.id === id);
    if (i < 0) return null;
    const current = db.products[i];
    if (patch.action === "duplicate") {
      const now = new Date().toISOString();
      const copy = normalizeProduct({
        ...current,
        id: `p-${Date.now()}`,
        sku: `${current.sku}-COPY`,
        slug: `${current.slug}-copy-${Date.now().toString().slice(-4)}`,
        title: `${current.title} (Copy)`,
        createdAt: now,
        updatedAt: now,
        status: "draft",
      });
      db.products.unshift(copy);
      return copy;
    }
    const next = normalizeProduct({
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    });
    db.products[i] = next;
    return next;
  });
  if (!updated) return jsonError("Product not found.", 404);
  return NextResponse.json({ product: updated });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { id } = await ctx.params;
  const ok = await updateDb((db) => {
    const before = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    return db.products.length < before;
  });
  if (!ok) return jsonError("Product not found.", 404);
  return NextResponse.json({ ok: true });
}

export { emptyProduct };
