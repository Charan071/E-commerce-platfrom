import Image from "next/image";
import Link from "next/link";
import { NewsletterSignupForm } from "@/components/layout/NewsletterSignupForm";
import { HomeProductRail } from "@/components/home/HomeProductRail";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { getAuthContext } from "@/lib/auth";
import { getCatalogProducts } from "@/lib/catalog";
import { getBrandKitContent, getCollectionHighlights, getHeroSlides } from "@/lib/content";
import { getWishlistProductIdsForUser } from "@/lib/wishlist-server";

export default async function Home() {
  const [heroSlides, highlights, products, brandKit, auth] = await Promise.all([
    getHeroSlides(),
    getCollectionHighlights(),
    getCatalogProducts(),
    getBrandKitContent(),
    getAuthContext(),
  ]);

  const wishlistedIds = auth ? [...(await getWishlistProductIdsForUser(auth.userId))] : [];
  const newIn = products.filter((p) => p.isNew);
  const railProducts = (newIn.length >= 4 ? newIn : products).slice(0, 10);
  const heroEyebrow = brandKit.tagline?.trim() || "Heritage craft · Modern drape";

  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <HeroCarousel slides={heroSlides} eyebrow={heroEyebrow} />

      {/* ── Featured Collections ── */}
      <section className="py-16 sm:py-20 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl">Collections</h2>
          <Link
            href="/collections"
            className="text-[10px] uppercase tracking-[0.28em] text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            View All
          </Link>
        </div>

        {highlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {highlights.slice(0, 3).map((cat) => (
              <Link
                href={cat.href}
                key={cat.id}
                className="group relative block overflow-hidden"
                aria-label={cat.title}
              >
                <div className="relative h-[480px] sm:h-[560px] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  {!cat.imageHasEmbeddedText && (
                    <>
                      <h3 className="font-serif text-2xl sm:text-3xl">{cat.title}</h3>
                      {cat.subtitle && <p className="mt-1 text-xs opacity-75">{cat.subtitle}</p>}
                    </>
                  )}
                  <span className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] border-b border-white/60 pb-0.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    Shop Collection
                    <svg className="w-2.5 h-2" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M1 4h8M5 1l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Placeholder tiles when no collections are configured */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {["Collection One", "Collection Two", "Collection Three"].map((label) => (
              <Link
                key={label}
                href="/admin/content"
                className="relative flex h-[480px] sm:h-[560px] flex-col items-center justify-center bg-neutral-100 text-center px-8 hover:bg-neutral-150 transition-colors group"
              >
                <div className="w-10 h-px bg-neutral-300 mb-5" />
                <p className="font-serif text-2xl text-neutral-400">{label}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-neutral-400 group-hover:text-neutral-600 transition-colors">
                  Add image from Admin
                </p>
                <div className="w-10 h-px bg-neutral-300 mt-5" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Product Rail (only when products exist) ── */}
      {railProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-y border-neutral-100">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
            <HomeProductRail
              title="New In"
              products={railProducts}
              wishlistedIds={wishlistedIds}
            />
          </div>
        </section>
      )}

      {/* ── Newsletter ── */}
      <section className="py-20 sm:py-24 bg-[#f3ede5]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400 mb-4">Stay Connected</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mb-4">Become an Insider</h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            Early access to new arrivals, curated edits, and stories from our weavers.
          </p>
          <NewsletterSignupForm variant="home" className="max-w-md mx-auto" />
        </div>
      </section>

    </div>
  );
}
