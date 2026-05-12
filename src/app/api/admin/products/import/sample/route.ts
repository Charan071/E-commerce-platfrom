import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { buildProductCsvSample } from "@/lib/product-csv";

/** Admin-only: downloadable CSV template with header row and one example line. */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const csv = buildProductCsvSample();
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="anavasilks-products-sample.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
