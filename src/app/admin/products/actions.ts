"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/sample-api";

function toText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let count = 1;
  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return slug;
    count += 1;
    slug = `${baseSlug}-${count}`;
  }
}

async function resolveCategoryId(categoryIdRaw: string, newCategoryNameRaw: string) {
  const categoryId = categoryIdRaw === "__add_category__" ? "" : categoryIdRaw;
  const newCategoryName = newCategoryNameRaw.trim();

  if (categoryId) return categoryId;
  if (!newCategoryName) return null;

  const slug = slugify(newCategoryName);
  if (!slug) return null;

  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ slug }, { name: { equals: newCategoryName, mode: "insensitive" } }],
    },
    select: { id: true },
  });
  if (existing) return existing.id;

  try {
    const created = await prisma.category.create({
      data: { name: newCategoryName, slug, description: null },
      select: { id: true },
    });
    return created.id;
  } catch {
    const retry = await prisma.category.findFirst({
      where: { slug },
      select: { id: true },
    });
    return retry?.id ?? null;
  }
}

function parseImageRows(formData: FormData, slug: string) {
  const rows: Array<{ url: string; publicId: string; isHover: boolean; order: number }> = [];
  for (let i = 0; i < 20; i++) {
    const url = toText(formData.get(`imageUrl_${i}`));
    if (!url) break;
    rows.push({
      url,
      publicId: `manual/${slug}-${i}`,
      isHover: formData.get(`imageHover_${i}`) === "on",
      order: i,
    });
  }
  return rows;
}

export async function createProduct(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const title = toText(formData.get("title"));
  const description = toText(formData.get("description"));
  const material = toText(formData.get("material"));
  const categoryIdRaw = toText(formData.get("categoryId"));
  const newCategoryName = toText(formData.get("newCategoryName"));
  const slugInput = slugify(toText(formData.get("slug")) || title);

  const categoryId = await resolveCategoryId(categoryIdRaw, newCategoryName);
  if (!title || !description || !material || !categoryId || !slugInput) return;

  const slug = await ensureUniqueSlug(slugInput);
  const price = toNumber(formData.get("price"));
  const originalPriceRaw = toText(formData.get("originalPrice"));
  const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : null;
  const stock = toNumber(formData.get("stock"));
  const imageRows = parseImageRows(formData, slug);

  await prisma.product.create({
    data: {
      title,
      slug,
      description,
      price,
      originalPrice: Number.isFinite(originalPrice as number) ? originalPrice : null,
      discount: toText(formData.get("discount")) || null,
      material,
      stock,
      isNew: formData.get("isNew") === "on",
      isActive: true,
      categoryId,
      ...(imageRows.length > 0
        ? { images: { create: imageRows } }
        : {}),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateProduct(productId: string, formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const title = toText(formData.get("title"));
  const description = toText(formData.get("description"));
  const material = toText(formData.get("material"));
  const categoryIdRaw = toText(formData.get("categoryId"));
  const newCategoryName = toText(formData.get("newCategoryName"));
  const slugInput = slugify(toText(formData.get("slug")) || title);

  const categoryId = await resolveCategoryId(categoryIdRaw, newCategoryName);
  if (!title || !description || !material || !categoryId || !slugInput) return;

  const slug = await ensureUniqueSlug(slugInput, productId);
  const price = toNumber(formData.get("price"));
  const originalPriceRaw = toText(formData.get("originalPrice"));
  const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : null;
  const stock = toNumber(formData.get("stock"));
  const imageRows = parseImageRows(formData, slug);

  await prisma.product.update({
    where: { id: productId },
    data: {
      title,
      slug,
      description,
      price,
      originalPrice: Number.isFinite(originalPrice as number) ? originalPrice : null,
      discount: toText(formData.get("discount")) || null,
      material,
      stock,
      isNew: formData.get("isNew") === "on",
      categoryId,
    },
  });

  if (imageRows.length > 0) {
    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productImage.createMany({
      data: imageRows.map((img) => ({ productId, ...img })),
    });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/shop");
  revalidatePath(`/product/${slug}`);
}

export async function deleteProduct(productId: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
