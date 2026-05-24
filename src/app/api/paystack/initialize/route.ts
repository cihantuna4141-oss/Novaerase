import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      email, 
      amount, // In Pesewas
      subtotal, // In Cedi
      shippingCost, // In Cedis
      fullName, 
      items, 
      shipping, 
      addressDetails 
    } = body;

    // --- Validate Financial Data ---
    const finalSubtotal = parseFloat(subtotal);
    const finalShippingCost = parseFloat(shippingCost);
    const finalTotalAmount = amount / 100;

    if (isNaN(finalSubtotal) || isNaN(finalShippingCost)) {
      console.error("Invalid Financial Data:", { subtotal, shippingCost });
      return NextResponse.json(
        { message: "Invalid calculation data. Please retry." }, 
        { status: 400 }
      );
    }

    // 1. Create a Pending Order in Prisma
    const order = await prisma.order.create({
      data: {
        orderNumber: `PMH-${Date.now().toString().slice(-6)}`,
        customerName: fullName,
        customerEmail: email,
        customerPhone: addressDetails.phone,
        houseAddress: addressDetails.address,
        streetName: addressDetails.streetName || "N/A",
        town: addressDetails.town,
        state: addressDetails.state || "N/A",
        zipCode: addressDetails.zipCode,
        country: shipping.location,
        
        // Correctly typed float values
        subtotal: finalSubtotal,
        shippingCost: finalShippingCost,
        totalAmount: finalTotalAmount,
        
        paymentStatus: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            priceAtSale: item.totalPrice / item.quantity,
            productImage: item.image, 
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    // 2. Initialize Paystack
    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount, 
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`, 
          metadata: {
            orderId: order.id,
            custom_fields: [
              {
                display_name: "Order Number",
                variable_name: "order_no",
                value: order.orderNumber,
              },
            ],
          },
        }),
      },
    );

    const data = await paystackRes.json();

    if (!data.status) throw new Error(data.message);

    return NextResponse.json({ url: data.data.authorization_url });
  } catch (error: any) {
    console.error("Order Init Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}