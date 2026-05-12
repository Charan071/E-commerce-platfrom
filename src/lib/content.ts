import { prisma } from "@/lib/prisma";

export type BrandKitContent = {
  brandName: string;
  tagline: string;
  voice: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  mutedTextColor: string;
  headingFont: string;
  bodyFont: string;
  navLetterSpacing: string;
};

export type HeroContent = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
};

export type MediaBlock = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  imageUrl: string;
  imageHasEmbeddedText: boolean;
  sortOrder: number;
};

export const FALLBACK_BRAND_KIT: BrandKitContent = {
  brandName: "AnavaSilks",
  tagline: "Silk and Sarees",
  voice: "Luxury silk sarees rooted in heritage craft and timeless elegance.",
  primaryColor: "#171717",
  secondaryColor: "#f6f4f0",
  accentColor: "#8b6a3e",
  surfaceColor: "#ffffff",
  mutedTextColor: "#6b6b6b",
  headingFont: "Playfair Display",
  bodyFont: "Inter",
  navLetterSpacing: "0.22em",
};

export const FALLBACK_HERO: HeroContent = {
  title: "Whisper of Summer",
  subtitle: "An ode to warmth and quiet beauty",
  ctaLabel: "Shop Here",
  ctaHref: "/collections",
  imageUrl: "/images/hero.png",
};

export const FALLBACK_COLLECTION_HIGHLIGHTS: Omit<MediaBlock, "id">[] = [
  {
    title: "Regalia",
    subtitle: "Shop Here",
    href: "/collections",
    imageUrl: "/images/cat-1.png",
    imageHasEmbeddedText: true,
    sortOrder: 1,
  },
  {
    title: "Spring Summer '26",
    subtitle: "Explore our latest collection",
    href: "/collections",
    imageUrl: "/images/cat-2.png",
    imageHasEmbeddedText: true,
    sortOrder: 2,
  },
  {
    title: "Menswear",
    subtitle: "Shop Here",
    href: "/collections",
    imageUrl: "/images/cat-3.png",
    imageHasEmbeddedText: true,
    sortOrder: 3,
  },
];

export const FALLBACK_NAV_PROMOS: Omit<MediaBlock, "id">[] = [
  {
    title: "Regalia",
    subtitle: "Shop Here",
    href: "/collections",
    imageUrl: "/images/cat-1.png",
    imageHasEmbeddedText: true,
    sortOrder: 1,
  },
  {
    title: "Spring Summer '26",
    subtitle: "Explore our latest collection",
    href: "/collections",
    imageUrl: "/images/cat-2.png",
    imageHasEmbeddedText: true,
    sortOrder: 2,
  },
];

export async function getBrandKitContent(): Promise<BrandKitContent> {
  try {
    const item = await prisma.brandKit.findFirst({ orderBy: { createdAt: "asc" } });
    if (!item) return FALLBACK_BRAND_KIT;
    return {
      brandName: item.brandName,
      tagline: item.tagline,
      voice: item.voice ?? FALLBACK_BRAND_KIT.voice,
      primaryColor: item.primaryColor,
      secondaryColor: item.secondaryColor,
      accentColor: item.accentColor,
      surfaceColor: item.surfaceColor ?? FALLBACK_BRAND_KIT.surfaceColor,
      mutedTextColor: item.mutedTextColor ?? FALLBACK_BRAND_KIT.mutedTextColor,
      headingFont: item.headingFont,
      bodyFont: item.bodyFont,
      navLetterSpacing: item.navLetterSpacing,
    };
  } catch {
    return FALLBACK_BRAND_KIT;
  }
}

export async function getHeroContent(): Promise<HeroContent> {
  const slides = await getHeroSlides();
  return slides[0] ?? FALLBACK_HERO;
}

export async function getHeroSlides(): Promise<HeroContent[]> {
  try {
    const items = await prisma.homeHero.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
    return items.map((item) => ({
      title: item.title,
      subtitle: item.subtitle ?? "",
      ctaLabel: item.ctaLabel ?? "Shop Here",
      ctaHref: item.ctaHref ?? "/collections",
      imageUrl: item.imageUrl,
    }));
  } catch {
    return [];
  }
}

export async function getCollectionHighlights(): Promise<MediaBlock[]> {
  try {
    const items = await prisma.collectionHighlight.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle ?? "",
      href: item.href,
      imageUrl: item.imageUrl,
      imageHasEmbeddedText: item.imageHasEmbeddedText,
      sortOrder: item.sortOrder,
    }));
  } catch {
    return [];
  }
}

export async function getNavPromoBlocks(): Promise<MediaBlock[]> {
  try {
    const items = await prisma.navPromoBlock.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (items.length === 0) {
      return FALLBACK_NAV_PROMOS.map((item, idx) => ({ ...item, id: `fallback-nav-${idx}` }));
    }
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle ?? "",
      href: item.href,
      imageUrl: item.imageUrl,
      imageHasEmbeddedText: item.imageHasEmbeddedText,
      sortOrder: item.sortOrder,
    }));
  } catch {
    return FALLBACK_NAV_PROMOS.map((item, idx) => ({ ...item, id: `fallback-nav-${idx}` }));
  }
}
