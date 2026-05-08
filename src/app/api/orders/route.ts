import { getAuthContext, isAdminFromDatabase } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

type ShippingAddressInput = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  line1?: unknown;
  line2?: unknown;
  city?: unknown;
  state?: unknown;
  pincode?: unknown;
  country?: unknown;
};

class OrderRequestError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalString(value: unknown) {
  const text = readString(value);
  return text.length > 0 ? text : undefined;
}

function readMoney(value: unknown, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new OrderRequestError("Invalid order amount.");
  }
  return parsed;
}

function normalizeItems(value: unknown): OrderItemInput[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new OrderRequestError("Your cart is empty.");
  }

  const items = value.map((item) => {
    if (!item || typeof item !== "object") {
      throw new OrderRequestError("Invalid cart item.");
    }

    const record = item as Record<string, unknown>;
    const productId = readString(record.productId);
    const quantity = Number(record.quantity);

    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new OrderRequestError("Invalid cart item.");
    }

    return { productId, quantity };
  });

  const merged = new Map<string, number>();
  for (const item of items) {
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }

  return Array.from(merged.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

function normalizeShippingAddress(value: unknown) {
  if (!value || typeof value !== "object") {
    throw new OrderRequestError("Shipping address is required.");
  }

  const address = value as ShippingAddressInput;
  const normalized = {
    fullName: readString(address.fullName),
    email: readString(address.email).toLowerCase(),
    phone: readString(address.phone),
    line1: readString(address.line1),
    line2: readOptionalString(address.line2),
    city: readString(address.city),
    state: readString(address.state),
    pincode: readString(address.pincode),
    country: readOptionalString(address.country) ?? "India",
  };

  if (
    !normalized.fullName ||
    !normalized.email ||
    !normalized.email.includes("@") ||
    !normalized.phone ||
    !normalized.line1 ||
    !normalized.city ||
    !normalized.state ||
    !normalized.pincode
  ) {
    throw new OrderRequestError("Complete the required shipping fields.");
  }

  return normalized;
}

// GET /api/orders - returns current user's orders, or all orders for admins.
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext();

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    const isAdmin = auth.isAdmin || (await isAdminFromDatabase(auth.userId));
    const where = isAdmin ? {} : { userId: auth.userId };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: { select: { title: true } } } },
          address: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders - place a new order. Guest checkout is allowed.
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    const body = await req.json();
    const items = normalizeItems(body.items);
    const shippingAddress = normalizeShippingAddress(body.shippingAddress);
    const shippingCost = readMoney(body.shippingCost, 0);
    const discount = readMoney(body.discount, 0);
    const paymentMethod = readOptionalString(body.paymentMethod)?.toUpperCase() ?? "COD";
    const saveAddress = body.saveAddress === true;
    const requestedAddressId = readOptionalString(body.addressId);

    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: items.map((item) => item.productId) },
          isActive: true,
        },
        include: {
          images: { orderBy: { order: "asc" } },
        },
      });

      if (products.length !== items.length) {
        throw new OrderRequestError("Some cart items are no longer available.");
      }

      const productById = new Map(products.map((product) => [product.id, product]));
      const orderItems = items.map((item) => {
        const product = productById.get(item.productId);
        if (!product) {
          throw new OrderRequestError("Some cart items are no longer available.");
        }
        if (product.stock < item.quantity) {
          throw new OrderRequestError(`${product.title} has only ${product.stock} left in stock.`);
        }

        const price = Number(product.price);
        const primaryImage = product.images.find((image) => !image.isHover)?.url ?? product.images[0]?.url ?? "";

        return {
          productId: product.id,
          title: product.title,
          imageUrl: primaryImage,
          price,
          quantity: item.quantity,
          subtotal: price * item.quantity,
        };
      });

      const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      const total = Math.max(0, subtotal + shippingCost - discount);

      let addressId: string | undefined;

      if (auth) {
        await tx.user.upsert({
          where: { id: auth.userId },
          update: {
            email: auth.email ?? shippingAddress.email,
            name: auth.name ?? shippingAddress.fullName,
            phone: shippingAddress.phone,
          },
          create: {
            id: auth.userId,
            email: auth.email ?? shippingAddress.email,
            name: auth.name ?? shippingAddress.fullName,
            phone: shippingAddress.phone,
          },
        });

        if (requestedAddressId) {
          const existingAddress = await tx.address.findFirst({
            where: { id: requestedAddressId, userId: auth.userId },
            select: { id: true },
          });

          if (!existingAddress) {
            throw new OrderRequestError("Selected address was not found.");
          }

          addressId = existingAddress.id;
        } else if (saveAddress) {
          const addressCount = await tx.address.count({ where: { userId: auth.userId } });
          const address = await tx.address.create({
            data: {
              userId: auth.userId,
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              line1: shippingAddress.line1,
              line2: shippingAddress.line2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              pincode: shippingAddress.pincode,
              country: shippingAddress.country,
              isDefault: addressCount === 0,
            },
            select: { id: true },
          });
          addressId = address.id;
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          userId: auth?.userId,
          addressId,
          customerName: shippingAddress.fullName,
          customerEmail: shippingAddress.email,
          customerPhone: shippingAddress.phone,
          shippingLine1: shippingAddress.line1,
          shippingLine2: shippingAddress.line2,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingPincode: shippingAddress.pincode,
          shippingCountry: shippingAddress.country,
          subtotal,
          shippingCost,
          discount,
          total,
          paymentMethod,
          items: {
            create: orderItems,
          },
        },
        include: { items: true, address: true },
      });

      for (const item of items) {
        const stockUpdate = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (stockUpdate.count !== 1) {
          throw new OrderRequestError("One or more items no longer have enough stock.");
        }
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof OrderRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
