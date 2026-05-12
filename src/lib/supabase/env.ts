/** Trimmed Supabase browser keys; both required for SSR auth client. */
export function getSupabasePublishableEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
}
