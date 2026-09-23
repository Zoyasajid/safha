import { NextResponse } from "next/server";
import { guard, jsonError, slugify } from "@/lib/admin/api";
import { readDb, updateDb } from "@/lib/admin/store";
import type { AdminCategory } from "@/lib/admin/types";

export async function GET() {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const db = await readDb();
  return NextResponse.json({ categories: db.categories });
}

export async function POST(request: Request) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const body = (await request.json()) as Partial<AdminCategory>;
  if (!body.name?.trim()) return jsonError("Name is required.");
  const now = new Date().toISOString();
  const category: AdminCategory = {
    id: `cat-${Date.now()}`,
    slug: body.slug?.trim() || slugify(body.name),
    name: body.name.trim(),
    nameUrdu: body.nameUrdu,
    description: body.description ?? "",
    image: body.image,
    parentId: body.parentId ?? null,
    status: body.status ?? "active",
    createdAt: now,
  };
  await updateDb((db) => db.categories.push(category));
  return NextResponse.json({ category }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const body = (await request.json()) as Partial<AdminCategory> & { id: string };
  const updated = await updateDb((db) => {
    const i = db.categories.findIndex((c) => c.id === body.id);
    if (i < 0) return null;
    db.categories[i] = { ...db.categories[i], ...body, id: db.categories[i].id };
    return db.categories[i];
  });
  if (!updated) return jsonError("Category not found.", 404);
  return NextResponse.json({ category: updated });
}

export async function DELETE(request: Request) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const { id } = (await request.json()) as { id: string };
  await updateDb((db) => {
    db.categories = db.categories.filter((c) => c.id !== id && c.parentId !== id);
  });
  return NextResponse.json({ ok: true });
}
