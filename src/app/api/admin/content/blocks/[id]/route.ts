import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAudit } from "@/lib/admin-audit";

type Kind = "collection" | "nav";

function getKind(url: URL): Kind {
  const kind = url.searchParams.get("kind");
  return kind === "nav" ? "nav" : "collection";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const kind = getKind(req.nextUrl);
    const body = (await req.json()) as {
      title?: string;
      subtitle?: string;
      href?: string;
      imageUrl?: string;
      imagePublicId?: string | null;
      imageHasEmbeddedText?: boolean;
      sortOrder?: number;
      isActive?: boolean;
    };

    const data = {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.subtitle !== undefined ? { subtitle: body.subtitle } : {}),
      ...(body.href !== undefined ? { href: body.href } : {}),
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
      ...(body.imagePublicId !== undefined ? { imagePublicId: body.imagePublicId } : {}),
      ...(body.imageHasEmbeddedText !== undefined
        ? { imageHasEmbeddedText: body.imageHasEmbeddedText }
        : {}),
      ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
    };

    const item =
      kind === "nav"
        ? await prisma.navPromoBlock.update({ where: { id }, data })
        : await prisma.collectionHighlight.update({ where: { id }, data });
    await logAdminAudit({
      userId: admin.userId,
      email: admin.email,
      action: `api.content.${kind}.update`,
      target: id,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[PUT /api/admin/content/blocks/[id]]", error);
    return NextResponse.json({ error: "Failed to update content block" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const kind = getKind(req.nextUrl);
    if (kind === "nav") {
      await prisma.navPromoBlock.delete({ where: { id } });
    } else {
      await prisma.collectionHighlight.delete({ where: { id } });
    }
    await logAdminAudit({
      userId: admin.userId,
      email: admin.email,
      action: `api.content.${kind}.delete`,
      target: id,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/content/blocks/[id]]", error);
    return NextResponse.json({ error: "Failed to delete content block" }, { status: 500 });
  }
}
