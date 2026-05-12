import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/mock-data";
import type { PrismaClient } from "@prisma/client";

/** Where-clause types derived from the client (avoids `import type { Prisma }` — unreliable on some CI/Vercel type resolutions). */
type OrderWhereInput = NonNullable<Parameters<PrismaClient["order"]["findMany"]>[0]>["where"];
type ProductWhereInput = NonNullable<Parameters<PrismaClient["product"]["findMany"]>[0]>["where"];

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const PAYMENT_STATUSES = [
  "UNPAID",
  "PAID",
  "PARTIALLY_REFUNDED",
  "REFUNDED",
  "FAILED",
] as const;

export const PRODUCT_STATUSES = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"] as const;

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  itemCount: number;
};

export type AdminProductRow = {
  id: string;
  title: string;
  slug: string;
  sku: string;
  category: string;
  material: string;
  price: number;
  stock: number;
  status: string;
  imageUrl: string;
};

export type AdminDashboardData = {
  metrics: {
    revenue: number;
    orders: number;
    pendingOrders: number;
    activeProducts: number;
    customers: number;
    /** Sum of order totals in the last 30 days */
    revenueLast30Days: number;
    ordersLast30Days: number;
    customersLast30Days: number;
    /** Delivered orders ÷ all orders (%) */
    deliveredSharePct: number | null;
  };
  recentOrders: AdminOrderRow[];
  lowStockProducts: AdminProductRow[];
  categoryBreakdown: { name: string; count: number }[];
  salesSeries: { label: string; value: number }[];
  source: "database" | "sample";
};

export type AdminOrdersData = {
  metrics: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    ordersLast30Days: number;
  };
  orders: AdminOrderRow[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  source: "database" | "sample";
};

export type AdminProductsData = {
  metrics: {
    total: number;
    categories: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
    productsCreatedLast30Days: number;
    categoriesCreatedLast30Days: number;
  };
  products: AdminProductRow[];
  categories: { name: string; slug: string }[];
  materials: string[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  source: "database" | "sample";
};

type SearchParamsInput = Record<string, string | string[] | undefined>;

const SAMPLE_ORDERS: AdminOrderRow[] = [
  {
    id: "sample-order-1",
    orderNumber: "AS1001",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@email.com",
    customerPhone: "+91 98765 43210",
    createdAt: "2024-05-24T10:30:00+05:30",
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentMethod: "COD",
    total: 14800,
    itemCount: 2,
  },
  {
    id: "sample-order-2",
    orderNumber: "AS1002",
    customerName: "Neha Verma",
    customerEmail: "neha.verma@email.com",
    customerPhone: "+91 91234 56789",
    createdAt: "2024-05-24T09:15:00+05:30",
    status: "PROCESSING",
    paymentStatus: "PAID",
    paymentMethod: "Razorpay",
    total: 10500,
    itemCount: 1,
  },
  {
    id: "sample-order-3",
    orderNumber: "AS1003",
    customerName: "Anjali Reddy",
    customerEmail: "anjali.reddy@email.com",
    customerPhone: "+91 99876 54321",
    createdAt: "2024-05-23T20:45:00+05:30",
    status: "SHIPPED",
    paymentStatus: "PAID",
    paymentMethod: "Razorpay",
    total: 13200,
    itemCount: 3,
  },
  {
    id: "sample-order-4",
    orderNumber: "AS1004",
    customerName: "Kavya Iyer",
    customerEmail: "kavya.iyer@email.com",
    customerPhone: "+91 90087 65432",
    createdAt: "2024-05-23T18:20:00+05:30",
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "UPI",
    total: 10900,
    itemCount: 1,
  },
  {
    id: "sample-order-5",
    orderNumber: "AS1005",
    customerName: "Meera Joshi",
    customerEmail: "meera.joshi@email.com",
    customerPhone: "+91 88991 23456",
    createdAt: "2024-05-22T16:10:00+05:30",
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "Credit Card",
    total: 9800,
    itemCount: 2,
  },
  {
    id: "sample-order-6",
    orderNumber: "AS1006",
    customerName: "Sakshi Patil",
    customerEmail: "sakshi.patil@email.com",
    customerPhone: "+91 77654 32109",
    createdAt: "2024-05-22T11:05:00+05:30",
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    paymentMethod: "Razorpay",
    total: 11200,
    itemCount: 1,
  },
  {
    id: "sample-order-7",
    orderNumber: "AS1007",
    customerName: "Riya Kapoor",
    customerEmail: "riya.kapoor@email.com",
    customerPhone: "+91 76543 21098",
    createdAt: "2024-05-21T09:30:00+05:30",
    status: "PROCESSING",
    paymentStatus: "UNPAID",
    paymentMethod: "COD",
    total: 12500,
    itemCount: 2,
  },
  {
    id: "sample-order-8",
    orderNumber: "AS1008",
    customerName: "Pooja Nair",
    customerEmail: "pooja.nair@email.com",
    customerPhone: "+91 81234 56700",
    createdAt: "2024-05-21T07:45:00+05:30",
    status: "SHIPPED",
    paymentStatus: "PAID",
    paymentMethod: "UPI",
    total: 15600,
    itemCount: 3,
  },
];

const SAMPLE_PRODUCTS: AdminProductRow[] = PRODUCTS.map((product, index) => ({
  id: product.id,
  title: product.title,
  slug: product.id,
  sku: `ASK${String(index + 1).padStart(3, "0")}`,
  category: product.category,
  material: product.material,
  price: product.price,
  stock: product.stock,
  status: productStatus(product.stock),
  imageUrl: product.image,
}));

const SAMPLE_SALES = [
  { label: "Thu", value: 62000 },
  { label: "Fri", value: 84000 },
  { label: "Sat", value: 76000 },
  { label: "Sun", value: 94000 },
  { label: "Mon", value: 118000 },
  { label: "Tue", value: 73000 },
  { label: "Wed", value: 132000 },
];

function productStatus(stock: number) {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= 5) return "LOW_STOCK";
  return "IN_STOCK";
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value ?? 0);
}

