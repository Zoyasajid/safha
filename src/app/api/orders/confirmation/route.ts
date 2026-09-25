import { NextResponse } from "next/server";
import { Resend } from "resend";
import { formatPKR } from "@/lib/books";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      customerEmail?: unknown;
      customerName?: unknown;
      orderId?: unknown;
      total?: unknown;
      paymentMethod?: unknown;
    };
    const customerEmail =
      typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
    const customerName =
      typeof body.customerName === "string"
        ? body.customerName.trim()
        : "Reader";
    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const total = typeof body.total === "number" ? body.total : 0;
    const paymentMethod =
      body.paymentMethod === "online" ? "Online payment" : "Cash on Delivery";

    if (!orderId || !customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
      return NextResponse.json(
        { error: "A valid customer email is required." },
        { status: 400 },
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [customerEmail],
      subject: `Safha order confirmed: ${orderId}`,
      text: `Assalam o Alaikum ${customerName},

Your Safha order ${orderId} has been received successfully.

Total: ${formatPKR(total)}
Payment method: ${paymentMethod}

Our team will contact you on WhatsApp with the next steps. Thank you for shopping at Safha.`,
    });

    if (error) {
      return NextResponse.json(
        { error: "Unable to send order confirmation email." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to send order confirmation email." },
      { status: 500 },
    );
  }
}
