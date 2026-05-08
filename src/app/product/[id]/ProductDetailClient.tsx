"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ChevronRight, Truck, RotateCcw, Lock, BadgeIndianRupee } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/ui/ProductCard";
import { WishlistHeartButton } from "@/components/product/WishlistHeartButton";

type ProductDetailClientProps = {
  product: Product;
  relatedProducts: Product[];
  initiallyWishlisted: boolean;
  wishlistedProductIds: string[];
};

export function ProductDetailClient({
  product,
  relatedProducts,
  initiallyWishlisted,
  wishlistedProductIds,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.color[0]?.name);
  const [activeTab, setActiveTab] = useState("DESCRIPTION");
  const [added, setAdded] = useState(false);
  const wishSet = new Set(wishlistedProductIds);

  function handleAddToCart() {
    addToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-text-muted flex items-center gap-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-primary transition-colors">Collections</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-primary transition-colors">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 bg-white p-6 md:p-10 rounded-sm shadow-sm">
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-20 flex-shrink-0">
              <div className="w-full aspect-[3/4] relative border-2 border-primary rounded-sm overflow-hidden">
                <Image src={product.image} alt={`${product.title} thumbnail`} fill sizes="80px" className="object-cover" />
              </div>
              {product.hoverImage && (
                <div className="w-full aspect-[3/4] relative border border-gray-200 rounded-sm overflow-hidden opacity-80">
                  <Image src={product.hoverImage} alt={`${product.title} alternate view`} fill sizes="80px" className="object-cover" />
                </div>
              )}
            </div>
            <div className="flex-grow relative aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden">
              <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl md:text-4xl font-serif text-text font-medium leading-tight">
                {product.title}
              </h1>
              <WishlistHeartButton
                productId={product.id}
                productTitle={product.title}
                initialInWishlist={initiallyWishlisted}
                className="text-text-muted hover:text-[var(--color-text)] p-1"
                iconClassName="w-6 h-6"
              />
            </div>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary">Rs. {product.price.toLocaleString("en-IN")}</span>
              <span className="text-sm text-text-muted">Inclusive of all taxes</span>
            </div>

            <p className="text-text-muted mb-8 leading-relaxed">{product.description}</p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <span className="w-24 text-sm font-bold uppercase tracking-wider text-text">Color:</span>
                <div className="flex gap-3">
                  {product.color.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name ? "border-primary p-0.5" : "border-transparent"}`}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                    >
                      <span className="block w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center text-sm">
                <span className="w-24 font-bold uppercase tracking-wider text-text">Material:</span>
                <span className="text-text-muted">{product.material}</span>
              </div>

              <div className="flex items-center text-sm">
                <span className="w-24 font-bold uppercase tracking-wider text-text">Stock:</span>
                <span className="text-primary font-medium">
                  {product.stock > 0 ? `Only ${product.stock} left` : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-sm h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-text-muted hover:text-primary transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 text-text-muted hover:text-primary transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {added && <span className="text-sm font-medium text-green-700">Added to cart.</span>}
            </div>

            <div className="flex gap-4 mb-8">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </Button>
              <Button size="lg" className="flex-1" onClick={handleBuyNow} disabled={product.stock <= 0}>
                Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-gray-100 text-center">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: RotateCcw, label: "Easy Returns" },
                { icon: Lock, label: "Secure Payment" },
                { icon: BadgeIndianRupee, label: "COD Available" },
              ].map(({ icon: Icon, label }) => (
                <div key={label}>
                  <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-20 bg-white p-6 rounded-sm shadow-sm">
          <div className="md:w-1/4 flex flex-col space-y-2 border-r border-gray-100 pr-6">
            {["DESCRIPTION", "DETAILS", "CARE INSTRUCTIONS", "SHIPPING & RETURNS"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left text-sm font-bold tracking-wider py-3 px-4 transition-colors ${
                  activeTab === tab ? "text-primary bg-primary/5" : "text-text-muted hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="md:w-3/4 p-4 text-text-muted leading-relaxed text-sm">
            {activeTab === "DESCRIPTION" ? (
              <div>
                <p className="mb-4">{product.description}</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{product.category}</li>
                  <li>{product.material}</li>
                  <li>Includes unstitched blouse piece</li>
                </ul>
              </div>
            ) : activeTab === "DETAILS" ? (
              <div className="space-y-3">
                <p>
                  <span className="font-medium text-text">Material: </span>
                  {product.material}
                </p>
                <p>
                  <span className="font-medium text-text">Category: </span>
                  {product.category}
                </p>
                <p>
                  <span className="font-medium text-text">Availability: </span>
                  {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
                </p>
              </div>
            ) : activeTab === "CARE INSTRUCTIONS" ? (
              <ul className="list-disc pl-5 space-y-2">
                <li>Dry clean only for zari and silk blends.</li>
                <li>Store folded with muslin; avoid prolonged direct sunlight.</li>
                <li>Steam on low from the reverse side to refresh drape.</li>
              </ul>
            ) : (
              <div className="space-y-3">
                <p>Orders above ₹5,000 ship free within India. Tracking is shared by email once dispatched.</p>
                <p>
                  Easy returns within the window stated in our{" "}
                  <Link href="/about" className="underline text-[var(--color-text)]">
                    returns policy
                  </Link>
                  . COD orders are verified before dispatch.
                </p>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-text inline-flex items-center gap-4">
                <span className="h-px w-12 bg-primary/30"></span>
                You May Also Like
                <span className="h-px w-12 bg-primary/30"></span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  initiallyWishlisted={wishSet.has(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
