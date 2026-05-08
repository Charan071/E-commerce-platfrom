"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import {
  applyShopFiltersAndSort,
  parseShopSortParam,
  type ShopSortOption,
} from "@/lib/shop-query";

type ShopClientProps = {
  products: Product[];
  categories: string[];
  fabrics: string[];
  wishlistedProductIds: string[];
};

function readFabricList(raw: string | null) {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ShopClient({ products, categories, fabrics, wishlistedProductIds }: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const wishSet = useMemo(() => new Set(wishlistedProductIds), [wishlistedProductIds]);

  const query = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const selectedCategory =
    categoryParam && categories.includes(categoryParam) ? categoryParam : "All Sarees";
  const sort: ShopSortOption = parseShopSortParam(searchParams.get("sort"));
  const selectedFabrics = readFabricList(searchParams.get("fabric"));

  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const filteredProducts = useMemo(
    () =>
      applyShopFiltersAndSort(
        products,
        { query, category: selectedCategory, fabrics: selectedFabrics },
        sort
      ),
    [products, query, selectedCategory, selectedFabrics, sort]
  );

  function toggleFabric(fabric: string) {
    const set = new Set(selectedFabrics);
    if (set.has(fabric)) set.delete(fabric);
    else set.add(fabric);
    const value = Array.from(set).join(",");
    updateQuery({ fabric: value || null });
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-text-muted flex items-center gap-2 border-b border-gray-200">
        <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text">Shop</span>
        {query ? (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text truncate max-w-[12rem]">&ldquo;{query}&rdquo;</span>
          </>
        ) : null}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:hidden w-full flex justify-between items-center mb-4">
            <h1 className="text-2xl font-serif">All Products</h1>
            <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <aside
            className={`w-full md:w-64 flex-shrink-0 ${mobileFiltersOpen ? "block" : "hidden md:block"}`}
          >
            <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24 border border-neutral-100">
              <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-text mb-6">Filter By</h2>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-sm text-text">Categories</h3>
                  <ChevronDown className="w-4 h-4 text-text-muted" aria-hidden />
                </div>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() =>
                          updateQuery({
                            category: category === "All Sarees" ? null : category,
                          })
                        }
                        className="w-4 h-4 text-[var(--color-text)] bg-gray-100 border-gray-300 focus:ring-[var(--color-accent)]"
                      />
                      <span
                        className={`text-sm group-hover:text-[var(--color-text)] transition-colors ${
                          selectedCategory === category ? "text-[var(--color-text)] font-medium" : "text-text-muted"
                        }`}
                      >
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-sm text-text">Fabric</h3>
                  <ChevronDown className="w-4 h-4 text-text-muted" aria-hidden />
                </div>
                <div className="space-y-3">
                  {fabrics.map((fabric) => (
                    <label key={fabric} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFabrics.includes(fabric)}
                        onChange={() => toggleFabric(fabric)}
                        className="w-4 h-4 rounded-sm text-[var(--color-text)] bg-gray-100 border-gray-300 focus:ring-[var(--color-accent)]"
                      />
                      <span className="text-sm text-text-muted group-hover:text-[var(--color-text)] transition-colors">
                        {fabric}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                fullWidth
                className="mt-4"
                onClick={() => {
                  updateQuery({ category: null, fabric: null, q: null, sort: null });
                  setMobileFiltersOpen(false);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          <div className="flex-grow w-full min-w-0">
            <div className="hidden md:flex justify-between items-end mb-8">
              <div>
                <h1 className="text-4xl font-serif text-text mb-2">Shop All Products</h1>
                <p className="text-text-muted text-sm">
                  Discover our complete collection — refine by category, fabric, or search.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 text-sm text-text-muted">
              <span className={isPending ? "opacity-70" : ""}>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-sm">
                <label htmlFor="shop-sort" className="shrink-0">
                  Sort by:
                </label>
                <select
                  id="shop-sort"
                  value={sort}
                  onChange={(e) =>
                    updateQuery({
                      sort: e.target.value === "featured" ? null : e.target.value,
                    })
                  }
                  className="bg-transparent font-medium text-text outline-none cursor-pointer min-w-[10rem]"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  initiallyWishlisted={wishSet.has(product.id)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="rounded-sm border border-dashed border-gray-300 bg-white py-14 text-center px-4">
                <h2 className="font-serif text-2xl text-text">No products match</h2>
                <p className="mt-2 text-sm text-text-muted">Try another search or reset filters.</p>
                <Button className="mt-6" onClick={() => updateQuery({ category: null, fabric: null, q: null })}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
