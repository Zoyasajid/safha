"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { useStore } from "@/context/store-context";
import {
  applyCoupon,
  formatPKR,
  getBookById,
  shippingForCity,
} from "@/lib/books";
import { CITIES, SITE } from "@/lib/constants";
import type { Address, OnlinePaymentMethod, PaymentMethod } from "@/types";

export function CheckoutView() {
  const { cart, cartSubtotal, user, placeOrder } = useStore();
  const router = useRouter();
  const [city, setCity] = useState("Karachi");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [line1, setLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [onlinePayment, setOnlinePayment] =
    useState<OnlinePaymentMethod>("jazzcash");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{
    discount: number;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = shippingForCity(city, cartSubtotal);
  const discount = applied?.discount ?? 0;
  const total = Math.max(0, cartSubtotal + shipping - discount);

  const items = useMemo(
    () =>
      cart
        .map((i) => {
          const book = getBookById(i.bookId);
          return book ? { ...i, book } : null;
        })
        .filter(Boolean),
    [cart],
  );

  if (!cart.length) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-4xl">Nothing to check out</h1>
        <button
          type="button"
          className="btn-primary mx-auto mt-8"
          onClick={() => router.push("/")}
        >
          Return home
        </button>
      </Container>
    );
  }

  function updateField(
    field: string,
    setValue: (value: string) => void,
    value: string,
  ) {
    setValue(value);
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function onApplyCoupon() {
    const result = applyCoupon(code, cartSubtotal);
    if ("error" in result) {
      setApplied(null);
      setCouponError(result.error);
      return;
    }
    setCouponError("");
    setApplied({ discount: result.discount, label: result.coupon.code });
  }

  async function onPlace(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!/^[A-Za-z ]+$/.test(fullName.trim()) || fullName.trim().length < 2) {
      nextErrors.fullName = "Enter your name using alphabets only.";
    }
    if (!/^03\d{9}$/.test(phone)) {
      nextErrors.phone = "Enter an 11-digit phone number.";
    }
    if (emergencyPhone && !/^03\d{9}$/.test(emergencyPhone)) {
      nextErrors.emergencyPhone = "Enter an 11-digit phone number.";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (line1.trim().length < 5) {
      nextErrors.line1 = "Enter your complete address.";
    }
    if (!/^\d{5}$/.test(postalCode)) {
      nextErrors.postalCode = "Enter a 5-digit postal code.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const address: Address = {
      id: `addr-${Date.now()}`,
      label: "Checkout",
      fullName,
      phone,
      ...(emergencyPhone ? { emergencyPhone } : {}),
      line1,
      area: "",
      city,
      province: city === "Karachi" ? "Sindh" : "Pakistan",
      postalCode,
      isDefault: false,
    };
    const order = {
      id: `SF-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal: cartSubtotal,
      shipping,
      discount,
      total,
      coupon: applied?.label,
      paymentMethod: payment,
      ...(payment === "online" ? { onlinePaymentMethod: onlinePayment } : {}),
      customerEmail: email,
      status: "Processing" as const,
      address,
    };
    placeOrder(order);
    await fetch("/api/orders/confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: email,
        customerName: fullName,
        orderId: order.id,
        total: order.total,
        paymentMethod: order.paymentMethod,
      }),
    }).catch(() => undefined);
    router.push(`/account/orders/${order.id}`);
  }

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
      <form onSubmit={onPlace} noValidate className="space-y-8">
        <div>
          <h1 className="font-serif text-4xl">Checkout</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Ships from Shahrah-e-Faisal, Karachi. {SITE.karachiDelivery}
          </p>
        </div>
        <fieldset className="rounded-2xl border border-line bg-white/70 p-6">
          <legend className="font-serif text-2xl">Delivery address</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              value={fullName}
              onChange={(value) => updateField("fullName", setFullName, value)}
              required
              minLength={2}
              pattern="[A-Za-z ]+"
              title="Name can contain alphabets and spaces only"
              error={errors.fullName}
            />
            <Input
              label="Phone"
              value={phone}
              onChange={(value) => updateField("phone", setPhone, value)}
              required
              pattern="03\d{9}"
              title="Enter an 11-digit Pakistani mobile number, for example 03001234567"
              error={errors.phone}
            />
            <Input
              label="Emergency phone (optional)"
              value={emergencyPhone}
              onChange={(value) =>
                updateField("emergencyPhone", setEmergencyPhone, value)
              }
              pattern="03\d{9}"
              title="Enter an 11-digit Pakistani mobile number, for example 03001234567"
              error={errors.emergencyPhone}
            />
            <Input
              label="Email for order confirmation"
              value={email}
              onChange={(value) => updateField("email", setEmail, value)}
              required
              type="email"
              error={errors.email}
            />
            <Input
              label="Full address"
              value={line1}
              onChange={(value) => updateField("line1", setLine1, value)}
              required
              minLength={5}
              className="sm:col-span-2"
              error={errors.line1}
            />
            <label className="text-sm">
              <span className="mb-1.5 block">City</span>
              <select
                className="select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <Input
              label="Postal code"
              value={postalCode}
              onChange={(value) =>
                updateField("postalCode", setPostalCode, value)
              }
              required
              pattern="\d{5}"
              title="Enter a 5-digit postal code"
              error={errors.postalCode}
            />
          </div>
        </fieldset>
        <fieldset className="rounded-2xl border border-line bg-white/70 p-6">
          <legend className="font-serif text-2xl">Payment</legend>
          <label className="mt-4 flex items-start gap-3 rounded-xl border border-line p-4">
            <input
              type="radio"
              name="pay"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
              className="mt-1 accent-[#C4A35A]"
            />
            <span>
              <span className="block font-medium">Cash on Delivery</span>
              <span className="text-sm text-ink-muted">
                Pay in PKR when the parcel arrives. Available nationwide.
              </span>
            </span>
          </label>
          <label className="mt-3 flex items-start gap-3 rounded-xl border border-line p-4">
            <input
              type="radio"
              name="pay"
              checked={payment === "online"}
              onChange={() => setPayment("online")}
              className="mt-1 accent-[#C4A35A]"
            />
            <span>
              <span className="block font-medium">Online payment</span>
              <span className="text-sm text-ink-muted">
                JazzCash, EasyPaisa, Visa, and Mastercard. (Demo checkout — no
                charge is taken.)
              </span>
            </span>
          </label>
          {payment === "online" ? (
            <div className="mt-4 rounded-xl border border-gold/50 bg-cream p-4">
              <label className="text-sm">
                <span className="mb-1.5 block font-medium">
                  Choose online payment option
                </span>
                <select
                  className="select"
                  value={onlinePayment}
                  onChange={(e) =>
                    setOnlinePayment(e.target.value as OnlinePaymentMethod)
                  }
                >
                  <option value="jazzcash">JazzCash</option>
                  <option value="easypaisa">EasyPaisa</option>
                  <option value="card">Visa / Mastercard</option>
                </select>
              </label>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                Place your order first. Our team will message you on WhatsApp
                with payment details and confirm your payment.
              </p>
            </div>
          ) : null}
        </fieldset>
        <button type="submit" className="btn-primary">
          Place order · {formatPKR(total)}
        </button>
      </form>
      <aside className="h-fit rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl">Summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) =>
            i ? (
              <li key={i.bookId} className="flex justify-between gap-3">
                <span>
                  {i.book.title} × {i.quantity}
                </span>
                <span>{formatPKR(i.book.price * i.quantity)}</span>
              </li>
            ) : null,
          )}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon code"
            className="select"
          />
          <button
            type="button"
            className="btn-ghost !px-4"
            onClick={onApplyCoupon}
          >
            Apply
          </button>
        </div>
        {/* <p className="mt-2 text-xs text-ink-muted">
          Try SAFHA10, KARACHI15, or WELCOME200.
        </p> */}
        {couponError ? (
          <p className="mt-2 text-xs text-red-700">{couponError}</p>
        ) : null}
        {applied ? (
          <p className="mt-2 text-xs text-emerald-800">
            {applied.label} applied (−{formatPKR(applied.discount)})
          </p>
        ) : null}
        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Subtotal" value={formatPKR(cartSubtotal)} />
          <Row
            label="Shipping"
            value={shipping === 0 ? "Free" : formatPKR(shipping)}
          />
          {discount ? (
            <Row label="Discount" value={`−${formatPKR(discount)}`} />
          ) : null}
          <Row label="Total" value={formatPKR(total)} strong />
        </dl>
      </aside>
    </Container>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${strong ? "border-t border-line pt-3 text-base font-medium" : ""}`}
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  className = "",
  type = "text",
  minLength,
  pattern,
  title,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
  type?: string;
  minLength?: number;
  pattern?: string;
  title?: string;
  error?: string;
}) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="mb-1.5 block">{label}</span>
      <input
        className={`select ${error ? "border-red-500" : ""}`}
        value={value}
        type={type}
        required={required}
        minLength={minLength}
        pattern={pattern}
        title={title}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </label>
  );
}
