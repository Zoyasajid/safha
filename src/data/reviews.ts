import type { Review } from "@/types";

export const reviews: Review[] = [
  {
    id: "r1",
    bookId: "peer-e-kamil",
    author: "Ayesha K.",
    rating: 5,
    title: "A book I gift every year",
    body: "Bought the Safha copy for my sister in DHA. Print quality is excellent and delivery to Karachi was next day.",
    date: "12 Aug 2026",
    city: "Karachi",
  },
  {
    id: "r2",
    bookId: "peer-e-kamil",
    author: "Hamza R.",
    rating: 5,
    title: "Still the one",
    body: "Read it at university, bought a fresh copy for the shelf. Binding is sturdy.",
    date: "3 Jul 2026",
    city: "Karachi",
  },
  {
    id: "r3",
    bookId: "atomic-habits",
    author: "Sana M.",
    rating: 5,
    title: "Clear, useful, not gimmicky",
    body: "Finally a self-help book I actually use. Arrived in two days to Gulshan.",
    date: "21 Aug 2026",
    city: "Karachi",
  },
  {
    id: "r4",
    bookId: "raja-gidh",
    author: "Farah S.",
    rating: 5,
    title: "Literature, not just a novel",
    body: "The Sang-e-Meel edition feels right. Thank you for stocking proper Urdu classics.",
    date: "9 Jun 2026",
    city: "Lahore",
  },
  {
    id: "r5",
    bookId: "the-alchemist",
    author: "Bilal A.",
    rating: 4,
    title: "A comfort reread",
    body: "Slim, beautiful cover, and the paper doesn’t feel cheap. COD was easy.",
    date: "18 May 2026",
    city: "Islamabad",
  },
  {
    id: "r6",
    bookId: "namal",
    author: "Maham T.",
    rating: 5,
    title: "Worth every rupee",
    body: "Thick volume, well packed. My go-to shop for Urdu novels now.",
    date: "2 Sep 2026",
    city: "Karachi",
  },
];

export function getReviewsForBook(bookId: string) {
  const found = reviews.filter((r) => r.bookId === bookId);
  if (found.length) return found;
  return [
    {
      id: `gen-${bookId}-1`,
      bookId,
      author: "Hira N.",
      rating: 5,
      title: "Beautifully packed",
      body: "Came wrapped with a Safha bookmark. Delivery across Karachi was prompt.",
      date: "14 Aug 2026",
      city: "Karachi",
    },
    {
      id: `gen-${bookId}-2`,
      bookId,
      author: "Usman J.",
      rating: 4,
      title: "Good print, honest pricing",
      body: "PKR pricing is fair compared to mall bookshops. Will order again.",
      date: "29 Jul 2026",
      city: "Hyderabad",
    },
  ];
}
