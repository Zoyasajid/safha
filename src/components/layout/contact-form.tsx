"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <Container className="grid gap-10 py-14 lg:grid-cols-2">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Visit & write</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Contact</h1>
        <p className="mt-4 max-w-md text-ink-muted">
          The Clifton desk answers WhatsApp faster than email. Walk-ins welcome during shop hours.
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-ink-muted">Address</dt>
            <dd className="mt-1">{SITE.address}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Hours</dt>
            <dd className="mt-1">{SITE.hours}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Phone / WhatsApp</dt>
            <dd className="mt-1">
              {SITE.phone}
              <br />
              {SITE.whatsapp}
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">Email</dt>
            <dd className="mt-1">{SITE.email}</dd>
          </div>
        </dl>
      </div>
      <form
        className="rounded-2xl border border-line bg-white/70 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <h2 className="font-serif text-2xl">Write to us</h2>
        {sent ? (
          <p className="mt-6 text-sm text-ink-muted">
            Received — a bookseller will reply within one working day.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            <input className="select" required placeholder="Name" />
            <input className="select" required type="email" placeholder="Email" />
            <textarea className="select min-h-32" required placeholder="How can we help?" />
            <button type="submit" className="btn-primary mt-2">
              Send
            </button>
          </div>
        )}
      </form>
    </Container>
  );
}
