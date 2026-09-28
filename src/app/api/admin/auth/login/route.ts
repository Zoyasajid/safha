import { NextResponse } from "next/server";
import { adminCookieOptions, signAdminSession } from "@/lib/admin/auth";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

export async function POST(request: Request) {
  const email = "admin@example.com";
  const password = "123456";

  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const incomingEmail = (body.email ?? "").trim().toLowerCase();
  const incomingPassword = body.password ?? "";

  if (!incomingEmail || !incomingPassword) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const emailOk = incomingEmail === email.toLowerCase();
  const passwordOk = incomingPassword === password;

  if (!emailOk || !passwordOk) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 },
    );
  }

  const token = await signAdminSession({
    sub: "admin",
    email,
  });

  const res = NextResponse.json({
    ok: true,
    email,
  });

  res.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());

  return res;
}
