import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Filter,
  MoreVertical,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatTime,
  getAdminOrders,
  getTextFilter,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  toSearchParams,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const data = await getAdminOrders(params);
  const queryParams = toSearchParams(params);
  const selectedStatus = getTextFilter(params, "status") ?? "";
  const selectedPayment = getTextFilter(params, "paymentStatus") ?? "";
  const q = getTextFilter(params, "q") ?? "";
  const { page, limit, total, totalPages } = data.pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard
          label="Total Orders"
          value={formatCompactNumber(data.metrics.total)}
          detail={`${formatCompactNumber(data.metrics.ordersLast30Days)} in last 30 days`}
          icon={ShoppingBag}
          tone="brand"
        />
        <AdminMetricCard
          label="Pending"
          value={formatCompactNumber(data.metrics.pending)}
          icon={Clock3}
          tone="amber"
        />
        <AdminMetricCard
          label="Processing"
          value={formatCompactNumber(data.metrics.processing)}
          icon={Truck}
          tone="green"
        />
        <AdminMetricCard
          label="Shipped"
          value={formatCompactNumber(data.metrics.shipped)}
          icon={PackageCheck}
          tone="blue"
        />
        <AdminMetricCard
          label="Delivered"
          value={formatCompactNumber(data.metrics.delivered)}
          icon={CheckCircle2}
          tone="purple"
        />
      </section>

      <section className="rounded-lg border border-[#eadfd5] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#eadfd5] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-serif text-2xl text-gray-950">All Orders</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-[#e5d8cc] px-4 text-sm font-medium text-[#6b5040] hover:bg-[#f5ede3] transition-colors"
            >
              <Download size={16} />
              Export
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--admin-primary)] px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              Add Order
            </button>
          </div>
        </div>

        <form className="grid gap-3 border-b border-[#eadfd5] px-5 py-4 md:grid-cols-2 xl:grid-cols-[190px_180px_220px_1fr_auto_auto]">
          <label className="flex h-10 items-center gap-2 rounded-md border border-[#eadfd5] bg-white px-3 text-sm text-gray-500">
            <CalendarDays size={16} className="text-gray-500" />
            <span className="truncate">Select Date Range</span>
          </label>

          <select
            name="status"
            defaultValue={selectedStatus}
            className="h-10 rounded-md border border-[#eadfd5] bg-white px-3 text-sm text-gray-700 outline-none"
          >
            <option value="">All Status</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <select
            name="paymentStatus"
            defaultValue={selectedPayment}
            className="h-10 rounded-md border border-[#eadfd5] bg-white px-3 text-sm text-gray-700 outline-none"
          >
            <option value="">All Payment Methods</option>
            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <label className="flex h-10 items-center gap-2 rounded-md border border-[#eadfd5] bg-white px-3 text-sm text-gray-500">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by order ID, customer..."
              className="min-w-0 flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
            />
            <Search size={16} className="text-gray-600" />
          </label>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#e5d8cc] px-4 text-sm font-medium text-[#6b5040] hover:bg-[#f5ede3] transition-colors"
          >
            <Filter size={16} />
            Filters
          </button>
          <Link
            href="/admin/orders"
            className="inline-flex h-10 items-center justify-center px-3 text-sm font-medium text-[var(--admin-primary)]"
          >
            Reset
          </Link>
        </form>

        <div className="overflow-x-auto px-5 py-4">
          <table className="w-full min-w-[980px] border-separate border-spacing-0 overflow-hidden rounded-lg border border-[#eadfd5] text-sm">
            <thead className="bg-[#fbf6f1] text-left text-xs uppercase tracking-wide text-gray-700">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d9c7b8]" aria-label="Select all orders" />
                </th>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eadfd5] bg-white">
              {data.orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fffaf6]">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#d9c7b8]" aria-label={`Select order ${order.orderNumber}`} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">#{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-950">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                    <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge value={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{order.paymentMethod}</p>
                    <p className="text-xs text-gray-500">{order.paymentStatus.replaceAll("_", " ")}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {order.itemCount} {order.itemCount === 1 ? "Item" : "Items"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-[#eadfd5] px-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
                      >
                        <Eye size={15} />
                        View
                      </button>
                      <button type="button" className="p-2 text-gray-600 hover:text-gray-950" aria-label="More actions">
                        <MoreVertical size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.orders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    No orders match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-5 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <p>
            Showing {from} to {to} of {formatCompactNumber(total)} orders
          </p>
          <AdminPagination basePath="/admin/orders" page={page} totalPages={totalPages} params={queryParams} />
        </div>
      </section>
    </div>
  );
}
