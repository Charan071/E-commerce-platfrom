import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FALLBACK_HERO } from "@/lib/content";
import { logAdminAudit } from "@/lib/admin-audit";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const item = await prisma.homeHero.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(item ?? FALLBACK_HERO);
  } catch {
    return NextResponse.json(FALLBACK_HERO);
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = (await req.json()) as Partial<typeof FALLBACK_HERO> & { imagePublicId?: string };
    const existing = await prisma.homeHero.findFirst({ orderBy: { createdAt: "asc" } });
    const payload = {
      title: body.title ?? FALLBACK_HERO.title,
      subtitle: body.subtitle ?? FALLBACK_HERO.subtitle,
      ctaLabel: body.ctaLabel ?? FALLBACK_HERO.ctaLabel,
      ctaHref: body.ctaHref ?? FALLBACK_HERO.ctaHref,
      imageUrl: body.imageUrl ?? FALLBACK_HERO.imageUrl,
      imagePublicId: body.imagePublicId ?? null,
      isActive: true,
    };

    const item = existing
      ? await prisma.homeHero.update({ where: { id: existing.id }, data: payload })
      : await prisma.homeHero.create({ data: payload });
    await logAdminAudit({
      userId: admin.userId,
      email: admin.email,
      action: "api.content.hero.upsert",
      target: existing?.id ?? "home_hero",
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[PUT /api/admin/content/hero]", error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}
