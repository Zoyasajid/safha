import type { Book } from "@/types";
import { getAuthorName } from "@/lib/books";

export function BookCover({
  book,
  className = "",
}: {
  book: Book;
  className?: string;
}) {
  const author = getAuthorName(book.authorId);
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-md shadow-[0_18px_40px_-18px_rgba(44,36,22,0.55)] ${className}`}
      style={{ background: book.coverTone }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.28) 0, transparent 9%), radial-gradient(circle at 20% 10%, ${book.accent}33, transparent 42%)`,
        }}
      />
      <div className="absolute left-0 top-0 h-full w-[7px] bg-gradient-to-b from-white/20 to-black/30" />
      <div className="relative flex h-full flex-col justify-between p-4 text-[#F7F1E8] sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/70">
            {book.language}
          </span>
          <span className="font-serif text-lg leading-none text-gold">{book.year}</span>
        </div>
        <div>
          <div className="mb-3 h-px w-10 bg-gold/80" />
          <h3 className="font-serif text-[1.15rem] leading-tight sm:text-xl">{book.title}</h3>
          {book.titleUrdu ? (
            <p className="mt-1 font-urdu text-sm text-white/80" dir="rtl">
              {book.titleUrdu}
            </p>
          ) : null}
          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-white/65">
            {author}
          </p>
        </div>
        <p className="text-[10px] tracking-[0.3em] text-gold/90">SAFHA</p>
      </div>
    </div>
  );
}
