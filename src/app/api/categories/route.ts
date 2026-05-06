import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getSampleCategories, isExpectedSampleFallback } from "@/lib/sample-api";
import { NextResponse } from "next/server";

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    if (!isExpectedSampleFallback(error)) {
      console.error("[GET /api/categories]", error);
    }

    return NextResponse.json(getSampleCategories());
  }
}

// POST /api/categories — admin
export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description, imageUrl } = body;

    const category = await prisma.category.create({
      data: { name, slug, description, imageUrl },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("[POST /api/categories]", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
