"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, Gift, Phone, Share2, Shield } from "lucide-react";
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

const TABS = ["DESCRIPTION", "SHIPPING", "CARE INSTRUCTIONS"] as const;
type Tab = (typeof TABS)[number];

export function ProductDetailClient({
  product,
  relatedProducts,
  initiallyWishlisted,
  wishlistedProductIds,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.color[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("DESCRIPTION");
  const [added, setAdded] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const addToCartRef = useRef<HTMLDivElement>(null);
  const wishSet = new Set(wishlistedProductIds);

  const images = product.allImages?.length
    ? product.allImages
    : [product.image, product.hoverImage].filter(Boolean) as string[];

  const nextImage = useCallback(
    () => setActiveIdx((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (images.length <= 1 || galleryPaused) return;
    const id = setInterval(nextImage, 4000);
    return () => clearInterval(id);
  }, [nextImage, galleryPaused, images.length, timerKey]);

  function selectImage(idx: number) {
    setActiveIdx(idx);
    setTimerKey((k) => k + 1);
  }

  useEffect(() => {
    const el = addToCartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry!.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleAddToCart() {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, qty, selectedSize ?? undefined, selectedColor || undefined);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  function scrollToProduct() {
    addToCartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="bg-[var(--color-background)]">
      {/* ── Main product section ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-12 py-6 lg:py-8">

          {/* LEFT — image gallery */}
          <div
            onMouseEnter={() => setGalleryPaused(true)}
            onMouseLeave={() => setGalleryPaused(false)}
          >
            <div className="relative aspect-[3/4] w-full bg-[#f2ede7] overflow-hidden">
              <Image
                src={images[activeIdx]}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
                priority
              />
              {images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10">
                  <div
                    key={`${activeIdx}-${timerKey}`}
                    className="h-full bg-black/40 animate-slide-progress"
                    style={{ animationPlayState: galleryPaused ? "paused" : "running" }}
                  />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectImage(i)}
                    className={`relative h-20 w-14 overflow-hidden shrink-0 transition-opacity ${
                      activeIdx === i ? "opacity-100 ring-1 ring-[var(--color-text)]" : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-5 flex items-center">
              <button
                type="button"
                className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-neutral-400 hover:text-[var(--color-text)] transition-colors"
                onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
              >
                <Share2 size={13} strokeWidth={1.5} />
                Share
              </button>
            </div>
          </div>

          {/* RIGHT — product info */}
          <div className="flex flex-col">
            {/* Breadcrumb */}
            <p className="text-xs text-neutral-400 mb-4 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-[var(--color-text)] transition-colors">Home</Link>
              <span>•</span>
              <Link href="/shop" className="hover:text-[var(--color-text)] transition-colors">{product.category}</Link>
              <span>•</span>
              <span className="text-[var(--color-text)]">{product.title}</span>
            </p>

            {/* Title + wishlist */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="font-serif text-[28px] leading-tight text-[var(--color-text)]">
                {product.title}
              </h1>
              <WishlistHeartButton
                productId={product.id}
                productTitle={product.title}
                initialInWishlist={initiallyWishlisted}
                className="text-neutral-400 hover:text-[var(--color-text)] transition-colors shrink-0 mt-1"
                iconClassName="w-5 h-5"
              />
            </div>

            {/* Price */}
            <p className="text-sm text-[var(--color-text)] mb-0.5">
              Rs. {product.price.toLocaleString("en-IN")}.00
              {product.originalPrice && (
                <span className="ml-2 text-neutral-400 line-through text-xs">
                  Rs. {product.originalPrice.toLocaleString("en-IN")}.00
                </span>
              )}
            </p>
            <p className="text-xs text-neutral-400 mb-4">
              Taxes included.{" "}
              <Link href="/about" className="underline hover:text-[var(--color-text)] transition-colors">
                Shipping
              </Link>{" "}
              calculated at checkout.
            </p>

            <div className="h-px bg-neutral-200 mb-4" />

            {/* Color */}
            {product.color.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-[var(--color-text)]">
                    Colour
                  </span>
                  <span className="text-xs text-neutral-400">{selectedColor}</span>
                </div>
                <div className="flex gap-2">
                  {product.color.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      aria-label={`Select ${c.name}`}
                      className={`w-7 h-7 rounded-full border-2 p-0.5 transition-all ${
                        selectedColor === c.name
                          ? "border-[var(--color-text)]"
                          : "border-transparent hover:border-neutral-400"
                      }`}
                    >
                      <span className="block w-full h-full rounded-full" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-[var(--color-text)]">
                    Size
                    {selectedSize && <span className="ml-2 normal-case tracking-normal font-normal text-neutral-400">{selectedSize}</span>}
                  </span>
                  <button type="button" className="text-[11px] tracking-[0.1em] uppercase underline text-neutral-400 hover:text-[var(--color-text)] transition-colors">
                    Size chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`h-10 min-w-[2.75rem] px-3 border text-sm transition-colors ${
                        selectedSize === size
                          ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-background)]"
                          : "border-neutral-300 text-[var(--color-text)] hover:border-[var(--color-text)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="mt-1.5 text-xs text-red-500">Please select a size</p>
                )}
              </div>
            )}

            {/* Material + Stock note */}
            <div className="flex gap-6 text-xs text-neutral-500 mb-4">
              <span><span className="text-[var(--color-text)] font-medium">Fabric:</span> {product.material}</span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-amber-600">Only {product.stock} left</span>
              )}
              {product.stock === 0 && <span className="text-red-500">Out of stock</span>}
            </div>

            {/* Qty + Add to Cart */}
            <div ref={addToCartRef} className="flex gap-3 mb-5">
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={product.stock <= 0}
                className="w-20 h-12 border border-neutral-300 px-3 text-sm text-[var(--color-text)] bg-white outline-none cursor-pointer appearance-none"
                aria-label="Quantity"
              >
                {Array.from({ length: Math.max(1, Math.min(product.stock, 10)) }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>{n}</option>
                  )
                )}
              </select>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 h-12 bg-[var(--color-text)] text-[var(--color-background)] text-[11px] tracking-[0.22em] uppercase font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                {added ? "Added to cart" : product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200 mb-3 gap-5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[10px] tracking-[0.2em] uppercase font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-[var(--color-text)] text-[var(--color-text)] -mb-px"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="text-sm text-neutral-600 leading-relaxed mb-5 min-h-[4rem]">
              {activeTab === "DESCRIPTION" && (
                <div>
                  <p className="mb-3">{product.description}</p>
                  <div className="space-y-1 text-xs text-neutral-500">
                    <p><span className="text-[var(--color-text)] font-medium">Fabric:</span> {product.material}</p>
                    <p><span className="text-[var(--color-text)] font-medium">Category:</span> {product.category}</p>
                    <p><span className="text-[var(--color-text)] font-medium">Care:</span> Dry clean recommended</p>
                  </div>
                </div>
              )}
              {activeTab === "SHIPPING" && (
                <div className="space-y-2 text-xs text-neutral-500">
                  <p>Orders above ₹5,000 ship free within India.</p>
                  <p>Tracking is shared by email once dispatched.</p>
                  <p>Easy returns within 7 days of delivery for eligible items.</p>
                  <p>COD orders are verified by call before dispatch.</p>
                </div>
              )}
              {activeTab === "CARE INSTRUCTIONS" && (
                <ul className="space-y-1.5 text-xs text-neutral-500 list-none">
                  <li>Dry clean only for zari and silk blends.</li>
                  <li>Store folded with muslin; avoid prolonged direct sunlight.</li>
                  <li>Steam on low from the reverse side to refresh drape.</li>
                  <li>Do not wring or machine wash.</li>
                </ul>
              )}
            </div>

            {/* Info notes */}
            <div className="space-y-3 border-t border-neutral-100 pt-4">
              <div className="flex items-start gap-3 text-xs text-neutral-500">
                <Phone size={13} strokeWidth={1.5} className="shrink-0 mt-0.5 text-neutral-400" />
                <span>Please email / call / WhatsApp for customisation requests.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-neutral-500">
                <Shield size={13} strokeWidth={1.5} className="shrink-0 mt-0.5 text-neutral-400" />
                <span>Each piece is exclusively handcrafted — colour and texture may vary slightly due to artisan processes.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-neutral-500">
                <Gift size={13} strokeWidth={1.5} className="shrink-0 mt-0.5 text-neutral-400" />
                <span>Made To Order</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 border-t border-neutral-100">
          <h2 className="text-center text-[11px] tracking-[0.3em] uppercase font-medium text-[var(--color-text)] mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
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

      {/* ── Sticky bottom bar ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 transition-transform duration-300 ${
          stickyVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-serif text-sm text-[var(--color-text)] truncate">{product.title}</span>
            <span className="text-neutral-300 shrink-0">•</span>
            <span className="text-sm text-[var(--color-text)] shrink-0">
              Rs. {product.price.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            type="button"
            onClick={scrollToProduct}
            className="shrink-0 flex items-center gap-2 border border-[var(--color-text)] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-colors"
          >
            Configure
            <ChevronUp size={11} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
