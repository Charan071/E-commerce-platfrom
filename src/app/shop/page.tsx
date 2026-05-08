import { getAuthContext } from "@/lib/auth";
import { getCatalogFilters, getCatalogProducts } from "@/lib/catalog";
import { getWishlistProductIdsForUser } from "@/lib/wishlist-server";
import { ShopClient } from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, filters, auth] = await Promise.all([
    getCatalogProducts(),
    getCatalogFilters(),
    getAuthContext(),
  ]);
  const wishlistedProductIds = auth ? [...(await getWishlistProductIdsForUser(auth.userId))] : [];

  return (
    <ShopClient
      products={products}
      categories={filters.categories}
      fabrics={filters.fabrics}
      wishlistedProductIds={wishlistedProductIds}
    />
  );
}
