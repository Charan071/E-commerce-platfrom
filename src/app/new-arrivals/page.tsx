"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";

export default function NewArrivalsPage() {
  // Mock logic: treat products with isNew flag as new arrivals, 
  // or just grab the first 3 if none have the flag.
  const newProducts = PRODUCTS.filter(p => p.isNew) || PRODUCTS.slice(0, 3);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-text-muted flex items-center gap-2 border-b border-gray-200">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text">New Arrivals</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-text mb-4">New Arrivals</h1>
          <p className="text-text-muted max-w-2xl mx-auto italic">
            Discover our latest additions. Fresh styles, contemporary colors, and timeless weaving techniques brought together for the modern wardrobe.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Duplicating just to show a fuller page since we only marked 1 product as new in mock data */}
          {newProducts.map((product, i) => (
            <ProductCard key={`${product.id}-dup-${i}`} product={{...product, id: `${product.id}-dup-${i}`}} />
          ))}
           {newProducts.map((product, i) => (
            <ProductCard key={`${product.id}-dup2-${i}`} product={{...product, id: `${product.id}-dup2-${i}`}} />
          ))}
        </div>
      </div>
    </div>
  );
}
