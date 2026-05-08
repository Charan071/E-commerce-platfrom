"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/mock-data";

type HomeProductRailProps = {
  title: string;
  products: Product[];
  wishlistedIds: string[];
};

export function HomeProductRail({ title, products, wishlistedIds }: HomeProductRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wishSet = new Set(wishlistedIds);

  function scrollByDir(dir: -1 | 1) {
    const el = scrollRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.85) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 max-w-3xl">{title}</h2>
        <div className="hidden md:flex gap-2 shrink-0">
          <button
            type="button"
            aria-label="Scroll products left"
            onClick={() => scrollByDir(-1)}
            className="w-9 h-9 border border-neutral-300 rounded-full flex items-center justify-center hover:border-[var(--color-text)] transition-colors bg-[var(--color-surface)]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll products right"
            onClick={() => scrollByDir(1)}
            className="w-9 h-9 border border-neutral-300 rounded-full flex items-center justify-center hover:border-[var(--color-text)] transition-colors bg-[var(--color-surface)]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 hide-scrollbar scroll-smooth snap-x snap-mandatory md:snap-none"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[46%] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] shrink-0 snap-start"
          >
            <ProductCard product={product} initiallyWishlisted={wishSet.has(product.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
