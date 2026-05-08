import { prisma } from "@/lib/prisma";

export async function getWishlistProductIdsForUser(userId: string): Promise<Set<string>> {
  try {
    const rows = await prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
    });
    return new Set(rows.map((row) => row.productId));
  } catch {
    return new Set();
  }
}
