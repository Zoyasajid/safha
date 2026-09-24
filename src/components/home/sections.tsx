"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Headphones,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, staggerItem } from "@/components/ui/reveal";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import { authors } from "@/data/authors";

const pillars = [
  {
    icon: BookOpen,
    title: "Authentic Books",
    body: "Genuine printings from trusted Pakistani and international publishers. No grey-market guesswork.",
  },
  {
    icon: Truck,
    title: "Fast Delivery in Karachi",
    body: "Same-day and next-day across Clifton, DHA, Gulshan, and beyond. Nationwide in 2–5 days.",
  },
  {
    icon: ShieldCheck,
    title: "Curated Collection",
    body: "Every title is chosen — Urdu classics, English ideas, novels you will actually finish.",
  },
  {
    icon: Package,
    title: "Easy & Secure Payments",
    body: "Cash on delivery, JazzCash, EasyPaisa, and cards. Prices always in PKR.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    body: "WhatsApp or call the Clifton desk. Real people, not a ticket void.",
  },
];

export function Difference() {
  return (
    <section className="border-y border-line bg-white/50 py-16 sm:py-20">
      <Container>
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Why Safha
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            What makes this book shop different?
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={staggerItem}
              className="rounded-2xl border border-line bg-cream p-5 shadow-sm"
            >
              <p.icon className="h-5 w-5 text-gold" />
              <h3 className="mt-4 font-serif text-xl text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {p.body}
              </p>
            </motion.div>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function CategoryShowcase() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Browse
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            Categories
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((c) => (
            <motion.div key={c.slug} variants={staggerItem}>
              <Link
                href={c.href}
                className="group block rounded-2xl border border-line bg-white/70 p-5 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-md"
              >
                <p className="font-serif text-xl text-ink group-hover:text-gold">
                  {c.name}
                </p>
                {c.nameUrdu ? (
                  <p className="font-urdu text-ink-muted" dir="rtl">
                    {c.nameUrdu}
                  </p>
                ) : null}
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                  {c.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function AuthorShowcase() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
                Voices
              </p>
              <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
                Popular authors
              </h2>
            </div>
            <Link
              href="/authors"
              className="text-sm underline decoration-gold underline-offset-4"
            >
              All authors
            </Link>
          </div>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {authors.slice(0, 6).map((a) => (
            <motion.div key={a.id} variants={staggerItem}>
              <Link
                href={`/authors/${a.slug}`}
                className="group block text-center"
              >
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-line shadow-inner transition group-hover:scale-105">
                  {a.image ? (
                    <Image
                      src={a.image}
                      alt={a.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-end justify-center"
                      style={{ background: a.coverTone }}
                    >
                      <span className="mb-3 font-serif text-2xl text-[#F7F1E8]">
                        {a.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 font-medium text-ink group-hover:text-gold">
                  {a.name}
                </p>
                <p className="text-xs text-ink-muted">{a.location}</p>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="rounded-3xl bg-ink px-6 py-12 text-cream sm:px-12">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
              The Safha letter
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl sm:text-4xl">
              New arrivals, quiet recommendations, Clifton window notes.
            </h2>
            <form
              className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-sm outline-none placeholder:text-cream/40"
              />
              <button type="submit" className="btn-primary !bg-gold !text-ink">
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-cream/50">
              One letter a month. No spam. Unsubscribe whenever you like.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
