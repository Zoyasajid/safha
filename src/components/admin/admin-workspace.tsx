"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  Check,
  CircleAlert,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type {
  AdminAuthor,
  AdminCategory,
  AdminCoupon,
  AdminCustomer,
  AdminDB,
  AdminOrder,
  AdminProduct,
  AdminReview,
  StoreSettings,
} from "@/lib/admin/types";
import { deriveStockStatus } from "@/lib/admin/types";

type Section =
  | "dashboard"
  | "products"
  | "categories"
  | "authors"
  | "orders"
  | "customers"
  | "reviews"
  | "inventory"
  | "discounts"
  | "settings"
  | "activity";
const money = (value: number) => `PKR ${value.toLocaleString()}`;
const date = (value: string) =>
  new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export function AdminWorkspace({ section }: { section: Section }) {
  const [db, setDb] = useState<AdminDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/overview", { cache: "no-store" });
    if (response.ok) setDb(await response.json());
    setLoading(false);
  }
  useEffect(() => {
    fetch("/api/admin/overview", { cache: "no-store" }).then(
      async (response) => {
        if (response.ok) setDb(await response.json());
        setLoading(false);
      },
    );
  }, []);
  async function mutate(resource: string, method: string, body: unknown) {
    const response = await fetch(`/api/admin/data/${resource}`, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const data = await response.json();
      setNotice(data.error ?? "Could not save change.");
      return;
    }
    setNotice("Saved successfully");
    load();
    setTimeout(() => setNotice(""), 2200);
  }
  if (loading || !db)
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      </div>
    );
  if (section === "dashboard") return <Dashboard db={db} />;
  if (section === "products")
    return (
      <Products
        products={db.products}
        authors={db.authors}
        categories={db.categories}
        query={query}
        setQuery={setQuery}
        mutate={mutate}
      />
    );
  if (section === "inventory")
    return <Inventory products={db.products} mutate={mutate} />;
  if (section === "categories")
    return (
      <Records
        title="Categories"
        description="Organise the catalogue into clear, discoverable shelves."
        resource="categories"
        rows={db.categories}
        columns={[
          ["name", "Category"],
          ["description", "Description"],
          ["status", "Status"],
          ["createdAt", "Created"],
        ]}
        query={query}
        setQuery={setQuery}
        mutate={mutate}
      />
    );
  if (section === "authors")
    return (
      <Records
        title="Authors"
        description="Maintain author profiles and the stories behind each catalogue."
        resource="authors"
        rows={db.authors}
        columns={[
          ["name", "Author"],
          ["location", "Location"],
          ["status", "Status"],
          ["createdAt", "Added"],
        ]}
        query={query}
        setQuery={setQuery}
        mutate={mutate}
      />
    );
  if (section === "orders")
    return (
      <Orders orders={db.orders} customers={db.customers} mutate={mutate} />
    );
  if (section === "customers")
    return (
      <Records
        title="Customers"
        description="Understand your readers and their order history."
        resource="customers"
        rows={db.customers}
        columns={[
          ["name", "Customer"],
          ["email", "Email"],
          ["city", "City"],
          ["status", "Status"],
          ["createdAt", "Joined"],
        ]}
        query={query}
        setQuery={setQuery}
        mutate={mutate}
      />
    );
  if (section === "reviews")
    return (
      <Records
        title="Reviews"
        description="Keep reader feedback useful, visible, and trustworthy."
        resource="reviews"
        rows={db.reviews}
        columns={[
          ["author", "Customer"],
          ["title", "Review"],
          ["rating", "Rating"],
          ["status", "Status"],
          ["date", "Date"],
        ]}
        query={query}
        setQuery={setQuery}
        mutate={mutate}
      />
    );
  if (section === "discounts")
    return (
      <Records
        title="Discounts & coupons"
        description="Create focused offers without losing margin visibility."
        resource="coupons"
        rows={db.coupons}
        columns={[
          ["code", "Code"],
          ["type", "Type"],
          ["value", "Value"],
          ["expiryDate", "Expires"],
          ["active", "Status"],
        ]}
        query={query}
        setQuery={setQuery}
        mutate={mutate}
      />
    );
  if (section === "activity") return <Activity db={db} />;
  return <Settings settings={db.settings} mutate={mutate} />;
}

function Heading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d09830]">
          {eyebrow ?? "Workspace"}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#102a43]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
