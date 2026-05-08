import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  if (!base) return [];

  const now = new Date();

  return [
    { url: base.origin, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base.origin}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];
}
