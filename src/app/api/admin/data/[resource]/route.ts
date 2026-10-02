import { NextResponse } from "next/server";
import { guard, jsonError, slugify } from "@/lib/admin/api";
import { readDb, updateDb } from "@/lib/admin/store";
import {
  createFirestoreAuthor,
  deleteFirestoreAuthor,
  readFirestoreAuthors,
  updateFirestoreAuthor,
} from "@/lib/admin/firestore-authors";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import {
  isOrderStatus,
  readFirestoreOrders,
  updateFirestoreOrderStatus,
} from "@/lib/admin/firestore-orders";
import type {
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
  if (resource === "orders") {
    return NextResponse.json({ orders: await readFirestoreOrders() });
  }
  if (resource === "authors") {
    return NextResponse.json({ authors: await readFirestoreAuthors() });
  }
  const db = await readDb();
  return NextResponse.json({ [resource]: db[resource as Resource] });
}

export async function POST(request: Request, ctx: Ctx) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { resource } = await ctx.params;
  const body = (await request.json()) as Record<string, unknown>;
  const now = new Date().toISOString();
  if (resource === "authors") {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return jsonError("A valid author name is required.");
    }
    if (!isFirebaseAdminConfigured()) {
      return jsonError("Firebase Admin credentials are not configured.", 503);
    }
    try {
      const author = await createFirestoreAuthor({
        slug:
          typeof body.slug === "string" && body.slug.trim()
            ? slugify(body.slug)
            : slugify(body.name),
        name: body.name.trim(),
        nameUrdu:
          typeof body.nameUrdu === "string" ? body.nameUrdu.trim() : undefined,
        bio: String(body.bio ?? ""),
        location: String(body.location ?? "Pakistan"),
        image: typeof body.image === "string" ? body.image : undefined,
        coverTone:
          typeof body.coverTone === "string" ? body.coverTone : "#315264",
        status: body.status === "inactive" ? "inactive" : "active",
        createdAt: now,
      });
      return NextResponse.json({ item: author }, { status: 201 });
    } catch {
      return jsonError("Unable to save author to Firebase.", 500);
    }
  }
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
  if (resource === "orders") {
    if (!body.id || !isOrderStatus(body.status)) {
      return jsonError("A valid order id and status are required.");
    }
    try {
      const item = await updateFirestoreOrderStatus(body.id, body.status);
      if (!item) return jsonError("Order not found.", 404);
      return NextResponse.json({ item });
    } catch {
      return jsonError("Unable to update order status.", 500);
    }
  }
  if (resource === "authors") {
    if (!body.id || typeof body.name !== "string" || !body.name.trim()) {
      return jsonError("A valid author id and name are required.");
    }
    if (!isFirebaseAdminConfigured()) {
      return jsonError("Firebase Admin credentials are not configured.", 503);
    }
    try {
      const updated = await updateFirestoreAuthor(body.id, {
        slug:
          typeof body.slug === "string" && body.slug.trim()
            ? slugify(body.slug)
            : slugify(body.name),
        name: body.name.trim(),
        nameUrdu:
          typeof body.nameUrdu === "string" ? body.nameUrdu.trim() : undefined,
        bio: String(body.bio ?? ""),
        location: String(body.location ?? ""),
        image: typeof body.image === "string" ? body.image : undefined,
        coverTone:
          typeof body.coverTone === "string" ? body.coverTone : "#315264",
        status: body.status === "inactive" ? "inactive" : "active",
      });
      if (!updated) return jsonError("Author not found.", 404);
      return NextResponse.json({ item: updated });
    } catch {
      return jsonError("Unable to update author in Firebase.", 500);
    }
  }
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
  if (resource === "authors") {
    if (!isFirebaseAdminConfigured()) {
      return jsonError("Firebase Admin credentials are not configured.", 503);
    }
    try {
      const removed = await deleteFirestoreAuthor(id);
      if (!removed) return jsonError("Author not found.", 404);
      return NextResponse.json({ ok: true });
    } catch {
      return jsonError("Unable to delete author from Firebase.", 500);
    }
  }
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
