import { NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";

// 1. GET ALL ORDERS (Newest first)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true }, 
      orderBy: { createdAt: "desc" },
    });
    // Wrapping in success/data for frontend consistency
    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// 2. CREATE NEW ORDER
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Destructure everything sent from the ShopProduct component
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
      paymentStatus,
      items, 
    } = body;

    // Generate order number
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
        paymentStatus: paymentStatus || "PENDING",
        orderStatus: "PROCESSING",
        // MAPPING TO MATCH FRONTEND KEYS EXACTLY
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,     // Matches ShopProduct mapping
            productName: item.productName, // Matches ShopProduct mapping
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
    // This will now log the specific Prisma missing argument if it happens again
    console.error("PRISMA POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}

// 3. DELETE ALL ORDERS
export async function DELETE() {
  try {
    // OrderItem has onDelete: Cascade in your schema, so deleting order deletes items
    const result = await prisma.order.deleteMany({});

    return NextResponse.json(
      { success: true, message: `Deleted ${result.count} orders successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete All Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete all orders" },
      { status: 500 }
    );
  }
}