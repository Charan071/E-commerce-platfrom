import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getSampleProducts, isExpectedSampleFallback } from "@/lib/sample-api";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products — list with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const isNew = searchParams.get("isNew");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(isNew === "true" && { isNew: true }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { order: "asc" } },
          colors: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (!isExpectedSampleFallback(error)) {
      console.error("[GET /api/products]", error);
    }

    const { searchParams } = req.nextUrl;
    return NextResponse.json(
      getSampleProducts({
        category: searchParams.get("category"),
        isNew: searchParams.get("isNew"),
        search: searchParams.get("search"),
        page: parseInt(searchParams.get("page") ?? "1"),
        limit: parseInt(searchParams.get("limit") ?? "12"),
      })
    );
  }
}

// Admin-only product creation.
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, description, price, originalPrice, discount, material, sizes, stock, isNew, categoryId, colors, images } = body;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        originalPrice,
        discount,
        material,
        sizes: sizes ?? [],
        stock: stock ?? 0,
        isNew: isNew ?? false,
        categoryId,
        colors: { create: colors ?? [] },
        images: { create: images ?? [] },
      },
      include: { images: true, colors: true, category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
