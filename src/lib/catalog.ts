import { prisma } from "@/lib/prisma";
import { CATEGORIES, FABRICS, PRODUCTS, type Product } from "@/lib/mock-data";
import { isExpectedSampleFallback, slugify } from "@/lib/sample-api";

type DbProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: unknown;
  originalPrice: unknown;
  discount: string | null;
  material: string;
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
  const primaryImage =
    product.images.find((image) => !image.isHover)?.url ??
    product.images[0]?.url ??
    "/images/saree-1.png";
  const hoverImage = product.images.find((image) => image.isHover)?.url;

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
    isNew: product.isNew,
    stock: product.stock,
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

    if (products.length === 0) return PRODUCTS;
    return products.map(dbProductToProduct);
  } catch (error) {
    if (!isExpectedSampleFallback(error)) {
      console.error("[catalog products]", error);
    }
    return PRODUCTS;
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

  return PRODUCTS.find((product) => product.id === id || slugify(product.title) === id) ?? null;
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
