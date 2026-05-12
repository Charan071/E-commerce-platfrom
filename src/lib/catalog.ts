import { prisma } from "@/lib/prisma";
import { CATEGORIES, FABRICS, type Product } from "@/lib/mock-data";
import { isExpectedSampleFallback } from "@/lib/sample-api";

type DbProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: unknown;
  originalPrice: unknown;
  discount: string | null;
  material: string;
  sizes: string[];
  stock: number;
  isNew: boolean;
  category: { name: string; slug: string };
  images: { url: string; isHover: boolean; order: number }[];
  colors: { name: string; hex: string }[];
};

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value ?? 0);
}

export function dbProductToProduct(product: DbProduct): Product {
  const sorted = [...product.images].sort((a, b) => a.order - b.order);
  const primaryImage =
    sorted.find((img) => !img.isHover)?.url ?? sorted[0]?.url ?? "/images/saree-1.png";
  const hoverImage = sorted.find((img) => img.isHover)?.url;
  const allImages = sorted.map((img) => img.url);

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: toNumber(product.price),
    originalPrice:
      product.originalPrice === null || product.originalPrice === undefined
        ? undefined
        : toNumber(product.originalPrice),
    discount: product.discount ?? undefined,
    material: product.material,
    color: product.colors.map((color) => ({ name: color.name, hex: color.hex })),
    category: product.category.name,
    image: primaryImage,
    hoverImage,
    allImages: allImages.length > 0 ? allImages : undefined,
    isNew: product.isNew,
    stock: product.stock,
    sizes: product.sizes.length > 0 ? product.sizes : undefined,
  };
}

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        images: {
          select: { url: true, isHover: true, order: true },
          orderBy: { order: "asc" },
        },
        colors: { select: { name: true, hex: true } },
      },
    });

    return products.map(dbProductToProduct);
  } catch (error) {
    if (!isExpectedSampleFallback(error)) {
      console.error("[catalog products]", error);
    }
    return [];
  }
}

export async function getCatalogProduct(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        isActive: true,
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: { select: { name: true, slug: true } },
        images: {
          select: { url: true, isHover: true, order: true },
          orderBy: { order: "asc" },
        },
        colors: { select: { name: true, hex: true } },
      },
    });

    if (product) return dbProductToProduct(product);
  } catch (error) {
    if (!isExpectedSampleFallback(error)) {
      console.error("[catalog product]", error);
    }
  }

  return null;
}

export async function getCatalogFilters() {
  const products = await getCatalogProducts();
  const categoryNames = Array.from(new Set(products.map((product) => product.category)));
  const materialNames = Array.from(new Set(products.map((product) => product.material)));

  return {
    categories: ["All Sarees", ...categoryNames.filter((name) => name !== "All Sarees")],
    fabrics: materialNames.length > 0 ? materialNames : FABRICS,
  };
}

export function getStaticCategories() {
  return CATEGORIES;
}

export async function getCatalogNavCategories(): Promise<{ name: string; slug: string }[]> {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    });
  } catch (error) {
    if (!isExpectedSampleFallback(error)) {
      console.error("[nav categories]", error);
    }
    return [];
  }
}
