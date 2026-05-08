import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { NewsletterSignupForm } from "@/components/layout/NewsletterSignupForm";
import { HomeProductRail } from "@/components/home/HomeProductRail";
import { getAuthContext } from "@/lib/auth";
import { getCatalogProducts } from "@/lib/catalog";
import { getBrandKitContent, getCollectionHighlights, getHeroContent } from "@/lib/content";
import { getWishlistProductIdsForUser } from "@/lib/wishlist-server";

export default async function Home() {
  const [hero, highlights, products, brandKit, auth] = await Promise.all([
    getHeroContent(),
    getCollectionHighlights(),
    getCatalogProducts(),
    getBrandKitContent(),
    getAuthContext(),
  ]);
  const wishlistedIds = auth ? [...(await getWishlistProductIdsForUser(auth.userId))] : [];
  const silkSareeProducts = products.filter((product) => {
    const haystack = `${product.title} ${product.material} ${product.description}`.toLowerCase();
    return haystack.includes("saree") || haystack.includes("silk");
  });
  const bestSellers = (silkSareeProducts.length > 0 ? silkSareeProducts : products).slice(0, 8);
  const heroEyebrow = brandKit.tagline?.trim() || "Heritage craft · Modern drape";

  return (
    <div className="w-full">
      <section className="relative w-full h-[62vh] md:h-[78vh] min-h-[420px] bg-[#ebe7df]">
        <Link href={hero.ctaHref} className="absolute inset-0 w-full h-full block group overflow-hidden">
          <Image
            src={hero.imageUrl}
            alt={hero.title}
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute bottom-14 left-8 sm:left-14 text-white">
            <p className="text-xs uppercase tracking-[0.25em] mb-2 opacity-95">{heroEyebrow}</p>
            <h1 className="font-serif text-3xl md:text-5xl">{hero.title}</h1>
            <p className="mt-2 text-sm md:text-base opacity-90">{hero.subtitle}</p>
            <span className="inline-block mt-5 text-xs uppercase tracking-[0.2em] border-b border-white pb-1">
              {hero.ctaLabel}
            </span>
          </div>
        </Link>
      </section>

      <section className="py-14 sm:py-16 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-900">Featured Collections</h2>
          <Link href="/collections" className="text-xs uppercase tracking-[0.2em] text-neutral-700 hover:text-black">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {highlights.slice(0, 3).map((cat) => (
            <Link
              href={cat.href}
              key={cat.id}
              className="group relative h-[460px] overflow-hidden flex items-end p-6"
              aria-label={`${cat.title} ${cat.subtitle}`.trim()}
            >
              <Image
                src={cat.imageUrl}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25" />
              {!cat.imageHasEmbeddedText ? (
                <div className="relative z-10 text-white">
                  <h3 className="font-serif text-3xl">{cat.title}</h3>
                  <p className="mt-1 text-sm opacity-90">{cat.subtitle}</p>
                </div>
              ) : (
                <div className="relative z-10 text-white">
                  <span className="text-xs uppercase tracking-[0.2em] border-b border-white/80 pb-1">
                    Shop Collection
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-white border-y border-neutral-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <HomeProductRail
            title="Iconic silhouettes for unforgettable occasions"
            products={bestSellers}
            wishlistedIds={wishlistedIds}
          />
        </div>
      </section>

      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-[470px]">
          <Image
            src="/images/saree-2.png"
            alt="Craft process"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="bg-[#f1eee8] flex flex-col justify-center px-8 sm:px-12 lg:px-20 h-[470px]">
          <h2 className="text-3xl lg:text-5xl font-serif text-text mb-5 leading-tight">
            Sculpting elegance in every thread
          </h2>
          <p className="text-text-muted text-base mb-8 leading-relaxed max-w-xl">
            A quiet blend of heritage and contemporary drape. Our pieces are crafted to move with grace through celebrations and everyday rituals.
          </p>
          <Link href="/collections" className="text-xs uppercase tracking-[0.2em] border-b border-black pb-1 inline-flex w-fit">
            Explore Collection
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">Regalia</h2>
            <Link href="/collections" className="text-xs uppercase tracking-[0.2em] text-neutral-700 hover:text-black">
              Shop Here
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={`regalia-${product.id}`}
                product={product}
                initiallyWishlisted={wishlistedIds.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f6f4f0] border-y border-neutral-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Become an Insider</h2>
            <p className="text-sm text-neutral-700 mb-6">
              Subscribe to receive special offers and updates on new arrivals.
            </p>
            <NewsletterSignupForm variant="home" className="max-w-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
