import { Star } from "lucide-react";

export function RatingStars({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const cls = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${cls} ${
              i < Math.round(rating) ? "fill-gold text-gold" : "text-stone-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-ink-muted">
        {rating.toFixed(1)}
        {typeof count === "number" ? ` · ${count}` : ""}
      </span>
    </div>
  );
}
