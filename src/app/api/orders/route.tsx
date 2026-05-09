import { NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";

// GET: Fetch all orders for the Admin Dashboard
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST: Save a new order from Checkout
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      address,
      city,
      paymentMethod,
      totalAmount,
      items,
    } = body;

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        city,
        paymentMethod,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            penName: item.name,
            price: item.basePrice,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
