/**
 * One-off: validate merged .env + .env.local (no secret values printed).
 * Run: node scripts/check-env.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function parseEnvFile(p) {
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

function checkUrl(label, raw) {
  if (!raw) {
    console.log(`${label}: (empty)`);
    return false;
  }
  try {
    const u = new URL(raw);
    console.log(`${label}: OK — ${u.protocol}//${u.hostname}:${u.port || "default"}`);
    return true;
  } catch (e) {
    console.log(`${label}: INVALID — ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

const env = {
  ...parseEnvFile(path.join(root, ".env")),
  ...parseEnvFile(path.join(root, ".env.local")),
};

const keys = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

console.log("--- presence (.env overridden by .env.local) ---");
for (const k of keys) {
  const v = env[k];
  const status = v === undefined ? "MISSING" : v === "" ? "EMPTY" : `set (${v.length} chars)`;
  console.log(`${k}:`, status);
}

checkUrl("DATABASE_URL", env.DATABASE_URL);
checkUrl("DIRECT_URL", env.DIRECT_URL);
checkUrl("NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL);
checkUrl("NEXT_PUBLIC_SITE_URL", env.NEXT_PUBLIC_SITE_URL);

let refFromHost = "";
try {
  if (env.NEXT_PUBLIC_SUPABASE_URL) {
    refFromHost = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0] ?? "";
  }
} catch {
  refFromHost = "";
}

const userMatch = env.DATABASE_URL?.match(/postgres\.([^:]+):/);
const refFromDb = userMatch?.[1] ?? "";

console.log("\n--- cross-check ---");
console.log("Supabase ref from NEXT_PUBLIC_SUPABASE_URL:", refFromHost || "(none)");
console.log("Ref embedded in pooler username postgres.<ref>:", refFromDb || "(unparsed)");
console.log("Those match:", Boolean(refFromHost && refFromDb && refFromHost === refFromDb));

try {
  const part = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.split(".")[1];
  if (!part) throw new Error("no anon JWT");
  const pad = "=".repeat((4 - (part.length % 4)) % 4);
  const json = Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64").toString(
    "utf8"
  );
  const payload = JSON.parse(json);
  console.log("JWT ref (anon payload):", payload.ref ?? "(none)");
  console.log("JWT ref matches URL host:", payload.ref === refFromHost);
} catch (e) {
  console.log("JWT parse:", e instanceof Error ? e.message : e);
}

// Prisma CLI uses prisma.config: DIRECT_URL ?? DATABASE_URL
const prismaDatasource = env.DIRECT_URL || env.DATABASE_URL;
console.log("\nPrisma CLI datasource (DIRECT_URL ?? DATABASE_URL):", prismaDatasource ? "resolved" : "MISSING");

// Live DB ping (uses DATABASE_URL — same as runtime app)
if (env.DATABASE_URL) {
  const client = new pg.Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const r = await client.query("SELECT 1 AS ok");
    console.log("\nLive query (DATABASE_URL): OK —", r.rows[0]);
  } catch (e) {
    console.log("\nLive query (DATABASE_URL): FAILED —", e instanceof Error ? e.message : e);
  } finally {
    await client.end().catch(() => {});
  }
} else {
  console.log("\nLive query: skipped (no DATABASE_URL)");
}

const pooler = env.DATABASE_URL?.includes("pooler.supabase.com");
const hasBouncer = env.DATABASE_URL?.includes("pgbouncer=true");
if (pooler) {
  console.log(
    "\nNote: Supabase pooler + Prisma often recommends appending ?pgbouncer=true to DATABASE_URL (transaction mode)."
  );
  console.log("pgbouncer=true present:", hasBouncer);
}
