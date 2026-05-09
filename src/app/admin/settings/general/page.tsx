import Link from "next/link";
import { getSiteUrl } from "@/lib/site";

export default function AdminGeneralSettingsPage() {
  const site = getSiteUrl();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-serif text-2xl text-[#1e140d]">General</h2>
        <p className="text-sm text-[#7c6652] mt-1">
          Store identity and URLs. Brand colors and name are edited in Content Studio.
        </p>
      </div>

      <div className="rounded-xl border border-[#eadfd5] bg-white p-5 space-y-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Canonical site URL</p>
          <p className="mt-1 font-mono text-gray-900">{site?.origin ?? "—"}</p>
          {!site ? (
            <p className="mt-2 text-amber-800 text-xs">
              Set <code className="bg-amber-50 px-1">NEXT_PUBLIC_SITE_URL</code> for sitemap, metadata, and
              Open Graph.
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Brand kit</p>
          <p className="mt-1 text-gray-700">
            Manage name, tagline, colors, and homepage blocks in{" "}
            <Link href="/admin/content" className="text-[var(--admin-primary)] font-medium hover:underline">
              Content Studio
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
