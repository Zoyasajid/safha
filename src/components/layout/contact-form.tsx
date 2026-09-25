"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const form = e.currentTarget;
    const fields = new FormData(form);
    let response: Response;
    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          message: fields.get("message"),
        }),
      });
    } catch {
      setError(
        "Unable to send your message. Please check your connection and try again.",
      );
      setSending(false);
      return;
    }

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(
        result?.error ?? "Unable to send your message. Please try again.",
      );
      setSending(false);
      return;
    }

    form.reset();
    setSent(true);
    setSending(false);
  }

  return (
    <Container className="grid gap-10 py-14 lg:grid-cols-2">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
          Visit & write
        </p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Contact</h1>
        <p className="mt-4 max-w-md text-ink-muted">
          The Clifton desk answers WhatsApp faster than email. Walk-ins welcome
          during shop hours.
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
        onSubmit={onSubmit}
      >
        <h2 className="font-serif text-2xl">Write to us</h2>
        {sent ? (
          <p className="mt-6 text-sm text-ink-muted">
            Received — a bookseller will reply within one working day.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            <input className="select" required name="name" placeholder="Name" />
            <input
              className="select"
              required
              name="email"
              type="email"
              placeholder="Email"
            />
            <textarea
              className="select min-h-32"
              required
              name="message"
              placeholder="How can we help?"
            />
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <button
              type="submit"
              className="btn-primary mt-2"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        )}
      </form>
    </Container>
  );
}
