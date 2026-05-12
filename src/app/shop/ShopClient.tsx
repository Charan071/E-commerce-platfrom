"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
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

const SORT_OPTIONS: { value: ShopSortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

function readList(raw: string | null) {
  if (!raw?.trim()) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export function ShopClient({ products, categories, fabrics, wishlistedProductIds }: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const wishSet = useMemo(() => new Set(wishlistedProductIds), [wishlistedProductIds]);

  const query = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const selectedCategory =
    categoryParam && categories.includes(categoryParam) ? categoryParam : "All Sarees";
  const sort: ShopSortOption = parseShopSortParam(searchParams.get("sort"));
  const selectedFabrics = readList(searchParams.get("fabric"));

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
    updateQuery({ fabric: Array.from(set).join(",") || null });
  }

  const activeFilterCount =
    (selectedCategory !== "All Sarees" ? 1 : 0) + selectedFabrics.length + (query ? 1 : 0);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Featured";

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-3 text-xs text-neutral-500 flex items-center gap-2 border-b border-neutral-200">
        <Link href="/" className="hover:text-[var(--color-text)] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text)]">Shop</span>
        {query && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="truncate max-w-[12rem]">&ldquo;{query}&rdquo;</span>
          </>
        )}
      </div>

      {/* Page title */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-7">
        <h1 className="font-serif text-3xl text-[var(--color-text)]">
          {selectedCategory !== "All Sarees" ? selectedCategory : "All Sarees"}
        </h1>
      </div>

      {/* Filter + Sort bar */}
      <div className="sticky top-[80px] z-30 bg-[var(--color-background)] border-y border-neutral-200">
        <div className="max-w-screen-2xl mx-auto flex items-stretch h-12">
          {/* FILTERS */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2.5 px-6 text-[11px] tracking-[0.2em] uppercase font-medium border-r border-neutral-200 hover:bg-neutral-50 transition-colors shrink-0"
          >
            <SlidersHorizontal size={13} strokeWidth={1.5} />
            FILTERS
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-text)] text-[var(--color-background)] text-[9px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Center count */}
          <div className="flex-1 flex items-center justify-center text-xs text-neutral-400">
            <span className={isPending ? "opacity-0" : ""}>
              {filteredProducts.length} products
            </span>
          </div>

          {/* SORT BY */}
          <div className="border-l border-neutral-200 relative shrink-0">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 h-full px-6 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-neutral-50 transition-colors"
            >
              SORT BY
              <span className="ml-2 text-neutral-500 normal-case tracking-normal font-normal">{currentSortLabel}</span>
              <ChevronUp
                size={11}
                strokeWidth={1.5}
                className={`transition-transform duration-200 ${sortOpen ? "" : "rotate-180"}`}
              />
            </button>

            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setSortOpen(false)}
                />
                <div className="absolute right-0 top-full w-52 bg-white border border-neutral-200 z-40 py-1 shadow-sm">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        updateQuery({ sort: opt.value === "featured" ? null : opt.value });
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-5 py-2.5 text-sm transition-colors ${
                        sort === opt.value
                          ? "text-[var(--color-text)] font-medium"
                          : "text-neutral-500 hover:text-[var(--color-text)] hover:bg-neutral-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                initiallyWishlisted={wishSet.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="font-serif text-2xl text-[var(--color-text)]">No products found</h2>
            <p className="mt-2 text-sm text-neutral-500">Try adjusting your filters.</p>
            <button
              type="button"
              onClick={() => updateQuery({ category: null, fabric: null, q: null })}
              className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-[var(--color-text)] border border-[var(--color-text)] px-5 py-2.5 hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Filter drawer backdrop */}
      <div
        className={`fixed inset-0 bg-black/25 z-40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Filter drawer panel */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white z-50 flex flex-col transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 shrink-0">
          <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[var(--color-text)]">
            FILTERS
          </h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
            className="text-neutral-500 hover:text-[var(--color-text)] transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
          {/* Categories */}
          <div>
            <h3 className="text-[10px] tracking-[0.22em] uppercase font-semibold text-neutral-400 mb-4">
              Product type
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <span
                    className={`h-4 w-4 shrink-0 border rounded-sm flex items-center justify-center transition-colors ${
                      selectedCategory === cat
                        ? "border-[var(--color-text)] bg-[var(--color-text)]"
                        : "border-neutral-300 group-hover:border-[var(--color-text)]"
                    }`}
                    onClick={() =>
                      updateQuery({
                        category: selectedCategory === cat || cat === "All Sarees" ? null : cat,
                      })
                    }
                  >
                    {selectedCategory === cat && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-sm transition-colors ${
                      selectedCategory === cat
                        ? "text-[var(--color-text)] font-medium"
                        : "text-neutral-600 group-hover:text-[var(--color-text)]"
                    }`}
                    onClick={() =>
                      updateQuery({
                        category: selectedCategory === cat || cat === "All Sarees" ? null : cat,
                      })
                    }
                  >
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Fabric */}
          <div className="border-t border-neutral-100 pt-6">
            <h3 className="text-[10px] tracking-[0.22em] uppercase font-semibold text-neutral-400 mb-4">
              Fabric
            </h3>
            <div className="space-y-3">
              {fabrics.map((fabric) => (
                <label key={fabric} className="flex items-center gap-3 cursor-pointer group">
                  <span
                    className={`h-4 w-4 shrink-0 border rounded-sm flex items-center justify-center transition-colors ${
                      selectedFabrics.includes(fabric)
                        ? "border-[var(--color-text)] bg-[var(--color-text)]"
                        : "border-neutral-300 group-hover:border-[var(--color-text)]"
                    }`}
                    onClick={() => toggleFabric(fabric)}
                  >
                    {selectedFabrics.includes(fabric) && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2.5">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-sm transition-colors ${
                      selectedFabrics.includes(fabric)
                        ? "text-[var(--color-text)] font-medium"
                        : "text-neutral-600 group-hover:text-[var(--color-text)]"
                    }`}
                    onClick={() => toggleFabric(fabric)}
                  >
                    {fabric}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => updateQuery({ category: null, fabric: null, q: null })}
              className="text-xs tracking-[0.18em] uppercase text-neutral-400 hover:text-[var(--color-text)] transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-neutral-200 px-6 py-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-full bg-[var(--color-text)] text-[var(--color-background)] text-[11px] tracking-[0.2em] uppercase font-semibold py-3.5 hover:opacity-90 transition-opacity"
          >
            VIEW {filteredProducts.length} ITEMS
          </button>
        </div>
      </div>
    </div>
  );
}