function firstParam(params: SearchParamsInput, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function getPage(params: SearchParamsInput) {
  const raw = Number(firstParam(params, "page") ?? "1");
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
}

export function getTextFilter(params: SearchParamsInput, key: string) {
  return firstParam(params, key)?.trim() || undefined;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export function toSearchParams(params: SearchParamsInput) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const item = Array.isArray(value) ? value[0] : value;
    if (item) next.set(key, item);
  });
  return next;
}

function normalizeOrder(order: {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  total: unknown;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  user?: { name: string | null; email: string; phone: string | null } | null;
  address?: { fullName: string; phone: string } | null;
  items?: unknown[];
}): AdminOrderRow {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.address?.fullName ?? order.customerName ?? order.user?.name ?? "Customer",
    customerEmail: order.customerEmail ?? order.user?.email ?? "",
    customerPhone: order.address?.phone ?? order.customerPhone ?? order.user?.phone ?? "",
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod ?? "Not set",
    total: toNumber(order.total),
    itemCount: order.items?.length ?? 0,
  };
}

function normalizeProduct(product: {
  id: string;
  title: string;
  slug: string;
  material: string;
  price: unknown;
  stock: number;
  category?: { name: string } | null;
  images?: { url: string }[];
}): AdminProductRow {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    sku: `AS${product.id.slice(0, 6).toUpperCase()}`,
    category: product.category?.name ?? "Uncategorized",
    material: product.material,
    price: toNumber(product.price),
    stock: product.stock,
    status: productStatus(product.stock),
    imageUrl: product.images?.[0]?.url ?? "/images/saree-1.png",
  };
}

function paginateSample<T>(items: T[], page: number, limit: number) {
  if (items.length === 0) return [];
  const start = (page - 1) * limit;
  const cycled = Array.from({ length: Math.ceil((start + limit) / items.length) + 1 }, () => items).flat();
  return cycled.slice(start, start + limit);
}

