import { NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";

// 1. GET ALL ORDERS (Newest first)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true }, // Include nested items (with images)
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// 2. CREATE NEW ORDER (Manual Entry)
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
      paymentStatus, // Allow manual setting of status (e.g. PAID)
      items, // Expecting an array of items with images
    } = body;

    // Generate a unique order number if not provided
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
        subtotal: parseFloat(subtotal),
        shippingCost: parseFloat(shippingCost),
        totalAmount: parseFloat(totalAmount),
        currency: currency || "GHS",
        paymentReference,
        paymentStatus: paymentStatus || "PENDING", 
        // Nested creation of OrderItems
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            priceAtSale: parseFloat(item.price),
            productImage: item.image, // <--- SAVING IMAGE URL
            quantity: parseInt(item.quantity),
            totalPrice: parseFloat(item.totalPrice),
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

// 3. DELETE ALL ORDERS (Dangerous!)
export async function DELETE() {
  try {
    // Delete all OrderItems first (due to foreign key constraints, though Cascade should handle it)
    await prisma.orderItem.deleteMany({});
    
    // Delete all Orders
    const result = await prisma.order.deleteMany({});

    return NextResponse.json(
      { message: `Deleted ${result.count} orders successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete All Error:", error);
    return NextResponse.json(
      { error: "Failed to delete all orders" },
      { status: 500 }
    );
  }
}