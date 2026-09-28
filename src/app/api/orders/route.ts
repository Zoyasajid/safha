import { NextResponse } from "next/server";
import { applyCoupon, getBookById, shippingForCity } from "@/lib/books";
import {
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from "@/lib/firebase-admin";
import { CITIES } from "@/lib/constants";
import type { OnlinePaymentMethod, PaymentMethod } from "@/types";

export const runtime = "nodejs";

const onlineMethods: OnlinePaymentMethod[] = ["jazzcash", "easypaisa", "card"];

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Order storage is not configured. Please contact the shop." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const address = body.address as Record<string, unknown> | undefined;
    const customerEmail =
      typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
    const paymentMethod = body.paymentMethod;
    const onlinePaymentMethod = body.onlinePaymentMethod;

    if (
      !address ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) ||
      (paymentMethod !== "cod" && paymentMethod !== "online") ||
      (paymentMethod === "online" &&
        !onlineMethods.includes(onlinePaymentMethod as OnlinePaymentMethod))
    ) {
      return NextResponse.json(
        { error: "Please check your contact and payment details." },
        { status: 400 },
      );
    }

    const fullName =
      typeof address.fullName === "string" ? address.fullName.trim() : "";
    const phone = typeof address.phone === "string" ? address.phone.trim() : "";
    const line1 = typeof address.line1 === "string" ? address.line1.trim() : "";
    const city = typeof address.city === "string" ? address.city : "";
    const postalCode =
      typeof address.postalCode === "string" ? address.postalCode.trim() : "";
    const emergencyPhone =
      typeof address.emergencyPhone === "string"
        ? address.emergencyPhone.trim()
        : "";

    if (
      fullName.length < 2 ||
      !/^03\d{9}$/.test(phone) ||
      (emergencyPhone && !/^03\d{9}$/.test(emergencyPhone)) ||
      line1.length < 5 ||
      !/^\d{5}$/.test(postalCode) ||
      !CITIES.includes(city)
    ) {
      return NextResponse.json(
        { error: "Please check your delivery address." },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 },
      );
    }

    const items = [];
    for (const item of body.items) {
      if (!item || typeof item !== "object") {
        return NextResponse.json(
          { error: "Invalid cart item." },
          { status: 400 },
        );
      }
      const { bookId, quantity } = item as {
        bookId?: unknown;
        quantity?: unknown;
      };
      const book = typeof bookId === "string" ? getBookById(bookId) : undefined;
      if (
        !book ||
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > book.stock
      ) {
        return NextResponse.json(
          { error: "A book in your cart is unavailable in that quantity." },
          { status: 400 },
        );
      }
      items.push({
        bookId: book.id,
        bookName: book.title,
        quantity,
        unitPrice: book.price,
        amount: book.price * quantity,
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const shipping = shippingForCity(city, subtotal);
    let discount = 0;
    let coupon: string | undefined;
    if (typeof body.couponCode === "string" && body.couponCode.trim()) {
      const result = applyCoupon(body.couponCode, subtotal);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      discount = result.discount;
      coupon = result.coupon.code;
    }

    const db = getFirebaseAdminDb();
    const orderRef = db.collection("orders").doc();
    const id = `SF-${orderRef.id.slice(0, 8).toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const cleanAddress = {
      fullName,
      phone,
      ...(emergencyPhone ? { emergencyPhone } : {}),
      line1,
      area: typeof address.area === "string" ? address.area : "",
      city,
      province: typeof address.province === "string" ? address.province : "",
      postalCode,
    };
    const order = {
      id,
      createdAt,
      items,
      subtotal,
      shipping,
      discount,
      total: Math.max(0, subtotal + shipping - discount),
      ...(coupon ? { coupon } : {}),
      paymentMethod: paymentMethod as PaymentMethod,
      ...(paymentMethod === "online"
        ? { onlinePaymentMethod: onlinePaymentMethod as OnlinePaymentMethod }
        : {}),
      paymentStatus: paymentMethod === "online" ? "pending" : "unpaid",
      status: "Processing",
      customer: { name: fullName, email: customerEmail, ...cleanAddress },
    };

    await orderRef.set(order);

    return NextResponse.json({
      order: {
        id,
        createdAt,
        subtotal,
        shipping,
        discount,
        total: order.total,
        coupon,
        paymentMethod: order.paymentMethod,
        onlinePaymentMethod: order.onlinePaymentMethod,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to save your order. Please try again." },
      { status: 500 },
    );
  }
}
