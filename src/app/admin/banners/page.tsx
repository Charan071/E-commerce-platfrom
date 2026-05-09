import Link from "next/link";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-serif text-2xl text-[#1e140d]">Banners &amp; highlights</h2>
        <p className="text-sm text-[#7c6652] mt-1">
          Homepage visual blocks and featured collection tiles are managed as structured content, not separate
          banner records.
        </p>
      </div>
      <div className="rounded-xl border border-[#eadfd5] bg-white p-5 text-sm text-gray-700 space-y-3">
        <p>Edit hero imagery, featured collection cards, and nav promo tiles in Content Studio.</p>
        <Link
          href="/admin/content"
          className="inline-flex rounded-md bg-[var(--admin-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Open Content Studio
        </Link>
      </div>
    </div>
  );
}
