import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminCookieOptions, signAdminSession } from "@/lib/admin/auth";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

export async function POST(request: Request) {
  const email = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !hash) {
    return NextResponse.json(
      { error: "Admin login is not configured on the server." },
      { status: 503 },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const incomingEmail = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!incomingEmail || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const emailOk = incomingEmail === email.trim().toLowerCase();
  const passOk = await bcrypt.compare(password, hash);
  if (!emailOk || !passOk) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await signAdminSession({ sub: "admin", email });
  const res = NextResponse.json({ ok: true, email });
  res.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
  return res;
}
