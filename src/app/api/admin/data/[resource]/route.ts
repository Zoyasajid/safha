import { NextResponse } from "next/server";
import { guard, jsonError, slugify } from "@/lib/admin/api";
import { readDb, updateDb } from "@/lib/admin/store";
import type {
  AdminAuthor,
  AdminCategory,
  AdminCoupon,
  AdminCustomer,
  AdminReview,
  StoreSettings,
} from "@/lib/admin/types";

type Resource =
  | "categories"
  | "authors"
  | "orders"
  | "customers"
  | "reviews"
  | "coupons"
  | "settings";
type Ctx = { params: Promise<{ resource: string }> };

const collections = [
  "categories",
  "authors",
  "orders",
  "customers",
  "reviews",
  "coupons",
  "settings",
];

export async function GET(_: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { resource } = await ctx.params;
  if (!collections.includes(resource))
    return jsonError("Resource not found.", 404);
  const db = await readDb();
  return NextResponse.json({ [resource]: db[resource as Resource] });
}

export async function POST(request: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { resource } = await ctx.params;
  const body = (await request.json()) as Record<string, unknown>;
  const now = new Date().toISOString();
  const created = await updateDb((db) => {
    if (resource === "categories") {
      if (typeof body.name !== "string" || !body.name.trim()) return null;
      const item: AdminCategory = {
        id: `cat-${Date.now()}`,
        slug: typeof body.slug === "string" ? body.slug : slugify(body.name),
        name: body.name.trim(),
        description: String(body.description ?? ""),
        image: typeof body.image === "string" ? body.image : undefined,
        parentId: typeof body.parentId === "string" ? body.parentId : null,
        status: body.status === "inactive" ? "inactive" : "active",
        createdAt: now,
      };
      db.categories.unshift(item);
      return item;
    }
    if (resource === "authors") {
      if (typeof body.name !== "string" || !body.name.trim()) return null;
      const item: AdminAuthor = {
        id: `author-${Date.now()}`,
        slug: slugify(body.name),
        name: body.name.trim(),
        bio: String(body.bio ?? ""),
        location: String(body.location ?? "Pakistan"),
        image: typeof body.image === "string" ? body.image : undefined,
        coverTone: "#315264",
        status: "active",
        createdAt: now,
      };
      db.authors.unshift(item);
      return item;
    }
    if (resource === "coupons") {
      if (typeof body.code !== "string" || !body.code.trim()) return null;
      const item: AdminCoupon = {
        id: `coupon-${Date.now()}`,
        code: body.code.trim().toUpperCase(),
        label: String(body.label ?? "Promotion"),
        type: body.type === "fixed" ? "fixed" : "percent",
        value: Number(body.value ?? 0),
        minOrder: Number(body.minOrder ?? 0),
        maxDiscount: Number(body.maxDiscount ?? 0) || undefined,
        startDate: String(body.startDate ?? now.slice(0, 10)),
        expiryDate: String(body.expiryDate ?? now.slice(0, 10)),
        usageLimit: Number(body.usageLimit ?? 100),
        usedCount: 0,
        active: true,
      };
      db.coupons.unshift(item);
      return item;
    }
    return null;
  });
  if (!created) return jsonError("A valid name or code is required.");
  return NextResponse.json({ item: created }, { status: 201 });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { resource } = await ctx.params;
  const body = (await request.json()) as Record<string, unknown> & {
    id?: string;
  };
  const updated = await updateDb((db) => {
    if (resource === "settings") {
      db.settings = { ...db.settings, ...body } as StoreSettings;
      return db.settings;
    }
    if (!body.id) return null;
    const list = db[resource as Exclude<Resource, "settings">] as Array<{
      id: string;
    }>;
    const index = list.findIndex((item) => item.id === body.id);
    if (index < 0) return null;
    list[index] = { ...list[index], ...body, id: body.id };
    return list[index];
  });
  if (!updated) return jsonError("Record not found.", 404);
  return NextResponse.json({ item: updated });
}

export async function DELETE(request: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { resource } = await ctx.params;
  const { id } = (await request.json()) as { id?: string };
  if (!id || resource === "settings")
    return jsonError("Record id is required.");
  const removed = await updateDb((db) => {
    const key = resource as Exclude<Resource, "settings">;
    const list = db[key] as Array<{ id: string }>;
    const before = list.length;
    (db[key] as Array<{ id: string }>) = list.filter((item) => item.id !== id);
    return before !== list.length;
  });
  if (!removed) return jsonError("Record not found.", 404);
  return NextResponse.json({ ok: true });
}
