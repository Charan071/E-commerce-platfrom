import { prisma } from "@/lib/prisma";

export async function ensureUniqueProductSlug(baseSlug: string, excludeId?: string) {
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
