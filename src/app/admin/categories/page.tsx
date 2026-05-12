import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await (async () => {
    try {
      return await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: { where: { isActive: true } } } } },
      });
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-black">Categories</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Used for shop filters and navigation. Slug is auto-generated from the name.
        </p>
      </div>

      {/* Add form */}
      <form action={createCategory} className="flex gap-3 items-center">
        <input
          name="name"
          required
          placeholder="New category name — e.g. Kanjeevaram"
          className="flex-1 h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm text-black placeholder:text-neutral-400 outline-none focus:border-black transition"
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-md bg-black px-4 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
        >
          Add category
        </button>
      </form>

      {/* List */}
      <div className="rounded-lg border border-neutral-100 bg-white overflow-hidden">
        {categories.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-400">
            No categories yet — add one above.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-left">
              <tr>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Name</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Slug</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 text-right">Products</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {categories.map((cat) => {
                const hasProducts = cat._count.products > 0;
                return (
                  <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-black">{cat.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-neutral-400">{cat.slug}</td>
                    <td className="px-5 py-3.5 text-right">
                      {hasProducts ? (
                        <Link
                          href={`/admin/products?category=${encodeURIComponent(cat.slug)}`}
                          className="text-sm font-medium text-black hover:underline"
                          title="View these products"
                        >
                          {cat._count.products}
                        </Link>
                      ) : (
                        <span className="text-sm text-neutral-300">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {hasProducts ? (
                        <span
                          className="text-xs text-neutral-300 cursor-default"
                          title="Move or delete all products in this category first"
                        >
                          Delete
                        </span>
                      ) : (
                        <form
                          action={async (formData) => {
                            "use server";
                            const id = formData.get("id");
                            if (typeof id === "string") await deleteCategory(id);
                          }}
                        >
                          <input type="hidden" name="id" value={cat.id} />
                          <button
                            type="submit"
                            className="text-xs font-medium text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-neutral-400">
        To delete a category that has products, go to{" "}
        <Link href="/admin/products" className="underline hover:text-black transition-colors">
          Inventory
        </Link>{" "}
        and reassign or remove the products first.
      </p>
    </div>
  );
}
