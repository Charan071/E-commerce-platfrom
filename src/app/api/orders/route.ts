import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/orders — returns current user's orders
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

    const where = auth.isAdmin ? {} : { userId: auth.userId };

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

// POST /api/orders — place a new order
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { addressId, items, subtotal, shippingCost, discount, total, paymentMethod } = body;

    const order = await prisma.order.create({
      data: {
        userId: auth.userId,
        addressId,
        subtotal,
        shippingCost: shippingCost ?? 0,
        discount: discount ?? 0,
        total,
        paymentMethod,
        items: {
          create: items.map((item: {
            productId: string;
            title: string;
            imageUrl: string;
            price: number;
            quantity: number;
          }) => ({
            productId: item.productId,
            title: item.title,
            imageUrl: item.imageUrl,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: { items: true, address: true },
    });

    // Decrease stock for each item
    await Promise.all(
      items.map((item: { productId: string; quantity: number }) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
