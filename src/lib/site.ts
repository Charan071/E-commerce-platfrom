/** Canonical site URL for metadata, robots, and Open Graph (set in production). */
export function getSiteUrl(): URL | undefined {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  if (!raw?.trim()) return undefined;
  const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
  try {
    return new URL(normalized);
  } catch {
    return undefined;
  }
}