export async function getAdminOrders(params: SearchParamsInput): Promise<AdminOrdersData> {
  const page = getPage(params);
  const limit = 8;
  const skip = (page - 1) * limit;
  const q = getTextFilter(params, "q");
  const status = getTextFilter(params, "status");
  const paymentStatus = getTextFilter(params, "paymentStatus");

  try {
    const where: OrderWhereInput = {};

    if (status && ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
      where.status = status as (typeof ORDER_STATUSES)[number];
    }

    if (paymentStatus && PAYMENT_STATUSES.includes(paymentStatus as (typeof PAYMENT_STATUSES)[number])) {
      where.paymentStatus = paymentStatus as (typeof PAYMENT_STATUSES)[number];
    }

    if (q) {
      where.OR = [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { user: { is: { name: { contains: q, mode: "insensitive" } } } },
        { user: { is: { email: { contains: q, mode: "insensitive" } } } },
        { address: { is: { fullName: { contains: q, mode: "insensitive" } } } },
        { address: { is: { phone: { contains: q, mode: "insensitive" } } } },
      ];
    }

    const since30 = new Date();
    since30.setDate(since30.getDate() - 30);
    since30.setHours(0, 0, 0, 0);

    const [orders, total, pending, processing, shipped, delivered, ordersLast30Days] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          address: { select: { fullName: true, phone: true } },
          items: { select: { id: true } },
        },
      }),
      prisma.order.count({ where }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { createdAt: { gte: since30 } } }),
    ]);

    return {
      metrics: { total, pending, processing, shipped, delivered, ordersLast30Days },
      orders: orders.map(normalizeOrder),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
      source: "database",
    };
  } catch (error) {
    console.error("[admin orders data]", error);
    const total = 356;
    return {
      metrics: { total, pending: 28, processing: 42, shipped: 182, delivered: 104, ordersLast30Days: 28 },
      orders: paginateSample(SAMPLE_ORDERS, page, limit),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      source: "sample",
    };
  }
}

