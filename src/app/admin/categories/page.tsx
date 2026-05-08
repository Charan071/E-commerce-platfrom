import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await (async () => {
    try {
      return await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      });
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
        <p className="text-sm text-gray-500 mt-1">
          Taxonomy used on the shop filters and navigation. Slugs are generated from the name.
        </p>
      </div>

      <form
        action={createCategory}
        className="rounded-xl border border-[#eadfd5] bg-white p-4 flex flex-col sm:flex-row gap-3 sm:items-end max-w-xl"
      >
        <div className="flex-1">
          <label htmlFor="cat-name" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            New category name
          </label>
          <input
            id="cat-name"
            name="name"
            required
            placeholder="e.g. Kanjeevaram"
            className="mt-1 w-full rounded-md border border-[#eadfd5] px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-[var(--admin-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add category
        </button>
      </form>

      <div className="rounded-xl border border-[#eadfd5] bg-white overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f8f5f2] text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eadfd5]">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                  No categories yet. Add one above or run <code className="text-xs">npm run seed</code>.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{cat._count.products}</td>
                  <td className="px-4 py-3">
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
                        disabled={cat._count.products > 0}
                        className="text-xs font-medium text-red-700 hover:text-red-900 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </form>
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
