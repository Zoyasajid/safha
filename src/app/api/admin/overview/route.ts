import { NextResponse } from "next/server";
import { guard } from "@/lib/admin/api";
import { readDb } from "@/lib/admin/store";
import { readFirestoreAuthors } from "@/lib/admin/firestore-authors";
import { readFirestoreOrders } from "@/lib/admin/firestore-orders";

export async function GET() {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const [db, authors, orders] = await Promise.all([
    readDb(),
    readFirestoreAuthors(),
    readFirestoreOrders(),
  ]);
  return NextResponse.json({ ...db, authors, orders });
}
