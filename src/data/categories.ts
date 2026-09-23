import type { CategorySlug } from "@/types";

export const categories: {
  slug: CategorySlug;
  name: string;
  nameUrdu?: string;
  description: string;
  href: string;
}[] = [
  {
    slug: "urdu",
    name: "Urdu Books",
    nameUrdu: "اردو کتب",
    description: "Novels, essays, and classics in the language of the heart.",
    href: "/urdu",
  },
  {
    slug: "english",
    name: "English Books",
    description: "International fiction, ideas, and contemporary non-fiction.",
    href: "/english",
  },
  {
    slug: "novels",
    name: "Novels",
    description: "Immersive stories from Pakistan and around the world.",
    href: "/novels",
  },
  {
    slug: "self-help",
    name: "Self-Help",
    description: "Habits, money, mindset, and practical growth.",
    href: "/self-help",
  },
  {
    slug: "fiction",
    name: "Fiction",
    description: "Literary and popular fiction for long Karachi evenings.",
    href: "/categories/fiction",
  },
  {
    slug: "poetry",
    name: "Poetry",
    description: "Verse that lingers — ghazals, nazms, and modern collections.",
    href: "/categories/poetry",
  },
  {
    slug: "history",
    name: "History",
    description: "Civilisations, nations, and the stories that shaped us.",
    href: "/categories/history",
  },
  {
    slug: "business",
    name: "Business",
    description: "Wealth, work, and the behaviour behind better decisions.",
    href: "/categories/business",
  },
  {
    slug: "islamic",
    name: "Islamic",
    description: "Faith, reflection, and spiritual literature.",
    href: "/categories/islamic",
  },
  {
    slug: "biography",
    name: "Biography",
    description: "Lives of writers, leaders, and thinkers.",
    href: "/categories/biography",
  },
];
