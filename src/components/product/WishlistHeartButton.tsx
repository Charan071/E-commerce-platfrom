"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type WishlistHeartButtonProps = {
  productId: string;
  productTitle: string;
  initialInWishlist: boolean;
  className?: string;
  iconClassName?: string;
};

export function WishlistHeartButton({
  productId,
  productTitle,
  initialInWishlist,
  className,
  iconClassName,
}: WishlistHeartButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    try {
      const next = !inWishlist;
      const res = await fetch("/api/wishlist", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (res.status === 401) {
        const redirectTo = pathname || "/shop";
        router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
        return;
      }

      if (!res.ok) return;

      setInWishlist(next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const label = inWishlist ? `Remove ${productTitle} from wishlist` : `Save ${productTitle} to wishlist`;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={inWishlist}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center transition-colors disabled:opacity-50",
        className
      )}
    >
      <Heart
        className={cn(
          iconClassName ?? "w-4 h-4",
          inWishlist ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-current"
        )}
        strokeWidth={1.5}
      />
    </button>
  );
}
