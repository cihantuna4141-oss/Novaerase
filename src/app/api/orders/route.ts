import { NextResponse } from "next/server";
import { prisma } from "@/lib/Prismadb";

// 1. GET ALL ORDERS (Newest first)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID", // CRITICAL: Exclude PENDING or FAILED orders
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}


// 2. CREATE NEW ORDER (With Transaction)
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
      paymentReference,
      items, // Expecting an array of items
    } = body;

    // Generate a unique order number
    const orderNumber = `PMH-${Date.now().toString().slice(-6)}`;

    // Use Prisma Transaction to ensure data integrity
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
        country,
        subtotal,
        shippingCost,
        totalAmount,
        currency,
        paymentReference,
        paymentStatus: "PAID", // Assuming payment is verified via Paystack before this call
        // Nested creation of OrderItems
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            priceAtSale: item.price,
            productImage: item.image,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const deleted = await prisma.order.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        message: "Order history cleared successfully",
        count: deleted.count,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear order history" },
      { status: 500 },
    );
  }
}
