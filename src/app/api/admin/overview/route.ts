import { NextResponse } from "next/server";
import { guard } from "@/lib/admin/api";
import { readDb } from "@/lib/admin/store";

export async function GET() {
  const auth = await guard();
  if (!auth.ok) return auth.res;
  return NextResponse.json(await readDb());
}
