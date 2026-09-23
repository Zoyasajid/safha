import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/api";
import { updateDb } from "@/lib/admin/store";
import type { AdminProduct } from "@/lib/admin/types";

export async function POST(request: Request) {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const body = (await request.json()) as {
    ids?: string[];
    action?: string;
    stock?: number;
  };
  const ids = body.ids ?? [];
  if (!ids.length) return jsonError("Select at least one product.");
  await updateDb((db) => {
    db.products = db.products.map((p) => {
      if (!ids.includes(p.id)) return p;
      const now = new Date().toISOString();
      if (body.action === "delete") return null;
      if (body.action === "activate") return { ...p, status: "active" as const, updatedAt: now };
      if (body.action === "deactivate") return { ...p, status: "inactive" as const, updatedAt: now };
      if (body.action === "feature") return { ...p, featured: true, updatedAt: now };
      if (body.action === "unfeature") return { ...p, featured: false, updatedAt: now };
      if (body.action === "set-stock" && typeof body.stock === "number") {
        return { ...p, stock: Math.max(0, body.stock), updatedAt: now };
      }
      return p;
    }).filter(Boolean) as AdminProduct[];
  });
  return NextResponse.json({ ok: true });
}
