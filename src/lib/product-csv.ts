import { parseCsv } from "@/lib/csv";
import { slugify } from "@/lib/sample-api";

/** Canonical column headers for product CSV import (order used in sample file). */
export const PRODUCT_CSV_HEADERS = [
  "title",
  "slug",
  "description",
  "price",
  "originalPrice",
  "material",
  "categorySlug",
  "stock",
  "isNew",
  "sizes",
  "discount",
  "imageUrls",
  "colors",
] as const;

export type ProductCsvHeader = (typeof PRODUCT_CSV_HEADERS)[number];

function normalizeHeader(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "");
}

const HEADER_ALIASES: Record<string, ProductCsvHeader> = {
  title: "title",
  slug: "slug",
  description: "description",
  desc: "description",
  price: "price",
  originalprice: "originalPrice",
  original: "originalPrice",
  mrp: "originalPrice",
  material: "material",
  fabric: "material",
  categoryslug: "categorySlug",
  category: "categorySlug",
  categories: "categorySlug",
  stock: "stock",
  qty: "stock",
  quantity: "stock",
  isnew: "isNew",
  new: "isNew",
  newarrival: "isNew",
  sizes: "sizes",
  size: "sizes",
  discount: "discount",
  imageurls: "imageUrls",
  images: "imageUrls",
  imageurl: "imageUrls",
  colors: "colors",
  colour: "colors",
  color: "colors",
};

function buildHeaderIndex(headerRow: string[]): Map<ProductCsvHeader, number> {
  const map = new Map<ProductCsvHeader, number>();
  headerRow.forEach((cell, idx) => {
    const key = HEADER_ALIASES[normalizeHeader(cell)];
    if (key !== undefined && !map.has(key)) map.set(key, idx);
  });
  return map;
}

function parseBool(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return v === "true" || v === "yes" || v === "1" || v === "y";
}

function parseDiscountLabel(price: number, originalPrice: number | null): string | null {
  if (originalPrice === null || !Number.isFinite(originalPrice)) return null;
  if (!Number.isFinite(price) || originalPrice <= 0 || price <= 0 || originalPrice <= price) return null;
  const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
  return pct > 0 ? `${pct}% OFF` : null;
}

export type ParsedProductCsvRow = {
  rowNumber: number;
  title: string;
  slugInput: string;
  description: string;
  price: number;
  originalPrice: number | null;
  material: string;
  categorySlug: string;
  stock: number;
  isNew: boolean;
  sizes: string[];
  discount: string | null;
  imageUrls: string[];
  colors: { name: string; hex: string }[];
};

export type ProductCsvParseIssue = { row: number; message: string };

export type ProductCsvParseResult =
  | { ok: true; headers: Map<ProductCsvHeader, number>; rows: ParsedProductCsvRow[]; issues: ProductCsvParseIssue[] }
  | { ok: false; issues: ProductCsvParseIssue[] };

function parseColorsCell(raw: string): { name: string; hex: string }[] {
  const s = raw.trim();
  if (!s) return [];
  const out: { name: string; hex: string }[] = [];
  for (const part of s.split(";")) {
    const p = part.trim();
    if (!p) continue;
    const idx = p.indexOf(":");
    if (idx === -1) continue;
    const name = p.slice(0, idx).trim();
    const hex = p.slice(idx + 1).trim();
    if (name && hex) out.push({ name, hex });
  }
  return out;
}

export function parseProductCsv(text: string): ProductCsvParseResult {
  const issues: ProductCsvParseIssue[] = [];
  const matrix = parseCsv(text);
  if (matrix.length === 0) {
    return { ok: false, issues: [{ row: 0, message: "CSV is empty." }] };
  }

  const headerRow = matrix[0]!.map((c) => c.trim());
  const headers = buildHeaderIndex(headerRow);

  const required: ProductCsvHeader[] = ["title", "description", "price", "material", "categorySlug"];
  for (const key of required) {
    if (!headers.has(key)) {
      issues.push({
        row: 1,
        message: `Missing required column "${key}". Expected header row with: ${PRODUCT_CSV_HEADERS.join(", ")}.`,
      });
    }
  }
  if (issues.length > 0) return { ok: false, issues };

  const rows: ParsedProductCsvRow[] = [];

  for (let i = 1; i < matrix.length; i++) {
    const line = matrix[i]!;
    const rowNumber = i + 1;

    const get = (key: ProductCsvHeader) => {
      const idx = headers.get(key);
      if (idx === undefined) return "";
      return (line[idx] ?? "").trim();
    };

    const title = get("title");
    const description = get("description");
    const material = get("material");
    const categorySlug = get("categorySlug");
    const slugRaw = get("slug");

    if (!title) {
      issues.push({ row: rowNumber, message: "title is required." });
      continue;
    }
    if (!description) {
      issues.push({ row: rowNumber, message: "description is required." });
      continue;
    }
    if (!material) {
      issues.push({ row: rowNumber, message: "material is required." });
      continue;
    }
    if (!categorySlug) {
      issues.push({ row: rowNumber, message: "categorySlug is required." });
      continue;
    }

    const price = Number(get("price"));
    if (!Number.isFinite(price) || price < 0) {
      issues.push({ row: rowNumber, message: "price must be a non-negative number." });
      continue;
    }

    const originalRaw = get("originalPrice");
    const originalPrice =
      originalRaw.length > 0 && Number.isFinite(Number(originalRaw)) ? Number(originalRaw) : null;

    const stockRaw = get("stock");
    const stock = stockRaw.length > 0 ? Number(stockRaw) : 0;
    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      issues.push({ row: rowNumber, message: "stock must be a whole number ≥ 0." });
      continue;
    }

    const sizesRaw = get("sizes");
    const sizes = sizesRaw
      ? sizesRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const discountRaw = get("discount");
    const autoDiscount = parseDiscountLabel(price, originalPrice);
    const discount = discountRaw.length > 0 ? discountRaw : autoDiscount;

    const imageRaw = get("imageUrls");
    const imageUrls = imageRaw
      ? imageRaw
          .split("|")
          .map((u) => u.trim())
          .filter(Boolean)
      : [];

    const colors = parseColorsCell(get("colors"));

    const slugInput = slugify(slugRaw || title);
    if (!slugInput) {
      issues.push({ row: rowNumber, message: "Could not derive slug from title/slug." });
      continue;
    }

    rows.push({
      rowNumber,
      title,
      slugInput,
      description,
      price,
      originalPrice:
        originalPrice !== null && Number.isFinite(originalPrice) && originalPrice > 0 ? originalPrice : null,
      material,
      categorySlug,
      stock,
      isNew: parseBool(get("isNew")),
      sizes,
      discount,
      imageUrls,
      colors,
    });
  }

  return { ok: true, headers, rows, issues };
}

export function buildProductCsvSample(): string {
  const example = [
    "Sample Kanchipuram Silk Saree",
    "sample-kanchipuram-silk-saree",
    "Handwoven pure silk with zari border. Dry clean only.",
    "18999.00",
    "22999.00",
    "Pure Silk",
    "kanchipuram-silk",
    "12",
    "true",
    "34,36,38",
    "",
    "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg|https://res.cloudinary.com/demo/image/upload/v1/sample-hover.jpg",
    "Royal Blue:#1e3a5f;Gold:#c5a572",
  ];
  const header = PRODUCT_CSV_HEADERS.join(",");
  const row = example.map(escapeCsvField).join(",");
  return `${header}\n${row}\n`;
}

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}
