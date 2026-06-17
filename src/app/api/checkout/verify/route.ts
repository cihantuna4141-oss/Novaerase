import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/Prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any, 
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // 2. Update the order in Prisma
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            paymentReference: session.id,
          },
        });
        return NextResponse.json({ success: true, order: updatedOrder });
      }
    }

    return NextResponse.json({ success: false, message: "Payment not verified" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}