export async function getAdminProducts(params: SearchParamsInput): Promise<AdminProductsData> {
  const page = getPage(params);
  const limit = 6;
  const skip = (page - 1) * limit;
  const q = getTextFilter(params, "q");
  const category = getTextFilter(params, "category");
  const material = getTextFilter(params, "material");
  const status = getTextFilter(params, "status");

  try {
    const where: ProductWhereInput = { isActive: true };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { material: { contains: q, mode: "insensitive" } },
        { category: { is: { name: { contains: q, mode: "insensitive" } } } },
      ];
    }

    if (category) where.category = { slug: category };
    if (material) where.material = material;
    if (status === "IN_STOCK") where.stock = { gt: 5 };
    if (status === "LOW_STOCK") where.stock = { gt: 0, lte: 5 };
    if (status === "OUT_OF_STOCK") where.stock = 0;

    const since30 = new Date();
    since30.setDate(since30.getDate() - 30);
    since30.setHours(0, 0, 0, 0);

    const [products, total, allProducts, categories, productsCreatedLast30Days, categoriesCreatedLast30Days] =
      await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
        },
      }),
      prisma.product.count({ where }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { price: true, stock: true, material: true },
      }),
      prisma.category.findMany({
        select: { name: true, slug: true },
        orderBy: { name: "asc" },
      }),
      prisma.product.count({
        where: { isActive: true, createdAt: { gte: since30 } },
      }),
      prisma.category.count({
        where: { createdAt: { gte: since30 } },
      }),
    ]);

    const totalValue = allProducts.reduce(
      (sum, product) => sum + toNumber(product.price) * product.stock,
      0
    );
    const materials = Array.from(new Set(allProducts.map((product) => product.material))).sort();

    return {
      metrics: {
        total: allProducts.length,
        categories: categories.length,
        lowStock: allProducts.filter((product) => product.stock > 0 && product.stock <= 5).length,
        outOfStock: allProducts.filter((product) => product.stock <= 0).length,
        totalValue,
        productsCreatedLast30Days,
        categoriesCreatedLast30Days,
      },
      products: products.map(normalizeProduct),
      categories,
      materials,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
      source: "database",
    };
  } catch (error) {
    console.error("[admin products data]", error);
    const total = 248;
    const categories = Array.from(new Set(PRODUCTS.map((product) => product.category))).map((name) => ({
      name,
      slug: name.toLowerCase().replaceAll(" ", "-"),
    }));
    const materials = Array.from(new Set(PRODUCTS.map((product) => product.material))).sort();

    return {
      metrics: {
        total,
        categories: 12,
        lowStock: 18,
        outOfStock: 7,
        totalValue: 1875450,
        productsCreatedLast30Days: 0,
        categoriesCreatedLast30Days: 0,
      },
      products: paginateSample(SAMPLE_PRODUCTS, page, limit),
      categories,
      materials,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      source: "sample",
    };
  }
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  try {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const since30 = new Date(today);
    since30.setDate(today.getDate() - 30);
    since30.setHours(0, 0, 0, 0);

    const [
      revenue,
      orders,
      pendingOrders,
      activeProducts,
      customers,
      recentOrders,
      lowStockProducts,
      categoryBreakdown,
      salesOrders,
      revenue30Agg,
      customersLast30Days,
      ordersLast30Days,
      deliveredOrderCount,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          address: { select: { fullName: true, phone: true } },
          items: { select: { id: true } },
        },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lte: 5 } },
        take: 5,
        orderBy: { stock: "asc" },
        include: {
          category: { select: { name: true } },
          images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
        },
      }),
      prisma.category.findMany({
        take: 5,
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: start } },
        select: { createdAt: true, total: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: since30 } },
        _sum: { total: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: since30 } } }),
      prisma.order.count({ where: { createdAt: { gte: since30 } } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
    ]);

    const salesSeries = buildSalesSeries(start, salesOrders);
    const revenueLast30Days = toNumber(revenue30Agg._sum.total);
    const deliveredSharePct =
      orders > 0 ? Math.round((deliveredOrderCount / orders) * 100) : null;

    return {
      metrics: {
        revenue: toNumber(revenue._sum.total),
        orders,
        pendingOrders,
        activeProducts,
        customers,
        revenueLast30Days,
        ordersLast30Days,
        customersLast30Days,
        deliveredSharePct,
      },
      recentOrders: recentOrders.map(normalizeOrder),
      lowStockProducts: lowStockProducts.map(normalizeProduct),
      categoryBreakdown: categoryBreakdown.map((category) => ({
        name: category.name,
        count: category._count.products,
      })),
      salesSeries,
      source: "database",
    };
  } catch (error) {
    console.error("[admin dashboard data]", error);
    return {
      metrics: {
        revenue: 487650,
        orders: 356,
        pendingOrders: 28,
        activeProducts: 248,
        customers: 1214,
        revenueLast30Days: 0,
        ordersLast30Days: 0,
        customersLast30Days: 0,
        deliveredSharePct: null,
      },
      recentOrders: SAMPLE_ORDERS.slice(0, 5),
      lowStockProducts: SAMPLE_PRODUCTS.filter((product) => product.stock <= 5).slice(0, 5),
      categoryBreakdown: [
        { name: "Kanchipuram Silk", count: 132 },
        { name: "Banarasi Silk", count: 48 },
        { name: "Tussar Silk", count: 26 },
        { name: "Cotton Silk", count: 24 },
        { name: "Organza", count: 18 },
      ],
      salesSeries: SAMPLE_SALES,
      source: "sample",
    };
  }
}

function buildSalesSeries(
  start: Date,
  orders: { createdAt: Date; total: unknown }[]
): { label: string; value: number }[] {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });

  return days.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const value = orders
      .filter((order) => order.createdAt.toISOString().slice(0, 10) === key)
      .reduce((sum, order) => sum + toNumber(order.total), 0);

    return {
      label: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date),
      value,
    };
  });
}
