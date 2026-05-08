"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAudit } from "@/lib/admin-audit";

function parseNumber(value: FormDataEntryValue | null, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export async function updateBrandKit(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const existing = await prisma.brandKit.findFirst({ orderBy: { createdAt: "asc" } });
  const data = {
    brandName: String(formData.get("brandName") ?? "AnavaSilks"),
    tagline: String(formData.get("tagline") ?? "Silk and Sarees"),
    voice: String(formData.get("voice") ?? ""),
    primaryColor: String(formData.get("primaryColor") ?? "#171717"),
    secondaryColor: String(formData.get("secondaryColor") ?? "#f6f4f0"),
    accentColor: String(formData.get("accentColor") ?? "#8b6a3e"),
    surfaceColor: String(formData.get("surfaceColor") ?? "#ffffff"),
    mutedTextColor: String(formData.get("mutedTextColor") ?? "#6b6b6b"),
    headingFont: String(formData.get("headingFont") ?? "Playfair Display"),
    bodyFont: String(formData.get("bodyFont") ?? "Inter"),
    navLetterSpacing: String(formData.get("navLetterSpacing") ?? "0.22em"),
  };

  if (existing) {
    await prisma.brandKit.update({ where: { id: existing.id }, data });
  } else {
    await prisma.brandKit.create({ data });
  }
  await logAdminAudit({
    userId: admin.userId,
    email: admin.email,
    action: "content.brand_kit.upsert",
    target: "brand_kit",
  });

  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function upsertHero(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const existing = await prisma.homeHero.findFirst({ orderBy: { createdAt: "asc" } });
  const data = {
    title: String(formData.get("title") ?? "Whisper of Summer"),
    subtitle: String(formData.get("subtitle") ?? ""),
    ctaLabel: String(formData.get("ctaLabel") ?? "Shop Here"),
    ctaHref: String(formData.get("ctaHref") ?? "/collections"),
    imageUrl: String(formData.get("imageUrl") ?? "/images/hero.png"),
    imagePublicId: (formData.get("imagePublicId") as string) || null,
    isActive: formData.get("isActive") === "on",
  };

  if (existing) {
    await prisma.homeHero.update({ where: { id: existing.id }, data });
  } else {
    await prisma.homeHero.create({ data });
  }
  await logAdminAudit({
    userId: admin.userId,
    email: admin.email,
    action: "content.hero.upsert",
    target: existing?.id ?? "home_hero",
  });

  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function addCollectionHighlight(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const item = await prisma.collectionHighlight.create({
    data: {
      title: String(formData.get("title") ?? "New Highlight"),
      subtitle: String(formData.get("subtitle") ?? ""),
      href: String(formData.get("href") ?? "/collections"),
      imageUrl: String(formData.get("imageUrl") ?? "/images/cat-1.png"),
      imagePublicId: (formData.get("imagePublicId") as string) || null,
      imageHasEmbeddedText: formData.get("imageHasEmbeddedText") === "on",
      sortOrder: parseNumber(formData.get("sortOrder"), 0),
      isActive: formData.get("isActive") === "on",
    },
  });
  await logAdminAudit({
    userId: admin.userId,
    email: admin.email,
    action: "content.collection_highlight.create",
    target: item.id,
  });

  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function addNavPromo(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const item = await prisma.navPromoBlock.create({
    data: {
      title: String(formData.get("title") ?? "Promo"),
      subtitle: String(formData.get("subtitle") ?? ""),
      href: String(formData.get("href") ?? "/collections"),
      imageUrl: String(formData.get("imageUrl") ?? "/images/cat-1.png"),
      imagePublicId: (formData.get("imagePublicId") as string) || null,
      imageHasEmbeddedText: formData.get("imageHasEmbeddedText") === "on",
      sortOrder: parseNumber(formData.get("sortOrder"), 0),
      isActive: formData.get("isActive") === "on",
    },
  });
  await logAdminAudit({
    userId: admin.userId,
    email: admin.email,
    action: "content.nav_promo.create",
    target: item.id,
  });

  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function deleteCollectionHighlight(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;
  await prisma.collectionHighlight.delete({ where: { id } });
  await logAdminAudit({
    userId: admin.userId,
    email: admin.email,
    action: "content.collection_highlight.delete",
    target: id,
  });
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function deleteNavPromo(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;
  await prisma.navPromoBlock.delete({ where: { id } });
  await logAdminAudit({
    userId: admin.userId,
    email: admin.email,
    action: "content.nav_promo.delete",
    target: id,
  });
  revalidatePath("/admin/content");
  revalidatePath("/");
}
