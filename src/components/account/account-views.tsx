"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { useStore } from "@/context/store-context";
import { CITIES } from "@/lib/constants";
import { formatPKR, getBookById } from "@/lib/books";
import type { Address } from "@/types";

export function AccountHome() {
  const { user, logout, orders } = useStore();
  const router = useRouter();

  if (!user) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-4xl">Your account</h1>
        <p className="mt-3 text-ink-muted">Sign in to see orders, addresses, and saved titles.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login" className="btn-primary">
            Sign in
          </Link>
          <Link href="/register" className="btn-ghost">
            Create account
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Account</p>
          <h1 className="mt-1 font-serif text-4xl">Hello, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-sm text-ink-muted">{user.email}</p>
        </div>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Sign out
        </button>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/account/orders" className="rounded-2xl border border-line bg-white/70 p-6 hover:border-gold/50">
          <p className="font-serif text-2xl">Orders</p>
          <p className="mt-2 text-sm text-ink-muted">{orders.length} placed</p>
        </Link>
        <Link href="/account/addresses" className="rounded-2xl border border-line bg-white/70 p-6 hover:border-gold/50">
          <p className="font-serif text-2xl">Addresses</p>
          <p className="mt-2 text-sm text-ink-muted">Karachi & nationwide</p>
        </Link>
        <Link href="/wishlist" className="rounded-2xl border border-line bg-white/70 p-6 hover:border-gold/50">
          <p className="font-serif text-2xl">Wishlist</p>
          <p className="mt-2 text-sm text-ink-muted">Titles you are saving</p>
        </Link>
      </div>
    </Container>
  );
}

export function OrdersList() {
  const { orders } = useStore();
  return (
    <Container className="py-12">
      <h1 className="font-serif text-4xl">Order history</h1>
      {!orders.length ? (
        <p className="mt-6 text-ink-muted">No orders yet. Your first parcel is a pleasant thing.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/account/orders/${o.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/70 p-5 hover:border-gold/50"
              >
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-sm text-ink-muted">
                    {new Date(o.createdAt).toLocaleDateString("en-PK")} · {o.status} · {o.address.city}
                  </p>
                </div>
                <p>{formatPKR(o.total)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

export function OrderDetail({ id }: { id: string }) {
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-4xl">Order not found</h1>
        <p className="mt-3 text-ink-muted">It may still be saving on this device, or the link is old.</p>
        <Link href="/account/orders" className="btn-primary mx-auto mt-8 w-fit">
          All orders
        </Link>
      </Container>
    );
  }
  return (
    <Container className="py-12">
      <p className="text-sm text-gold">Thank you — your Safha parcel is in motion.</p>
      <h1 className="mt-2 font-serif text-4xl">{order.id}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {new Date(order.createdAt).toLocaleString("en-PK")} · {order.status} ·{" "}
        {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online payment"}
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white/70 p-6">
          <h2 className="font-serif text-2xl">Items</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((i) => {
              const book = getBookById(i.bookId);
              return (
                <li key={i.bookId} className="flex justify-between">
                  <span>
                    {book?.title ?? i.bookId} × {i.quantity}
                  </span>
                  <span>{book ? formatPKR(book.price * i.quantity) : ""}</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPKR(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{order.shipping === 0 ? "Free" : formatPKR(order.shipping)}</dd>
            </div>
            {order.discount ? (
              <div className="flex justify-between">
                <dt>Discount {order.coupon}</dt>
                <dd>−{formatPKR(order.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between font-medium">
              <dt>Total</dt>
              <dd>{formatPKR(order.total)}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-line bg-white/70 p-6">
          <h2 className="font-serif text-2xl">Deliver to</h2>
          <p className="mt-4 text-sm leading-relaxed">
            {order.address.fullName}
            <br />
            {order.address.line1}
            <br />
            {order.address.area}, {order.address.city}
            <br />
            {order.address.phone}
          </p>
        </div>
      </div>
    </Container>
  );
}

export function AddressManager() {
  const { addresses, saveAddress, removeAddress, user } = useStore();
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Karachi");
  const [postalCode, setPostalCode] = useState("");

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    const address: Address = {
      id: `addr-${Date.now()}`,
      label: city,
      fullName,
      phone,
      line1,
      area,
      city,
      province: city === "Karachi" ? "Sindh" : "Pakistan",
      postalCode,
      isDefault: addresses.length === 0,
    };
    saveAddress(address);
    setLine1("");
    setArea("");
    setPhone("");
  }

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-2">
      <div>
        <h1 className="font-serif text-4xl">Addresses</h1>
        <ul className="mt-8 space-y-4">
          {addresses.map((a) => (
            <li key={a.id} className="rounded-2xl border border-line bg-white/70 p-5">
              <p className="font-medium">
                {a.fullName} {a.isDefault ? "· Default" : ""}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {a.line1}, {a.area}, {a.city} {a.postalCode}
              </p>
              <p className="text-sm text-ink-muted">{a.phone}</p>
              <button type="button" className="mt-3 text-xs underline" onClick={() => removeAddress(a.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={onSave} className="h-fit rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl">Add address</h2>
        <div className="mt-4 grid gap-3">
          <input className="select" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input className="select" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <input className="select" placeholder="Street" value={line1} onChange={(e) => setLine1(e.target.value)} required />
          <input className="select" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} required />
          <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input className="select" placeholder="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          <button type="submit" className="btn-primary mt-2">
            Save address
          </button>
        </div>
      </form>
    </Container>
  );
}
