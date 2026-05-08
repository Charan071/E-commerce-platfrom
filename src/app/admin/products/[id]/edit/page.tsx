import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/admin/products/actions";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";

export const dynamic = "force-dynamic";

type AdminProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" }, select: { url: true, isHover: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Edit Product</h2>
          <p className="mt-1 text-sm text-gray-500">Update storefront content, pricing, and stock.</p>
        </div>
        <Link href="/admin/products" className="text-sm font-medium text-[var(--admin-primary)] hover:underline">
          Back to products
        </Link>
      </div>

      <ProductEditorForm
        action={updateProduct.bind(null, product.id)}
        submitLabel="Save changes"
        categories={categories}
        initialValues={{
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: String(Number(product.price)),
          originalPrice: product.originalPrice ? String(Number(product.originalPrice)) : "",
          stock: String(product.stock),
          discount: product.discount ?? "",
          categoryId: product.categoryId,
          material: product.material,
          images: product.images.map((img) => ({ url: img.url, isHover: img.isHover })),
          isNew: product.isNew,
        }}
      />
    </div>
  );
}
