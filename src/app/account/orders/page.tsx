import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/admin-data";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/login?redirectTo=/account/orders");

  let orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: unknown;
    createdAt: Date;
    items: Array<{ id: string; title: string; quantity: number }>;
  }> = [];

  try {
    orders = await prisma.order.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { select: { id: true, title: true, quantity: true } },
      },
    });
  } catch {
    orders = [];
  }

  return (
    <section className="rounded-2xl border border-[#eadfd5] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#eadfd5] px-6 py-4">
        <h2 className="font-serif text-2xl text-text">Orders</h2>
        <Link href="/shop" className="text-sm font-medium text-primary hover:text-primary/80">
          Continue shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Package size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-text">No orders yet</h3>
          <p className="mt-1 max-w-sm text-sm text-text/60">
            When you place your first order, it will show up here with status and tracking.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-text/60">
              <tr>
                <th className="px-6 py-3 font-semibold">Order</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Items</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eadfd5]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface/60">
                  <td className="px-6 py-4 font-semibold text-text">#{order.orderNumber}</td>
                  <td className="px-6 py-4 text-text/70">{formatDate(order.createdAt.toISOString())}</td>
                  <td className="px-6 py-4 text-text/70">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge value={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-text">
                    {formatCurrency(Number(order.total))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
