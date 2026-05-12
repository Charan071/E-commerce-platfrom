import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Box,
  Edit3,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { ProductCsvImport } from "@/components/admin/ProductCsvImport";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { deleteProduct } from "@/app/admin/products/actions";
import {
  formatCompactNumber,
  formatCurrency,
  getAdminProducts,
  getTextFilter,
  PRODUCT_STATUSES,
  toSearchParams,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const data = await getAdminProducts(params);
  const queryParams = toSearchParams(params);
  const q = getTextFilter(params, "q") ?? "";
  const category = getTextFilter(params, "category") ?? "";
  const material = getTextFilter(params, "material") ?? "";
  const status = getTextFilter(params, "status") ?? "";
  const { page, limit, total, totalPages } = data.pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard
          label="Total Products"
          value={formatCompactNumber(data.metrics.total)}
          detail={`${formatCompactNumber(data.metrics.productsCreatedLast30Days)} added in last 30 days`}
          icon={Package}
          tone="brand"
        />
        <AdminMetricCard
          label="Total Categories"
          value={formatCompactNumber(data.metrics.categories)}
          detail={`${formatCompactNumber(data.metrics.categoriesCreatedLast30Days)} added in last 30 days`}
          icon={Box}
          tone="amber"
        />
        <AdminMetricCard
          label="Low Stock Items"
          value={formatCompactNumber(data.metrics.lowStock)}
          detail="Stock 1–5 units"
          icon={Package}
          tone="brand"
        />
        <AdminMetricCard
          label="Out of Stock"
          value={formatCompactNumber(data.metrics.outOfStock)}
          detail="Stock 0"
          icon={Tag}
          tone="amber"
        />
        <AdminMetricCard
          label="Total Value"
          value={formatCurrency(data.metrics.totalValue)}
          detail="Inventory value"
          icon={BarChart3}
          tone="brand"
        />
      </section>

      <section className="rounded-lg border border-[#eadfd5] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#eadfd5] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-serif text-2xl text-gray-950">All Products</h2>
          <div className="flex flex-wrap items-start gap-3">
            <ProductCsvImport
              disabled={data.source === "sample"}
              disabledReason="Database catalog is unavailable. Connect your database to import CSV files."
            />
            <Link
              href="/admin/products/new"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--admin-primary)] px-4 text-sm font-medium text-white shadow-sm hover:opacity-90"
            >
              <Plus size={16} />
              Add New Product
            </Link>
          </div>
        </div>

        {data.source === "sample" && (
          <div className="mx-5 mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Product data is currently in sample fallback mode. Connect database tables to enable persistent create,
            edit, and delete behavior.
          </div>
        )}

        <form className="grid gap-3 border-b border-[#eadfd5] px-5 py-4 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_170px_170px_170px_auto_auto]">
          <label className="flex h-10 items-center gap-2 rounded-md border border-[#eadfd5] bg-white px-3 text-sm text-gray-500">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by product name, SKU, fabric..."
              className="min-w-0 flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
            />
            <Search size={16} className="text-gray-600" />
          </label>

          <select
            name="category"
            defaultValue={category}
            className="h-10 rounded-md border border-[#eadfd5] bg-white px-3 text-sm text-gray-700 outline-none"
          >
            <option value="">All Categories</option>
            {data.categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            name="material"
            defaultValue={material}
            className="h-10 rounded-md border border-[#eadfd5] bg-white px-3 text-sm text-gray-700 outline-none"
          >
            <option value="">All Fabrics</option>
            {data.materials.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={status}
            className="h-10 rounded-md border border-[#eadfd5] bg-white px-3 text-sm text-gray-700 outline-none"
          >
            <option value="">All Status</option>
            {PRODUCT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#e5d8cc] px-4 text-sm font-medium text-[#6b5040] hover:bg-[#f5ede3] transition-colors"
          >
            <Filter size={16} />
            Filters
          </button>
          <Link
            href="/admin/products"
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
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d9c7b8]" aria-label="Select all products" />
                </th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Fabric</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eadfd5] bg-white">
              {data.products.map((product) => (
                <tr key={product.id} className="hover:bg-[#fffaf6]">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#d9c7b8]" aria-label={`Select product ${product.title}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#f5eee7]">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[250px] font-semibold text-gray-950">{product.title}</p>
                        <p className="text-xs text-gray-500">{product.material}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{product.sku}</td>
                  <td className="px-4 py-3 text-gray-700">{product.category}</td>
                  <td className="px-4 py-3 text-gray-700">{product.material}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-gray-900">{product.stock}</td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge value={product.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="text-gray-700 hover:text-[var(--admin-primary)]"
                        aria-label="View product"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-gray-700 hover:text-[var(--admin-primary)]"
                        aria-label="Edit product"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <button
                          type="submit"
                          className="text-[var(--admin-primary)] hover:opacity-80"
                          aria-label="Delete product"
                          title="Soft delete (deactivate)"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {data.products.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    No products match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-5 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <p>
            Showing {from} to {to} of {formatCompactNumber(total)} products
          </p>
          <AdminPagination basePath="/admin/products" page={page} totalPages={totalPages} params={queryParams} />
        </div>
      </section>
    </div>
  );
}
