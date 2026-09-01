import type { MetadataRoute } from "next";
import { getPosts, SLUG_ALIASES } from "@/lib/blog";

const BASE = "https://negiadventures.github.io";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  // Alias URLs are what the old sitemap listed, so keep listing those.
  const aliasOf = new Map(Object.entries(SLUG_ALIASES).map(([a, s]) => [s, a]));

  return [
    { url: `${BASE}/`, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), priority: 0.8 },
    ...posts.map((p) => ({
      url: `${BASE}/blog/${aliasOf.get(p.slug) ?? p.slug}.html`,
      lastModified: new Date(p.date),
      priority: 0.6,
    })),
  ];
}
