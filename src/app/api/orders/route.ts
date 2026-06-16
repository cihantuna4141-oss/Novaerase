import { NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";

// 1. GET ALL ORDERS (Must be uppercase GET)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// 2. CREATE NEW ORDER
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      houseAddress,
      streetName,
      town,
      state,
      zipCode,
      country,
      subtotal,
      shippingCost,
      totalAmount,
      currency,
      items,
    } = body;

    // Generate a unique order number
    const orderNumber = `NVR-${Math.random().toString(36).toUpperCase().substring(2, 8)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        houseAddress,
        streetName,
        town,
        state,
        zipCode,
        country: country || "USA",
        subtotal: parseFloat(subtotal),
        shippingCost: parseFloat(shippingCost),
        totalAmount: parseFloat(totalAmount),
        currency: currency || "USD",
        paymentStatus: "PENDING", 
        orderStatus: "PROCESSING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            priceAtSale: parseFloat(item.priceAtSale),
            productImage: item.productImage,
            quantity: parseInt(item.quantity),
            totalPrice: parseFloat(item.totalPrice),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 3. DELETE ALL ORDERS
export async function DELETE() {
  try {
    const result = await prisma.order.deleteMany({});
    return NextResponse.json(
      { success: true, message: `Deleted ${result.count} orders` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}