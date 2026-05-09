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
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard
          label="Revenue"
          value={formatCurrency(data.metrics.revenue)}
          detail="+12.4% this month"
          icon={WalletCards}
          tone="brand"
        />
        <AdminMetricCard
          label="Total Orders"
          value={formatCompactNumber(data.metrics.orders)}
          detail={`${formatCompactNumber(data.metrics.pendingOrders)} pending`}
          icon={ShoppingBag}
          tone="amber"
        />
        <AdminMetricCard
          label="Products"
          value={formatCompactNumber(data.metrics.activeProducts)}
          detail="Active catalog"
          icon={Package}
          tone="blue"
        />
        <AdminMetricCard
          label="Customers"
          value={formatCompactNumber(data.metrics.customers)}
          detail="+34 this month"
          icon={Users}
          tone="green"
        />
        <AdminMetricCard
          label="Fulfillment"
          value="94%"
          detail="On-time dispatch"
          icon={CheckCircle2}
          tone="purple"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-[#eadfd5] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[#1e140d]">Sales Overview</h2>
              <p className="mt-1 text-sm text-gray-500">Revenue across the last seven days</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--admin-primary)]"
            >
              Orders
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="mt-6 flex h-72 items-end gap-3 rounded-lg border border-[#eadfd5] bg-[#fffaf6] px-4 py-5">
            {data.salesSeries.map((item) => (
              <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div className="flex min-h-0 flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[var(--admin-primary)] to-[var(--admin-accent)]"
                    style={{ height: `${Math.max(8, (item.value / maxSales) * 100)}%` }}
                    title={formatCurrency(item.value)}
                  />
                </div>
                <p className="text-center text-xs font-medium text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#eadfd5] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#1e140d]">Category Mix</h2>
            <Link href="/admin/categories" className="text-sm font-medium text-[var(--admin-primary)]">
              Manage
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {data.categoryBreakdown.map((category) => (
              <div key={category.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{category.name}</span>
                  <span className="text-gray-500">{category.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f3e7dc]">
                  <div
                    className="h-2 rounded-full bg-[var(--admin-primary)]"
                    style={{ width: `${Math.max(6, (category.count / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {data.categoryBreakdown.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No categories yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="rounded-lg border border-[#eadfd5] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eadfd5] px-5 py-4">
            <h2 className="font-serif text-2xl text-[#1e140d]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-[var(--admin-primary)]">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto p-5">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eadfd5]">
                {data.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-semibold text-gray-950">#{order.orderNumber}</td>
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="py-3">
                      <AdminStatusBadge value={order.status} />
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-950">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      No recent orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-[#eadfd5] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eadfd5] px-5 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-600" />
              <h2 className="font-serif text-2xl text-[#1e140d]">Stock Alerts</h2>
            </div>
            <Link
              href="/admin/products?status=LOW_STOCK"
              className="text-sm font-medium text-[var(--admin-primary)]"
            >
              Resolve
            </Link>
          </div>
          <div className="divide-y divide-[#eadfd5] p-5 pt-0">
            {data.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 py-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#f5eee7]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-950">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-950">{product.stock}</p>
                  <p className="text-xs text-gray-500">left</p>
                </div>
              </div>
            ))}
            {data.lowStockProducts.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-500">No low stock items.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
