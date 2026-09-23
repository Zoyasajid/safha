"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(196,163,90,0.16),_transparent_50%),linear-gradient(180deg,#FBF7F0_0%,#F3EADF_100%)]" />
      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
            Karachi · Pakistan
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.1] text-ink sm:text-6xl lg:text-[4.25rem]">
            Books, chosen with care.
          </h1>
          <p className="mt-3 font-urdu text-2xl text-ink-muted" dir="rtl">
            صفحہ — کراچی کی جدید کتب خانہ
          </p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
            Safha is a premium online bookshop for readers in Karachi and across Pakistan.
            Authentic Urdu and English editions, same-day city delivery, and cash on delivery
            when you want it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/categories" className="btn-primary">
              Browse the shelves <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/urdu" className="btn-ghost">
              Urdu collection
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="font-medium text-ink">Karachi next day</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Pay how you like</dt>
              <dd className="font-medium text-ink">COD & online</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Currency</dt>
              <dd className="font-medium text-ink">PKR</dd>
            </div>
          </dl>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -left-6 top-8 hidden h-40 w-28 -rotate-12 rounded-md bg-[#3B2418] shadow-xl sm:block" />
          <div className="absolute -right-4 bottom-10 hidden h-44 w-32 rotate-6 rounded-md bg-[#1F3328] shadow-xl sm:block" />
          <div className="relative rounded-2xl border border-line bg-white/80 p-8 shadow-[0_30px_60px_-30px_rgba(44,36,22,0.45)]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">This week on the table</p>
            <p className="mt-4 font-serif text-3xl text-ink">Peer-e-Kamil, Atomic Habits, Raja Gidh.</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              The titles Karachi is actually reading — packed in Clifton, delivered to your door.
            </p>
            <Link href="/deals" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-gold">
              See current deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
