"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { useStore } from "@/context/store-context";
import { applyCoupon, formatPKR, getBookById, shippingForCity } from "@/lib/books";
import { CITIES, KARACHI_AREAS, SITE } from "@/lib/constants";
import type { Address, PaymentMethod } from "@/types";

export function CheckoutView() {
  const { cart, cartSubtotal, addresses, user, placeOrder } = useStore();
  const router = useRouter();
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [city, setCity] = useState(defaultAddr?.city ?? "Karachi");
  const [area, setArea] = useState(defaultAddr?.area ?? "Clifton");
  const [fullName, setFullName] = useState(defaultAddr?.fullName ?? user?.name ?? "");
  const [phone, setPhone] = useState(defaultAddr?.phone ?? "");
  const [line1, setLine1] = useState(defaultAddr?.line1 ?? "");
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode ?? "");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ discount: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState("");

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
        <button type="button" className="btn-primary mx-auto mt-8" onClick={() => router.push("/")}>
          Return home
        </button>
      </Container>
    );
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

  function onPlace(e: React.FormEvent) {
    e.preventDefault();
    const address: Address = {
      id: `addr-${Date.now()}`,
      label: "Checkout",
      fullName,
      phone,
      line1,
      area,
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
      status: "Processing" as const,
      address,
    };
    placeOrder(order);
    router.push(`/account/orders/${order.id}`);
  }

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
      <form onSubmit={onPlace} className="space-y-8">
        <div>
          <h1 className="font-serif text-4xl">Checkout</h1>
          <p className="mt-2 text-sm text-ink-muted">{SITE.karachiDelivery}</p>
        </div>
        <fieldset className="rounded-2xl border border-line bg-white/70 p-6">
          <legend className="font-serif text-2xl">Delivery address</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={fullName} onChange={setFullName} required />
            <Input label="Phone" value={phone} onChange={setPhone} required />
            <Input label="Street address" value={line1} onChange={setLine1} required className="sm:col-span-2" />
            <label className="text-sm">
              <span className="mb-1.5 block">City</span>
              <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block">Area</span>
              {city === "Karachi" ? (
                <select className="select" value={area} onChange={(e) => setArea(e.target.value)}>
                  {KARACHI_AREAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              ) : (
                <input className="select" value={area} onChange={(e) => setArea(e.target.value)} required />
              )}
            </label>
            <Input label="Postal code" value={postalCode} onChange={setPostalCode} />
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
              <span className="text-sm text-ink-muted">Pay in PKR when the parcel arrives. Available nationwide.</span>
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
                JazzCash, EasyPaisa, Visa, and Mastercard. (Demo checkout — no charge is taken.)
              </span>
            </span>
          </label>
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
          <button type="button" className="btn-ghost !px-4" onClick={onApplyCoupon}>
            Apply
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-muted">Try SAFHA10, KARACHI15, or WELCOME200.</p>
        {couponError ? <p className="mt-2 text-xs text-red-700">{couponError}</p> : null}
        {applied ? (
          <p className="mt-2 text-xs text-emerald-800">
            {applied.label} applied (−{formatPKR(applied.discount)})
          </p>
        ) : null}
        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Subtotal" value={formatPKR(cartSubtotal)} />
          <Row label="Shipping" value={shipping === 0 ? "Free" : formatPKR(shipping)} />
          {discount ? <Row label="Discount" value={`−${formatPKR(discount)}`} /> : null}
          <Row label="Total" value={formatPKR(total)} strong />
        </dl>
      </aside>
    </Container>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "border-t border-line pt-3 text-base font-medium" : ""}`}>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="mb-1.5 block">{label}</span>
      <input
        className="select"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
