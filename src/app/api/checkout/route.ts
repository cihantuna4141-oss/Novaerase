import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any, 
});

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, customerEmail } = await req.json();

    // Create Stripe line items
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd", // Set to USD for USA operations
        product_data: {
          name: item.name,
          images: [item.images[0]],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents 
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        orderId: orderId, // Crucial for updating DB later
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
