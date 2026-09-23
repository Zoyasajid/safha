import type { MetadataRoute } from "next";
import { books } from "@/data/books";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/categories",
    "/authors",
    "/deals",
    "/urdu",
    "/english",
    "/novels",
    "/self-help",
    "/contact",
    "/shipping",
    "/returns",
  ].map((path) => ({
    url: `https://safha.pk${path}`,
    lastModified: new Date(),
  }));
  const bookRoutes = books.map((b) => ({
    url: `https://safha.pk/books/${b.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...bookRoutes];
}
