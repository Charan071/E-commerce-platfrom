import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/admin/products/actions";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";

export const dynamic = "force-dynamic";

export default async function AdminProductCreatePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#1e140d]">Add Product</h2>
          <p className="mt-1 text-sm text-[#7c6652]">Create a product for storefront and inventory management.</p>
        </div>
        <Link href="/admin/products" className="text-sm font-medium text-[var(--admin-primary)] hover:opacity-75 transition-opacity">
          Back to products
        </Link>
      </div>

      <ProductEditorForm
        action={createProduct}
        submitLabel="Create product"
        categories={categories}
        initialValues={{
          title: "",
          slug: "",
          description: "",
          price: "",
          originalPrice: "",
          stock: "0",
          discount: "",
          categoryId: "",
          material: "",
          images: [],
          isNew: false,
        }}
      />
    </div>
  );
}
