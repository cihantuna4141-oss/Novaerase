import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";
import { sendStatusEmail } from "@/lib/Mail"; 

// Simple Verification Endpoint called from /success page or Webhook
export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    // 1. Verify with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await verifyRes.json();

    if (!data.status || data.data.status !== "success") {
        return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    const orderId = data.data.metadata.orderId;

    // 2. Update Order in DB
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus: "PAID",
        paymentReference: reference
      },
      include: { items: true } // Need items for email
    });

    // 3. Send Success Email with Products
    await sendStatusEmail(order, "PROCESSING");

    return NextResponse.json({ message: "Order verified and email sent" });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}