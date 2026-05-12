import { CATEGORIES, PRODUCTS, type Product } from "@/lib/mock-data";

export function isExpectedSampleFallback(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "DATABASE_URL is not configured") return true;
  }
  if (!error || typeof error !== "object") return false;

  const code = (error as { code?: unknown }).code;
  return code === "P2021" || code === "P1000" || code === "P1001";
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sampleProductToApi(product: Product) {
  const slug = slugify(product.title);

  return {
    id: product.id,
    title: product.title,
    slug,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    discount: product.discount ?? null,
    material: product.material,
    stock: product.stock,
    isNew: product.isNew ?? false,
    isActive: true,
    categoryId: slugify(product.category),
    createdAt: null,
    updatedAt: null,
    category: {
      name: product.category,
      slug: slugify(product.category),
    },
    images: [
      {
        id: `${product.id}-image`,
        productId: product.id,
        url: product.image,
        publicId: `sample/${product.id}`,
        isHover: false,
        order: 0,
      },
      ...(product.hoverImage
        ? [
            {
              id: `${product.id}-hover-image`,
              productId: product.id,
              url: product.hoverImage,
              publicId: `sample/${product.id}-hover`,
              isHover: true,
              order: 1,
            },
          ]
        : []),
    ],
    colors: product.color.map((color, index) => ({
      id: `${product.id}-color-${index}`,
      productId: product.id,
      name: color.name,
      hex: color.hex,
    })),
  };
}

export function getSampleProduct(id: string) {
  const product = PRODUCTS.find(
    (item) => item.id === id || slugify(item.title) === id
  );

  return product ? sampleProductToApi(product) : null;
}

export function getSampleProducts({
  category,
  isNew,
  search,
  page,
  limit,
}: {
  category?: string | null;
  isNew?: string | null;
  search?: string | null;
  page: number;
  limit: number;
}) {
  const normalizedSearch = search?.trim().toLowerCase();
  const normalizedCategory = category?.trim().toLowerCase();

  const filtered = PRODUCTS.filter((product) => {
    const matchesCategory =
      !normalizedCategory ||
      slugify(product.category) === normalizedCategory ||
      product.category.toLowerCase() === normalizedCategory;
    const matchesNew = isNew !== "true" || product.isNew === true;
    const matchesSearch =
      !normalizedSearch ||
      product.title.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesNew && matchesSearch;
  });

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  const start = (safePage - 1) * safeLimit;

  return {
    products: filtered.slice(start, start + safeLimit).map(sampleProductToApi),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / safeLimit)),
    },
    source: "sample" as const,
  };
}

export function getSampleCategories() {
  const names = CATEGORIES.filter((category) => category !== "All Sarees");

  return names.map((name) => ({
    id: slugify(name),
    name,
    slug: slugify(name),
    description: null,
    imageUrl: null,
    createdAt: null,
    _count: {
      products: PRODUCTS.filter((product) => product.category === name).length,
    },
  }));
}
