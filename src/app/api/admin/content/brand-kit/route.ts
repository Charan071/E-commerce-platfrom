import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FALLBACK_BRAND_KIT } from "@/lib/content";
import { logAdminAudit } from "@/lib/admin-audit";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const item = await prisma.brandKit.findFirst({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(item ?? FALLBACK_BRAND_KIT);
  } catch {
    return NextResponse.json(FALLBACK_BRAND_KIT);
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = (await req.json()) as Partial<typeof FALLBACK_BRAND_KIT>;
    const existing = await prisma.brandKit.findFirst({ orderBy: { createdAt: "asc" } });
    const payload = {
      brandName: body.brandName ?? FALLBACK_BRAND_KIT.brandName,
      tagline: body.tagline ?? FALLBACK_BRAND_KIT.tagline,
      voice: body.voice ?? FALLBACK_BRAND_KIT.voice,
      primaryColor: body.primaryColor ?? FALLBACK_BRAND_KIT.primaryColor,
      secondaryColor: body.secondaryColor ?? FALLBACK_BRAND_KIT.secondaryColor,
      accentColor: body.accentColor ?? FALLBACK_BRAND_KIT.accentColor,
      surfaceColor: body.surfaceColor ?? FALLBACK_BRAND_KIT.surfaceColor,
      mutedTextColor: body.mutedTextColor ?? FALLBACK_BRAND_KIT.mutedTextColor,
      headingFont: body.headingFont ?? FALLBACK_BRAND_KIT.headingFont,
      bodyFont: body.bodyFont ?? FALLBACK_BRAND_KIT.bodyFont,
      navLetterSpacing: body.navLetterSpacing ?? FALLBACK_BRAND_KIT.navLetterSpacing,
    };

    const item = existing
      ? await prisma.brandKit.update({ where: { id: existing.id }, data: payload })
      : await prisma.brandKit.create({ data: payload });
    await logAdminAudit({
      userId: admin.userId,
      email: admin.email,
      action: "api.content.brand_kit.upsert",
      target: existing?.id ?? "brand_kit",
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[PUT /api/admin/content/brand-kit]", error);
    return NextResponse.json({ error: "Failed to update brand kit" }, { status: 500 });
  }
}
