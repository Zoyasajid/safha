import { NextResponse } from "next/server";
import { guard } from "@/lib/admin/api";
import { readDb } from "@/lib/admin/store";
import { readFirestoreOrders } from "@/lib/admin/firestore-orders";

export async function GET() {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  const db = await readDb();
  const orders = await readFirestoreOrders();
  return NextResponse.json({ ...db, orders });
}
