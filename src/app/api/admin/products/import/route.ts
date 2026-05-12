import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseProductCsv } from "@/lib/product-csv";
import { ensureUniqueProductSlug } from "@/lib/product-slug";
import { isExpectedSampleFallback } from "@/lib/sample-api";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data with a CSV file." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing "file" field (CSV upload).' }, { status: 400 });
  }

  const text = (await file.text()).replace(/^\uFEFF/, "");
  const parsed = parseProductCsv(text);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false as const, error: "Invalid CSV header or structure.", issues: parsed.issues },
      { status: 400 }
    );
  }

  type Skip = { row: number; message: string };
  const skipped: Skip[] = parsed.issues.map((i) => ({ row: i.row, message: i.message }));
  let imported = 0;

  try {
    for (const row of parsed.rows) {
      const category = await prisma.category.findFirst({
        where: { slug: { equals: row.categorySlug, mode: "insensitive" } },
        select: { id: true },
      });
      if (!category) {
        skipped.push({
          row: row.rowNumber,
          message: `Unknown category slug "${row.categorySlug}". Add the category under Categories first, or fix the slug (must match an existing category slug).`,
        });
        continue;
      }

      const slug = await ensureUniqueProductSlug(row.slugInput);
      const imageRows = row.imageUrls.map((url, i) => ({
        url,
        publicId: `csv/${slug}-${i}`,
        isHover: false,
        order: i,
      }));

      await prisma.product.create({
        data: {
          title: row.title,
          slug,
          description: row.description,
          price: row.price,
          originalPrice: row.originalPrice,
          discount: row.discount,
          material: row.material,
          sizes: row.sizes,
          stock: row.stock,
          isNew: row.isNew,
          isActive: true,
          categoryId: category.id,
          ...(imageRows.length > 0 ? { images: { create: imageRows } } : {}),
          ...(row.colors.length > 0 ? { colors: { create: row.colors } } : {}),
        },
      });
      imported++;
    }
  } catch (e) {
    if (isExpectedSampleFallback(e)) {
      return NextResponse.json(
        {
          ok: false as const,
          error: "Database is unavailable or not migrated. Connect the database before importing.",
        },
        { status: 503 }
      );
    }
    console.error("[POST /api/admin/products/import]", e);
    return NextResponse.json(
      {
        ok: false as const,
        error: "Import failed partway through. No further rows were processed.",
        imported,
        skipped,
      },
      { status: 500 }
    );
  }

  if (imported > 0) {
    revalidatePath("/admin/products");
    revalidatePath("/shop");
  }

  return NextResponse.json({ ok: true as const, imported, skipped });
}
