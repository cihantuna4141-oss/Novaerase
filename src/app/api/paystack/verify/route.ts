import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";
import { sendStatusEmail } from "@/lib/Mail"; 

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ message: "No reference provided" }, { status: 400 });
    }

    // 1. Verify with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await verifyRes.json();

    if (!data.status || data.data.status !== "success") {
      return NextResponse.json({ message: "Payment verification failed at Paystack" }, { status: 400 });
    }

    const orderId = data.data.metadata.orderId;

    // 2. Check if already paid to avoid double emails
    const existingOrder = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (existingOrder?.paymentStatus === "PAID") {
        return NextResponse.json({ message: "Order already verified" }, { status: 200 });
    }

    // 3. Update Order in DB to PAID
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        paymentReference: reference,
      },
      include: { items: true }, // IMPORTANT: Include items for the email
    });

    // 4. Send Confirmation Email
    try {
      await sendStatusEmail(updatedOrder, "PROCESSING"); // "PROCESSING" implies paid & preparing
      console.log(`Email sent for Order #${updatedOrder.orderNumber}`);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // We don't fail the request here, because payment WAS successful
    }

    return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}