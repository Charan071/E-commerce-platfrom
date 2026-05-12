import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Package,
  ShoppingBag,
  Users,
  WalletCards,
} from "lucide-react";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  getAdminDashboard,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  const maxSales = Math.max(...data.salesSeries.map((item) => item.value), 1);
  const maxCategory = Math.max(...data.categoryBreakdown.map((item) => item.count), 1);

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard
          label="Revenue"
          value={formatCurrency(data.metrics.revenue)}
          detail={`Last 30 days: ${formatCurrency(data.metrics.revenueLast30Days)}`}
          icon={WalletCards}
        />
        <AdminMetricCard
          label="Total Orders"
          value={formatCompactNumber(data.metrics.orders)}
          detail={`${formatCompactNumber(data.metrics.pendingOrders)} pending · ${formatCompactNumber(data.metrics.ordersLast30Days)} in last 30 days`}
          icon={ShoppingBag}
        />
        <AdminMetricCard label="Products" value={formatCompactNumber(data.metrics.activeProducts)} detail="Active in catalog" icon={Package} />
        <AdminMetricCard
          label="Customers"
          value={formatCompactNumber(data.metrics.customers)}
          detail={`${formatCompactNumber(data.metrics.customersLast30Days)} sign-ups (30d)`}
          icon={Users}
        />
        <AdminMetricCard
          label="Delivered share"
          value={data.metrics.deliveredSharePct !== null ? `${data.metrics.deliveredSharePct}%` : "—"}
          detail="Delivered orders ÷ all orders"
          icon={CheckCircle2}
        />
      </section>

      {/* Charts row */}
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-neutral-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-black">Sales Overview</h2>
              <p className="mt-0.5 text-xs text-neutral-400">Revenue across the last seven days</p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs font-medium text-black hover:opacity-60 transition-opacity">
              Orders <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="mt-5 flex h-56 items-end gap-2 rounded-md border border-neutral-100 bg-neutral-50 px-4 py-4">
            {data.salesSeries.map((item) => (
              <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div className="flex min-h-0 flex-1 items-end">
                  <div
                    className="w-full rounded-sm bg-black"
                    style={{ height: `${Math.max(6, (item.value / maxSales) * 100)}%` }}
                    title={formatCurrency(item.value)}
                  />
                </div>
                <p className="text-center text-[10px] text-neutral-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black">Category Mix</h2>
            <Link href="/admin/categories" className="text-xs font-medium text-black hover:opacity-60 transition-opacity">
              Manage
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {data.categoryBreakdown.map((category) => (
              <div key={category.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-800">{category.name}</span>
                  <span className="text-neutral-400 text-xs">{category.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-100">
                  <div
                    className="h-1.5 rounded-full bg-black"
                    style={{ width: `${Math.max(6, (category.count / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {data.categoryBreakdown.length === 0 && (
              <p className="py-8 text-center text-sm text-neutral-400">No categories yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Tables row */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="rounded-lg border border-neutral-100 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="font-semibold text-black">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-black hover:opacity-60 transition-opacity">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto p-5">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="text-left">
                <tr>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Order</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Customer</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Date</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                  <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {data.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-semibold text-black">#{order.orderNumber}</td>
                    <td className="py-3">
                      <p className="font-medium text-neutral-900">{order.customerName}</p>
                      <p className="text-xs text-neutral-400">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 text-neutral-500 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="py-3">
                      <AdminStatusBadge value={order.status} />
                    </td>
                    <td className="py-3 text-right font-semibold text-black">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-neutral-400 text-sm">
                      No recent orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-100 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-neutral-400" />
              <h2 className="font-semibold text-black">Stock Alerts</h2>
            </div>
            <Link href="/admin/products?status=LOW_STOCK" className="text-xs font-medium text-black hover:opacity-60 transition-opacity">
              Resolve
            </Link>
          </div>
          <div className="divide-y divide-neutral-50 p-5 pt-0">
            {data.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 py-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-neutral-100">
                  <Image src={product.imageUrl} alt={product.title} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-neutral-900">{product.title}</p>
                  <p className="text-xs text-neutral-400">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">{product.stock}</p>
                  <p className="text-xs text-neutral-400">left</p>
                </div>
              </div>
            ))}
            {data.lowStockProducts.length === 0 && (
              <p className="py-10 text-center text-sm text-neutral-400">No low stock items.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
