import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey, isConfigured } = getSupabasePublishableEnv();
  if (!isConfigured) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
  }

  return createServerClient(url, anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — cookies are read-only, safe to ignore
          }
        },
      },
    }
  );
}

/** Service role client — bypasses RLS. Use only in trusted server contexts. */
export async function createAdminClient() {
  const cookieStore = await cookies();
  const { url, isConfigured } = getSupabasePublishableEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  if (!isConfigured || !serviceKey) {
    throw new Error("Supabase admin client requires URL, anon key, and SUPABASE_SERVICE_ROLE_KEY");
  }

  return createServerClient(
    url,
    serviceKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
