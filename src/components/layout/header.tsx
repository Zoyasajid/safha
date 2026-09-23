"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useStore } from "@/context/store-context";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { Container } from "@/components/ui/container";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, wishlist, user, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="bg-ink text-cream">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-2 text-[11px] tracking-wide">
          <p>Karachi same-day delivery · Cash on delivery · Prices in PKR</p>
          <p className="hidden sm:block">{SITE.phone}</p>
        </Container>
      </div>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <button
            type="button"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-serif text-3xl tracking-tight text-ink">Safha</span>
            <span className="hidden font-urdu text-lg text-gold sm:inline" dir="rtl">
              صفحہ
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-[13px] lg:flex xl:gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap transition hover:text-gold ${
                  pathname === link.href ? "text-gold" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <IconBtn label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Wishlist" onClick={() => router.push("/wishlist")}>
              <span className="relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 ? <Badge n={wishlist.length} /> : null}
              </span>
            </IconBtn>
            <IconBtn
              label="Account"
              onClick={() => router.push(user ? "/account" : "/login")}
            >
              <UserRound className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Cart" onClick={() => router.push("/cart")}>
              <span className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 ? <Badge n={cartCount} /> : null}
              </span>
            </IconBtn>
          </div>
        </Container>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="relative h-full w-[min(320px,86vw)] bg-cream p-6 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-serif text-2xl">Safha</span>
                <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-4 text-base">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="border-b border-line pb-3">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-cream shadow-lg"
          >
            {toast.message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-white"
    >
      {children}
    </motion.button>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink">
      {n}
    </span>
  );
}
