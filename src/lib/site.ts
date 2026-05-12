/** Canonical site URL for metadata, robots, and Open Graph (set in production). */
export function getSiteUrl(): URL | undefined {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  if (!raw) return undefined;
  const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
  try {
    const u = new URL(normalized);
    // Use origin only so values like https://example.com/ don't become a path-heavy metadata base.
    return new URL(u.origin);
  } catch {
    return undefined;
  }
}
