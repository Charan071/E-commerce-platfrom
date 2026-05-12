"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const images = product.allImages?.length
    ? product.allImages
    : [product.image, product.hoverImage].filter(Boolean) as string[];
  const [imgIdx, setImgIdx] = useState(0);
  const [hovering, setHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!hovering || images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setImgIdx((i) => (i + 1) % images.length);
    }, 1400);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hovering, images.length]);

  return (
    <div
      className={cn("group relative flex flex-col bg-transparent", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setImgIdx(0);
      }}
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f2efe9]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${product.title} — view ${i + 1}`}
              fill
              className={`object-cover object-center transition-opacity duration-500 ${
                i === imgIdx ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={i === 0}
            />
          ))}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="bg-[var(--color-text)] text-[var(--color-surface)] text-[9px] font-medium px-2 py-1 uppercase tracking-[0.18em]">
              New
            </span>
          )}
          {product.discount && (
            <span className="bg-[var(--color-surface)] text-[var(--color-text)] text-[9px] font-medium px-2 py-1 uppercase tracking-[0.18em]">
              {product.discount}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-neutral-500 hover:text-[var(--color-text)] hover:bg-white transition-colors shadow-sm">
          <WishlistHeartButton
            productId={product.id}
            productTitle={product.title}
            initialInWishlist={initiallyWishlisted}
            className="h-full w-full"
            iconClassName="w-3.5 h-3.5"
          />
        </div>

        {/* Image dots — show when multiple images and hovering */}
        {images.length > 1 && hovering && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 ${
                  i === imgIdx ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* "Select options" */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/product/${product.id}`);
            }}
            className="w-full bg-[var(--color-text)] text-[var(--color-surface)] text-[10px] tracking-[0.2em] uppercase font-medium py-3 hover:bg-neutral-800 transition-colors"
          >
            Select Options
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-[15px] leading-snug text-[var(--color-text)] line-clamp-1 mb-1">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text)]">
            Rs. {product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