function Dashboard({ db }: { db: AdminDB }) {
  const pending = db.orders.filter((o) =>
    ["Pending", "Confirmed", "Processing"].includes(o.status),
  ).length;
  const low = db.products.filter(
    (p) => deriveStockStatus(p) === "low_stock",
  ).length;
  const out = db.products.filter(
    (p) => deriveStockStatus(p) === "out_of_stock",
  ).length;
  const sales = db.orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const cards: Array<{
    label: string;
    value: string | number;
    Icon: typeof BookOpen;
    hint: string;
  }> = [
    {
      label: "Total products",
      value: db.products.length,
      Icon: BookOpen,
      hint: "+12% this month",
    },
    {
      label: "Total sales",
      value: money(sales),
      Icon: ShoppingBag,
      hint: "Paid orders only",
    },
    {
      label: "Pending orders",
      value: pending,
      Icon: Archive,
      hint: "Needs attention",
    },
    {
      label: "Customers",
      value: db.customers.length,
      Icon: Users,
      hint: "Registered accounts",
    },
  ];
  return (
    <>
      <Heading
        eyebrow="Overview"
        title="Good morning, admin"
        description="A quick read on the shop today."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d09830] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b78325]"
          >
            <Plus size={17} /> Add product
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, Icon, hint }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <span className="rounded-lg bg-[#edf3f7] p-2 text-[#163b59]">
                <Icon size={17} />
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold text-[#102a43]">
              {value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#102a43]">Recent orders</h3>
              <p className="mt-1 text-sm text-slate-500">
                Latest activity across checkout.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-[#b78325]"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {db.orders.slice(0, 5).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-4 font-semibold text-[#163b59]">
                      {order.id}
                    </td>
                    <td className="py-4">
                      {
                        db.customers.find((c) => c.id === order.customerId)
                          ?.name
                      }
                    </td>
                    <td className="py-4">
                      <Status value={order.status} />
                    </td>
                    <td className="py-4 text-right font-semibold">
                      {money(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-[#102a43]">Stock pulse</h3>
          <p className="mt-1 text-sm text-slate-500">
            Keep popular titles available.
          </p>
          <div className="mt-6 space-y-5">
            <StockMetric
              label="In stock"
              value={
                db.products.filter((p) => deriveStockStatus(p) === "in_stock")
                  .length
              }
              total={db.products.length}
              color="bg-emerald-500"
            />
            <StockMetric
              label="Low stock"
              value={low}
              total={db.products.length}
              color="bg-amber-500"
            />
            <StockMetric
              label="Out of stock"
              value={out}
              total={db.products.length}
              color="bg-red-500"
            />
          </div>
          <Link
            href="/admin/inventory"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#b78325]"
          >
            Review inventory <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </>
  );
}
function StockMetric({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${Math.max(4, (value / Math.max(total, 1)) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
function Status({ value }: { value: string }) {
  const tone = /delivered|paid|active|approved|in_stock/i.test(value)
    ? "bg-emerald-50 text-emerald-700"
    : /pending|low|processing|confirmed/i.test(value)
      ? "bg-amber-50 text-amber-700"
      : /cancel|out|hidden|blocked|inactive/i.test(value)
        ? "bg-red-50 text-red-700"
        : "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function Products({
  products,
  authors,
  categories,
  query,
  setQuery,
  mutate,
}: {
  products: AdminProduct[];
  authors: AdminAuthor[];
  categories: AdminCategory[];
  query: string;
  setQuery: (v: string) => void;
  mutate: (resource: string, method: string, body: unknown) => Promise<void>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const visible = products.filter((p) =>
    `${p.title} ${p.sku}`.toLowerCase().includes(query.toLowerCase()),
  );
  async function deleteProduct(id: string) {
    if (confirm("Delete this product permanently?")) {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      location.reload();
    }
  }
  return (
    <>
      <Heading
        eyebrow="Catalogue"
        title="Products / Books"
        description={`${products.length} titles in your catalogue.`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#d09830] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b78325]"
          >
            <Plus size={17} /> Add product
          </Link>
        }
      />
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or SKU"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#d09830]"
            />
          </div>
          <select className="rounded-lg border border-slate-200 px-3 text-sm text-slate-600">
            <option>All categories</option>
            {categories.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-200 px-3 text-sm text-slate-600">
            <option>All stock statuses</option>
            <option>In stock</option>
            <option>Low stock</option>
            <option>Out of stock</option>
          </select>
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-[#edf3f7] px-4 py-3 text-sm">
            <strong>{selected.length} selected</strong>
            <button
              onClick={() =>
                mutate("products/bulk", "POST", {
                  ids: selected,
                  action: "feature",
                })
              }
              className="rounded-lg bg-white px-3 py-1.5 font-medium"
            >
              Mark featured
            </button>
            <button
              onClick={() =>
                mutate("products/bulk", "POST", {
                  ids: selected,
                  action: "delete",
                })
              }
              className="rounded-lg bg-white px-3 py-1.5 font-medium text-red-600"
            >
              Delete
            </button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === visible.length && visible.length > 0
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? visible.map((p) => p.id) : [],
                      )
                    }
                  />
                </th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-100 hover:bg-slate-50/70"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() =>
                        setSelected(
                          selected.includes(product.id)
                            ? selected.filter((id) => id !== product.id)
                            : [...selected, product.id],
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-10 place-items-center rounded bg-[#d9c2a1] text-[#6c4a2d]">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#163b59]">
                          {product.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {product.sku} ·{" "}
                          {authors.find((a) => a.id === product.authorId)
                            ?.name ?? "Unassigned"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {categories.find((c) => product.categoryIds.includes(c.id))
                      ?.name ?? "Uncategorised"}
                  </td>
                  <td className="px-4 py-4 font-medium">
                    {money(product.salePrice ?? product.price)}
                    {product.salePrice && (
                      <span className="ml-1 text-xs text-slate-400 line-through">
                        {money(product.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        deriveStockStatus(product) === "out_of_stock"
                          ? "font-semibold text-red-600"
                          : deriveStockStatus(product) === "low_stock"
                            ? "font-semibold text-amber-600"
                            : "text-slate-600"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Status value={product.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        aria-label="Edit product"
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#163b59]"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        aria-label="Delete product"
                        onClick={() => deleteProduct(product.id)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        aria-label="More actions"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Inventory({
  products,
  mutate,
}: {
  products: AdminProduct[];
  mutate: (resource: string, method: string, body: unknown) => Promise<void>;
}) {
  return (
    <>
      <Heading
        eyebrow="Operations"
        title="Inventory"
        description="Monitor availability and update stock quickly."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StockMetric
          label="In stock"
          value={
            products.filter((p) => deriveStockStatus(p) === "in_stock").length
          }
          total={products.length}
          color="bg-emerald-500"
        />
        <StockMetric
          label="Low stock"
          value={
            products.filter((p) => deriveStockStatus(p) === "low_stock").length
          }
          total={products.length}
          color="bg-amber-500"
        />
        <StockMetric
          label="Out of stock"
          value={
            products.filter((p) => deriveStockStatus(p) === "out_of_stock")
              .length
          }
          total={products.length}
          color="bg-red-500"
        />
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Current stock</th>
              <th className="px-5 py-3">Threshold</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Quick update</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-semibold text-[#163b59]">
                  {product.title}
                </td>
                <td className="px-5 py-4 text-slate-500">{product.sku}</td>
                <td className="px-5 py-4 font-semibold">{product.stock}</td>
                <td className="px-5 py-4 text-slate-500">
                  {product.lowStockThreshold}
                </td>
                <td className="px-5 py-4">
                  <Status value={deriveStockStatus(product)} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => {
                      const value = prompt(
                        "New stock quantity",
                        String(product.stock),
                      );
                      if (value !== null)
                        mutate(`products/${product.id}`, "PATCH", {
                          stock: Number(value),
                        });
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:border-[#d09830]"
                  >
                    Update stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Records({
  title,
  description,
  resource,
  rows,
  columns,
  query,
  setQuery,
  mutate,
}: {
  title: string;
  description: string;
  resource: string;
  rows: Array<Record<string, unknown>>;
  columns: Array<[string, string]>;
  query: string;
  setQuery: (v: string) => void;
  mutate: (resource: string, method: string, body: unknown) => Promise<void>;
}) {
  const filtered = rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <Heading
        eyebrow="Management"
        title={title}
        description={description}
        action={
          <button
            onClick={() =>
              alert(`Use the ${title.toLowerCase()} form to create a record.`)
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#d09830] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={17} /> Add{" "}
            {title.endsWith("s") ? title.slice(0, -1) : title}
          </button>
        }
      />
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}`}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#d09830]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                {columns.map(([, label]) => (
                  <th key={label} className="px-5 py-3">
                    {label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={String(row.id)} className="border-t border-slate-100">
                  <>
                    {columns.map(([key]) => (
                      <td key={key} className="px-5 py-4 text-slate-600">
                        {key === "status" || key === "active" ? (
                          <Status value={String(row[key])} />
                        ) : key.toLowerCase().includes("date") ||
                          key === "createdAt" ? (
                          date(String(row[key]))
                        ) : key === "value" ? (
                          String(row.type) === "percent" ? (
                            `${row[key]}%`
                          ) : (
                            money(Number(row[key]))
                          )
                        ) : (
                          String(row[key] ?? "-")
                        )}
                      </td>
                    ))}
                  </>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => mutate(resource, "DELETE", { id: row.id })}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Orders({
  orders,
  customers,
  mutate,
}: {
  orders: AdminOrder[];
  customers: AdminCustomer[];
  mutate: (resource: string, method: string, body: unknown) => Promise<void>;
}) {
  const statuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ];
  return (
    <>
      <Heading
        eyebrow="Fulfilment"
        title="Orders"
        description="Review, process, and update customer orders."
      />
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Order status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-semibold text-[#163b59]">
                  {order.id}
                </td>
                <td className="px-5 py-4">
                  {customers.find((c) => c.id === order.customerId)?.name}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {date(order.createdAt)}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {order.items.reduce((s, i) => s + i.quantity, 0)}
                </td>
                <td className="px-5 py-4 font-semibold">
                  {money(order.total)}
                </td>
                <td className="px-5 py-4">
                  <Status value={order.paymentStatus} />
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      mutate("orders", "PATCH", {
                        id: order.id,
                        status: e.target.value,
                      })
                    }
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold"
                  >
                    <option>{order.status}</option>
                    {statuses
                      .filter((s) => s !== order.status)
                      .map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Activity({ db }: { db: AdminDB }) {
  const entries = db.wishlist.map((entry) => ({
    ...entry,
    product: db.products.find((p) => p.id === entry.productId)?.title,
    customer: db.customers.find((c) => c.id === entry.customerId)?.name,
  }));
  return (
    <>
      <Heading
        eyebrow="Customer signals"
        title="Wishlist & activity"
        description="See which titles readers are saving for later."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-500">
                <BookOpen size={18} />
              </span>
              <div>
                <p className="font-semibold text-[#163b59]">{entry.product}</p>
                <p className="text-xs text-slate-500">
                  Saved by {entry.customer}
                </p>
              </div>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              Added {date(entry.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function Settings({
  settings,
  mutate,
}: {
  settings: StoreSettings;
  mutate: (resource: string, method: string, body: unknown) => Promise<void>;
}) {
  const [form, setForm] = useState(settings);
  const update = (key: keyof StoreSettings, value: string | boolean) =>
    setForm({ ...form, [key]: value });
  return (
    <>
      <Heading
        eyebrow="Configuration"
        title="Store settings"
        description="Keep customer-facing operations and contact details current."
        action={
          <button
            onClick={() => mutate("settings", "PATCH", form)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d09830] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Check size={17} /> Save settings
          </button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          [
            "Store identity",
            ["storeName", "logoText", "email", "phone", "whatsapp"],
          ],
          [
            "Customer information",
            ["address", "hours", "shippingInfo", "returnPolicy"],
          ],
          ["Social links", ["instagram", "facebook", "whatsappLink"]],
        ].map(([title, keys]) => (
          <section
            key={String(title)}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h3 className="font-semibold text-[#102a43]">{title}</h3>
            <div className="mt-5 space-y-4">
              {(keys as string[]).map((key) => (
                <label
                  key={key}
                  className="block text-sm font-medium capitalize text-slate-600"
                >
                  {key.replace(/([A-Z])/g, " $1")}
                  <input
                    value={String(form[key as keyof StoreSettings] ?? "")}
                    onChange={(e) =>
                      update(key as keyof StoreSettings, e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#d09830]"
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-[#102a43]">Payment methods</h3>
          <div className="mt-5 space-y-3">
            {[
              "cashOnDelivery",
              "onlinePayments",
              "jazzCash",
              "easyPaisa",
              "cards",
            ].map((key) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-sm capitalize"
              >
                <span>{key.replace(/([A-Z])/g, " $1")}</span>
                <input
                  type="checkbox"
                  checked={Boolean(form[key as keyof StoreSettings])}
                  onChange={(e) =>
                    update(key as keyof StoreSettings, e.target.checked)
                  }
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
