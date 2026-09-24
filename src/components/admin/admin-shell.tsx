"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Users,
  ShoppingBag,
  MessageSquare,
  Package,
  Percent,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
} from "lucide-react";

const nav = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Products / Books", "/admin/products", BookOpen],
  ["Categories", "/admin/categories", Tags],
  ["Authors", "/admin/authors", Users],
  ["Orders", "/admin/orders", ShoppingBag],
  ["Customers", "/admin/customers", Users],
  ["Reviews", "/admin/reviews", MessageSquare],
  ["Discounts / Coupons", "/admin/discounts", Percent],
  ["Inventory", "/admin/inventory", Package],
  ["Wishlist / Activity", "/admin/activity", BookOpen],
  ["Settings", "/admin/settings", Settings],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  if (pathname === "/admin/login") return <>{children}</>;
  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#14202b] lg:flex">
      <button
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg bg-[#102a43] p-2.5 text-white shadow-lg lg:hidden"
      >
        <Menu size={19} />
      </button>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#102a43] text-slate-200 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d7a94b] text-[#102a43]">
              <BookOpen size={21} />
            </span>
            <span>
              <strong className="block text-lg tracking-tight text-white">
                Safha Admin
              </strong>
              <small className="text-[10px] uppercase tracking-[.22em] text-slate-400">
                Bookstore operations
              </small>
            </span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={19} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {nav.map(([label, href, Icon]) => {
            const active =
              href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-white/12 font-semibold text-white" : "text-slate-400 hover:bg-white/7 hover:text-white"}`}
              >
                <Icon size={17} />
                <span>{label}</span>
                {active && (
                  <ChevronRight size={14} className="ml-auto text-[#d7a94b]" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/7 hover:text-white"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 pl-16 sm:px-8 sm:pl-20 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#d09830]">
              Safha operations
            </p>
            <h1 className="text-lg font-semibold text-[#102a43]">
              {nav.find(([, href]) =>
                href === "/admin"
                  ? pathname === href
                  : pathname.startsWith(href),
              )?.[0] ?? "Product workspace"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400 md:flex">
              <Search size={15} /> Search workspace
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#d7a94b] text-sm font-bold text-[#102a43]">
              A
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] p-5 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
