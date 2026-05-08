import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/mock-data";
import { WishlistHeartButton } from "@/components/product/WishlistHeartButton";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
  className?: string;
  initiallyWishlisted?: boolean;
}

export function ProductCard({ product, className, initiallyWishlisted = false }: ProductCardProps) {
  return (
    <div className={cn("group relative flex flex-col bg-transparent overflow-hidden", className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f2efe9]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-[var(--color-text)] text-[var(--color-surface)] text-[10px] font-medium px-2 py-1 uppercase tracking-[0.18em]">
              New
            </span>
          )}
          {product.discount && (
            <span className="bg-[var(--color-surface)] text-[var(--color-text)] border border-neutral-200/80 text-[10px] font-medium px-2 py-1 uppercase tracking-[0.18em]">
              {product.discount}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-text-muted hover:text-[var(--color-text)] hover:bg-white transition-colors shadow-sm">
          <WishlistHeartButton
            productId={product.id}
            productTitle={product.title}
            initialInWishlist={initiallyWishlisted}
            className="h-full w-full"
            iconClassName="w-4 h-4"
          />
        </div>
      </div>

      <div className="pt-4 pb-1 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/product/${product.id}`} className="block group-hover:text-[var(--color-text)] transition-colors">
            <h3 className="font-serif text-[17px] text-text line-clamp-1">{product.title}</h3>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-text">Rs. {product.price.toLocaleString("en-IN")}</span>
          {product.originalPrice && (
            <span className="text-sm text-text-muted line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex -space-x-1">
            {product.color.slice(0, 3).map((c, i) => (
              <div 
                key={i} 
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
          {product.color.length > 3 && (
            <span className="text-[10px] text-text-muted">+{product.color.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}
