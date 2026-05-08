import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const rows = await (async () => {
    try {
      return await prisma.newsletterSubscription.findMany({
        orderBy: { createdAt: "desc" },
        take: 500,
      });
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Newsletter subscribers</h2>
        <p className="text-sm text-gray-500 mt-1">
          Emails captured from the storefront signup forms ({rows.length} total).
        </p>
      </div>

      <div className="rounded-xl border border-[#eadfd5] bg-white overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f8f5f2] text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Subscribed</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eadfd5]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-gray-500">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {row.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-900">{row.email}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{row.source}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
