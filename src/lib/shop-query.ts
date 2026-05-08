import type { Product } from "@/lib/mock-data";

export type ShopSortOption = "featured" | "newest" | "price-asc" | "price-desc";

export function parseShopSortParam(value: string | null | undefined): ShopSortOption {
  if (value === "newest" || value === "price-asc" || value === "price-desc" || value === "featured") {
    return value;
  }
  return "featured";
}

export type ShopFilterInput = {
  query: string;
  category: string;
  /** Category display names matching `product.category` */
  fabrics: string[];
};

function normalizeQuery(q: string) {
  return q.trim().toLowerCase();
}

export function productMatchesQuery(product: Product, query: string) {
  const q = normalizeQuery(query);
  if (!q) return true;
  return (
    product.title.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    product.material.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q)
  );
}

export function productMatchesCategory(product: Product, selectedCategory: string) {
  if (!selectedCategory || selectedCategory === "All Sarees") return true;
  return product.category === selectedCategory;
}

export function productMatchesFabrics(product: Product, selectedFabrics: string[]) {
  if (selectedFabrics.length === 0) return true;
  return selectedFabrics.includes(product.material);
}

export function filterShopProducts(products: Product[], filters: ShopFilterInput) {
  return products.filter(
    (product) =>
      productMatchesQuery(product, filters.query) &&
      productMatchesCategory(product, filters.category) &&
      productMatchesFabrics(product, filters.fabrics)
  );
}

export function sortShopProducts(products: Product[], sort: ShopSortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => (a.price !== b.price ? a.price - b.price : a.title.localeCompare(b.title)));
    case "price-desc":
      return copy.sort((a, b) => (a.price !== b.price ? b.price - a.price : a.title.localeCompare(b.title)));
    case "newest":
    case "featured":
    default:
      return copy;
  }
}

export function applyShopFiltersAndSort(
  products: Product[],
  filters: ShopFilterInput,
  sort: ShopSortOption
) {
  return sortShopProducts(filterShopProducts(products, filters), sort);
}
