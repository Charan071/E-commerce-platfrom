import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAudit } from "@/lib/admin-audit";

type Kind = "collection" | "nav";

function getKind(url: URL): Kind {
  const kind = url.searchParams.get("kind");
  return kind === "nav" ? "nav" : "collection";
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const kind = getKind(req.nextUrl);
  const items =
    kind === "nav"
      ? await prisma.navPromoBlock.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
      : await prisma.collectionHighlight.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const kind = getKind(req.nextUrl);
    const body = (await req.json()) as {
      title: string;
      subtitle?: string;
      href?: string;
      imageUrl: string;
      imagePublicId?: string;
      imageHasEmbeddedText?: boolean;
      sortOrder?: number;
      isActive?: boolean;
    };

    const data = {
      title: body.title,
      subtitle: body.subtitle ?? "",
      href: body.href ?? "/collections",
      imageUrl: body.imageUrl,
      imagePublicId: body.imagePublicId ?? null,
      imageHasEmbeddedText: body.imageHasEmbeddedText ?? false,
      sortOrder: body.sortOrder ?? 0,
      isActive: body.isActive ?? true,
    };

    const item =
      kind === "nav"
        ? await prisma.navPromoBlock.create({ data })
        : await prisma.collectionHighlight.create({ data });
    await logAdminAudit({
      userId: admin.userId,
      email: admin.email,
      action: `api.content.${kind}.create`,
      target: item.id,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/content/blocks]", error);
    return NextResponse.json({ error: "Failed to create content block" }, { status: 500 });
  }
}
