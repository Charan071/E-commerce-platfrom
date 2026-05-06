import { createClient } from "@/lib/supabase/server";

type AuthClaims = {
  sub?: string;
  email?: string;
  app_metadata?: unknown;
};

export type AuthContext = {
  userId: string;
  email?: string;
  isAdmin: boolean;
};

function normalizeRole(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : undefined;
}

function getAppMetadataValue(appMetadata: unknown, key: "role" | "roles") {
  if (!appMetadata || typeof appMetadata !== "object") return undefined;
  return (appMetadata as Record<string, unknown>)[key];
}

function hasAdminRole(appMetadata: unknown) {
  const role = normalizeRole(getAppMetadataValue(appMetadata, "role"));
  if (role === "admin") return true;

  const roles = getAppMetadataValue(appMetadata, "roles");
  if (!Array.isArray(roles)) return false;

  return roles.some((value) => normalizeRole(value) === "admin");
}

export function claimsAreAdmin(claims: AuthClaims | null | undefined) {
  return hasAdminRole(claims?.app_metadata);
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  const userId = data?.claims?.sub;
  if (error || !userId) return null;

  const claims = data.claims as AuthClaims;

  return {
    userId,
    email: claims.email,
    isAdmin: claimsAreAdmin(claims),
  };
}

export async function requireAdmin() {
  const auth = await getAuthContext();
  return auth?.isAdmin ? auth : null;
}
