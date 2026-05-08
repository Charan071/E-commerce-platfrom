import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

function normalizeEmail(email: string | null | undefined) {
  if (!email) return null;
  const value = email.trim().toLowerCase();
  return value.length > 0 ? value : null;
}

export async function ensureAppUser(supabaseUser: SupabaseUser) {
  const email = normalizeEmail(supabaseUser.email);
  if (!email) return null;

  const fullName = typeof supabaseUser.user_metadata?.full_name === "string"
    ? supabaseUser.user_metadata.full_name
    : null;

  const displayName = typeof supabaseUser.user_metadata?.name === "string"
    ? supabaseUser.user_metadata.name
    : null;

  const name = fullName ?? displayName ?? null;

  return prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: { email, ...(name ? { name } : {}) },
    create: { id: supabaseUser.id, email, ...(name ? { name } : {}) },
  });
}
