import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function readProductId(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: auth.userId },
      select: { productId: true },
    });
    return NextResponse.json({ productIds: items.map((item) => item.productId) });
  } catch (error) {
    console.error("[GET /api/wishlist]", error);
    return NextResponse.json({ error: "Failed to load wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const productId = readProductId(
    body && typeof body === "object" ? (body as Record<string, unknown>).productId : undefined
  );
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId: auth.userId, productId },
      },
      create: { userId: auth.userId, productId },
      update: {},
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/wishlist]", error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const productId = readProductId(
    body && typeof body === "object" ? (body as Record<string, unknown>).productId : undefined
  );
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: auth.userId, productId },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/wishlist]", error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}
