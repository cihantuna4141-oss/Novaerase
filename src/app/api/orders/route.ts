import { prisma } from "@/lib/Prismadb";
import { NextResponse } from "next/server";


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
      items, // This is already mapped by the frontend
    } = body; 

    const orderNumber = `NM-${Date.now().toString().slice(-6)}`;

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
        currency: currency || "USD",
        paymentStatus: "PENDING", // Should be PENDING until Stripe confirms
        orderStatus: "PROCESSING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,     // Use the names sent by frontend
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
      { success: false, message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}