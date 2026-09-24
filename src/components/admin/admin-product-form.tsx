"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Loader2, Save } from "lucide-react";
import type {
  AdminAuthor,
  AdminCategory,
  AdminProduct,
} from "@/lib/admin/types";

type Props = {
  product?: AdminProduct;
  authors: AdminAuthor[];
  categories: AdminCategory[];
};
const fields = [
  ["title", "Book title", "text"],
  ["slug", "Slug", "text"],
  ["shortDescription", "Short description", "text"],
  ["publisher", "Publisher", "text"],
  ["isbn", "ISBN", "text"],
  ["edition", "Edition", "text"],
  ["publicationDate", "Publication date", "date"],
  ["pages", "Number of pages", "number"],
  ["price", "Regular price (PKR)", "number"],
  ["salePrice", "Sale price (PKR)", "number"],
  ["costPrice", "Cost price (PKR)", "number"],
  ["sku", "SKU", "text"],
  ["stock", "Stock quantity", "number"],
  ["lowStockThreshold", "Low-stock threshold", "number"],
  ["weightGrams", "Weight (grams)", "number"],
  ["lengthCm", "Length (cm)", "number"],
  ["widthCm", "Width (cm)", "number"],
  ["heightCm", "Height (cm)", "number"],
] as const;
export function AdminProductForm({ product, authors, categories }: Props) {
  const [form, setForm] = useState<AdminProduct | null>(product ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  if (!form)
    return <div className="p-8 text-sm text-slate-500">Loading form...</div>;
  const update = (key: keyof AdminProduct, value: unknown) =>
    setForm({ ...form, [key]: value });
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    const endpoint = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const response = await fetch(endpoint, {
      method: product ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Could not save product.");
    else {
      setForm(data.product);
      setSuccess(
        product
          ? "Product updated successfully."
          : "Product created successfully.",
      );
    }
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            href="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#163b59]"
          >
            <ArrowLeft size={15} /> Back to products
          </Link>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d09830]">
            Catalogue
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[#102a43]">
            {product ? "Edit product" : "Add product"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Complete the product record used by the storefront.
          </p>
        </div>
        <button
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d09830] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}{" "}
          Save product
        </button>
      </div>
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          <Check size={16} /> {success}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionTitle title="Basic information" />
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.slice(0, 8).map(([key, label, type]) => (
                <Field
                  key={key}
                  label={label}
                  type={type}
                  value={form[key]}
                  onChange={(value) =>
                    update(key, type === "number" ? Number(value) : value)
                  }
                />
              ))}
              <label className="sm:col-span-2 text-sm font-medium text-slate-600">
                Full description
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={6}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#d09830]"
                />
              </label>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionTitle title="Pricing & inventory" />
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.slice(8).map(([key, label, type]) => (
                <Field
                  key={key}
                  label={label}
                  type={type}
                  value={form[key]}
                  onChange={(value) =>
                    update(key, type === "number" ? Number(value) : value)
                  }
                />
              ))}
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.allowBackorders}
                onChange={(e) => update("allowBackorders", e.target.checked)}
              />{" "}
              Allow backorders
            </label>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionTitle title="Shipping & SEO" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Delivery information"
                value={form.deliveryInfo}
                onChange={(value) => update("deliveryInfo", value)}
              />
              <Field
                label="SEO title"
                value={form.seoTitle}
                onChange={(value) => update("seoTitle", value)}
              />
              <label className="sm:col-span-2 text-sm font-medium text-slate-600">
                SEO description
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#d09830]"
                />
              </label>
              <Field
                label="SEO keywords"
                value={form.seoKeywords}
                onChange={(value) => update("seoKeywords", value)}
              />
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionTitle title="Classification" />
            <label className="block text-sm font-medium text-slate-600">
              Author
              <select
                value={form.authorId}
                onChange={(e) => update("authorId", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5"
              >
                <option value="">Select author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-600">
              Category
              <select
                value={form.categoryIds[0] ?? ""}
                onChange={(e) => update("categoryIds", [e.target.value])}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5"
              >
                <option value="">Select category</option>
                {categories
                  .filter((c) => !c.parentId)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-600">
              Language
              <select
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5"
              >
                <option>English</option>
                <option>Urdu</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-600">
              Book type
              <input
                value={form.bookType}
                onChange={(e) => update("bookType", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5"
              />
            </label>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionTitle title="Cover image" />
            <div className="grid min-h-40 place-items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
              <ImagePlus className="text-slate-400" />
              <p className="mt-2 text-xs text-slate-500">
                Paste an image URL in the field below
              </p>
            </div>
            <input
              value={form.images[0]?.url ?? ""}
              onChange={(e) =>
                update("images", [
                  {
                    id: `${form.id}-cover`,
                    url: e.target.value,
                    alt: `${form.title} cover`,
                  },
                ])
              }
              placeholder="https://..."
              className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            />
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionTitle title="Product settings" />
            {[
              ["featured", "Featured product"],
              ["bestseller", "Bestseller"],
              ["newArrival", "New arrival"],
              ["deal", "Deal / discount"],
              ["reviewsEnabled", "Enable reviews"],
              ["showRating", "Show rating"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between border-b border-slate-100 py-3 text-sm text-slate-600 last:border-0"
              >
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(form[key as keyof AdminProduct])}
                  onChange={(e) =>
                    update(key as keyof AdminProduct, e.target.checked)
                  }
                />
              </label>
            ))}
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </section>
        </aside>
      </div>
    </form>
  );
}
function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="mb-5 border-b border-slate-100 pb-4 font-semibold text-[#102a43]">
      {title}
    </h3>
  );
}
function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: unknown;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-600">
      {label}
      <input
        type={type}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#d09830]"
      />
    </label>
  );
}
