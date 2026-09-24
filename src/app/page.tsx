import { BookSection } from "@/components/books/book-section";
import {
  AuthorShowcase,
  CategoryShowcase,
  Difference,
  Newsletter,
} from "@/components/home/sections";
import { Hero } from "@/components/home/hero";
import { books } from "@/data/books";

export default function HomePage() {
  const featured = books.filter((b) => b.featured);
  const bestsellers = books.filter((b) => b.bestseller);
  const arrivals = books.filter((b) => b.newArrival);
  const deals = books.filter((b) => b.originalPrice);
  const urdu = books.filter((b) => b.language === "Urdu");
  const english = books.filter((b) => b.language === "English");
  const novels = books.filter((b) => b.categorySlugs.includes("novels"));
  const selfHelp = books.filter((b) => b.categorySlugs.includes("self-help"));
  const recommended = [...books]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <BookSection
        eyebrow="On the table"
        title="Featured books"
        description="Titles we are proud to put in the window — authentic editions, fairly priced in PKR."
        href="/categories"
        books={featured}
      />

      <BookSection
        eyebrow="Karachi is reading"
        title="Best sellers"
        href="/deals"
        books={bestsellers.slice(0, 8)}
      />
      <BookSection
        eyebrow="Just unpacked"
        title="New arrivals"
        href="/categories"
        books={arrivals}
      />
      <BookSection
        eyebrow="For a short while"
        title="Deals & discounts"
        description="Selected hardcovers and paperbacks with seasonal pricing."
        href="/deals"
        books={deals.slice(0, 8)}
      />
      {/* <CategoryShowcase /> */}
      <AuthorShowcase />
      <BookSection
        eyebrow="اردو"
        title="Urdu books"
        description="Novels, poetry, and the books that built our drawing rooms."
        href="/urdu"
        books={urdu.slice(0, 8)}
      />
      <BookSection
        eyebrow="English"
        title="English books"
        href="/english"
        books={english.slice(0, 8)}
      />
      <BookSection
        eyebrow="Stories"
        title="Novels"
        href="/novels"
        books={novels.slice(0, 8)}
      />
      <BookSection
        eyebrow="Habits & mind"
        title="Self-help books"
        href="/self-help"
        books={selfHelp.slice(0, 8)}
      />
      <Difference />
      <BookSection
        eyebrow="A quiet suggestion"
        title="You may also like"
        description="Recommended from this week’s Clifton notes."
        books={recommended}
      />
      <Newsletter />
    </>
  );
}
