import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

type AuthClaims = {
  sub?: string;
  email?: string;
  app_metadata?: unknown;
  user_metadata?: unknown;
  aal?: string;
  amr?: unknown;
};

export type AuthContext = {
  userId: string;
  email?: string;
  name?: string;
  isAdmin: boolean;
  hasMfa: boolean;
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

export function claimsHaveMfa(claims: AuthClaims | null | undefined) {
  if (!claims) return false;
  if (claims.aal === "aal2") return true;
  if (!Array.isArray(claims.amr)) return false;
  return claims.amr.some((factor) => {
    if (!factor || typeof factor !== "object") return false;
    const method = (factor as Record<string, unknown>).method;
    return (
      typeof method === "string" &&
      ["totp", "otp", "sms", "webauthn"].includes(method.toLowerCase())
    );
  });
}

function pickStringMetadata(metadata: unknown, keys: string[]) {
  if (!metadata || typeof metadata !== "object") return undefined;
  const record = metadata as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

export async function getAuthContext(): Promise<AuthContext | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    const userId = data?.claims?.sub;
    if (error || !userId) return null;

    const claims = data.claims as AuthClaims;

    return {
      userId,
      email: claims.email,
      name: pickStringMetadata(claims.user_metadata, ["full_name", "name"]),
      isAdmin: claimsAreAdmin(claims),
      hasMfa: claimsHaveMfa(claims),
    };
  } catch {
    return null;
  }
}

export async function isAdminFromDatabase(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const auth = await getAuthContext();
  if (!auth) return null;

  const jwtAdmin = auth.isAdmin;
  const dbAdmin = jwtAdmin ? true : await isAdminFromDatabase(auth.userId);
  const isAdmin = jwtAdmin || dbAdmin;

  if (!isAdmin) return null;

  const requireMfa = process.env.ADMIN_REQUIRE_MFA === "true";
  if (requireMfa && !auth.hasMfa) return null;

  return {
    ...auth,
    isAdmin,
  };
}
