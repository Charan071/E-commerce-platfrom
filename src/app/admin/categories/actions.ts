"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/sample-api";

export async function createCategory(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const nameRaw = formData.get("name");
  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
  if (!name) return;

  const slug = slugify(name);
  if (!slug) return;

  try {
    await prisma.category.create({
      data: { name, slug, description: null },
    });
  } catch {
    return;
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const count = await prisma.product.count({ where: { categoryId } });
  if (count > 0) return;

  try {
    await prisma.category.delete({ where: { id: categoryId } });
  } catch {
    return;
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}
