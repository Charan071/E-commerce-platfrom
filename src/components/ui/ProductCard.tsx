import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/lib/mock-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={cn("group relative flex flex-col bg-white rounded-sm overflow-hidden", className)}>
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              New
            </span>
          )}
          {product.discount && (
            <span className="bg-white text-primary text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              {product.discount}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="pt-4 pb-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-serif font-semibold text-lg text-text line-clamp-1">{product.title}</h3>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
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
