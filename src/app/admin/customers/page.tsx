import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const users = await (async () => {
    try {
      return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: {
          _count: { select: { orders: true } },
        },
      });
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[#1e140d]">Customers</h2>
        <p className="text-sm text-[#7c6652] mt-1">Registered accounts synced from checkout and auth.</p>
      </div>

      <div className="rounded-xl border border-[#eadfd5] bg-white overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f8f5f2] text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eadfd5]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No customer accounts yet.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-[#fdf8f4]">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {u.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{u.name ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.role}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders?q=${encodeURIComponent(u.email)}`}
                      className="text-[var(--admin-primary)] hover:underline font-medium"
                    >
                      {u._count.orders}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
