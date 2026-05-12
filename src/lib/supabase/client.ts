import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, anonKey, isConfigured } = getSupabasePublishableEnv();
  if (!isConfigured) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
  }
  return createBrowserClient(url, anonKey);
}
