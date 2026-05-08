import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import { getWishlistProductIdsForUser } from "@/lib/wishlist-server";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getCatalogProduct(id);

  if (!product) {
    notFound();
  }

  const [products, auth] = await Promise.all([getCatalogProducts(), getAuthContext()]);
  const wishlisted = auth ? await getWishlistProductIdsForUser(auth.userId) : new Set<string>();
  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      initiallyWishlisted={wishlisted.has(product.id)}
      wishlistedProductIds={[...wishlisted]}
    />
  );
}
