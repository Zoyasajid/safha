"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchBooks, formatPKR, getAuthorName } from "@/lib/books";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const results = useMemo(() => searchBooks(q).slice(0, 8), [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-16 w-[min(640px,92vw)] rounded-2xl border border-line bg-cream p-4 shadow-2xl sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!q.trim()) return;
            router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            onClose();
          }}
          className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3"
        >
          <Search className="h-5 w-5 text-ink-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles, authors, ISBN…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
        </form>
        <div className="mt-4 max-h-[50vh] overflow-auto">
          {q.trim() && !results.length ? (
            <p className="px-2 py-6 text-center text-sm text-ink-muted">
              No matches. Try “Umera”, “habits”, or an ISBN.
            </p>
          ) : null}
          {results.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.slug}`}
              onClick={onClose}
              className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-white"
            >
              <div>
                <p className="font-medium text-ink">{book.title}</p>
                <p className="text-xs text-ink-muted">{getAuthorName(book.authorId)}</p>
              </div>
              <p className="text-sm text-ink">{formatPKR(book.price)}</p>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-ink-muted">
          Press Enter to see all results · Esc to close
        </p>
      </div>
    </div>
  );
}
