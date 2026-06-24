import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/Prismadb";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          paymentReference: session.id,
        },
        include: { items: true },
      });

      const itemsHtml = order.items
        .map(
          (item) => `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #E8E3D8;font-size:14px;color:#1A1A18;">${item.productName}</td>
            <td style="padding:12px 0;border-bottom:1px solid #E8E3D8;text-align:center;font-size:14px;color:#1A1A18;">${item.quantity}</td>
            <td style="padding:12px 0;border-bottom:1px solid #E8E3D8;text-align:right;font-size:14px;color:#1A1A18;">$${item.totalPrice.toFixed(2)}</td>
          </tr>`
        )
        .join("");

      await resend.emails.send({
        from: "Novarease <orders@novarease.com>",
        to: [order.customerEmail],
        subject: `Order Confirmed — ${order.orderNumber}`,
        html: `
          <div style="background:#F5F2EB;padding:40px 20px;font-family:Georgia,serif;">
            <div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #E8E3D8;border-radius:8px;overflow:hidden;">

              <div style="background:#1A1A18;padding:32px;text-align:center;">
                <h1 style="color:#B8973A;margin:0;font-size:24px;letter-spacing:4px;text-transform:uppercase;">Novarease</h1>
                <p style="color:#F5F2EB;margin:8px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;">Order Confirmed</p>
              </div>

              <div style="padding:40px 32px;">
                <p style="font-family:sans-serif;font-size:13px;color:#1A1A18;margin:0 0 8px;">Dear ${order.customerName},</p>
                <p style="font-family:sans-serif;font-size:13px;color:#555;margin:0 0 32px;">Thank you for your order. We're preparing it for dispatch and will notify you when it ships.</p>

                <div style="background:#F5F2EB;border-radius:6px;padding:16px 20px;margin-bottom:32px;">
                  <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 4px;">Order Number</p>
                  <p style="font-size:18px;color:#1A1A18;margin:0;font-weight:bold;">${order.orderNumber}</p>
                </div>

                <table style="width:100%;border-collapse:collapse;">
                  <thead>
                    <tr>
                      <th style="font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:left;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Item</th>
                      <th style="font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:center;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Qty</th>
                      <th style="font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:right;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Price</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>

                <div style="text-align:right;margin-top:24px;padding-top:16px;border-top:2px solid #1A1A18;">
                  <p style="font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 4px;">Total Paid</p>
                  <p style="font-size:28px;color:#1A1A18;margin:0;">$${order.totalAmount.toFixed(2)}</p>
                </div>

                <div style="margin-top:40px;background:#F5F2EB;border-radius:6px;padding:20px;">
                  <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 8px;">Shipping To</p>
                  <p style="font-family:sans-serif;font-size:13px;color:#1A1A18;margin:0;line-height:1.8;">
                    ${order.customerName}<br/>
                    ${order.streetName}${order.houseAddress ? ", " + order.houseAddress : ""}<br/>
                    ${order.town}, ${order.state} ${order.zipCode}
                  </p>
                </div>
              </div>

              <div style="background:#1A1A18;padding:24px;text-align:center;">
                <p style="font-family:sans-serif;font-size:10px;color:#B8973A;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">Questions?</p>
                <p style="font-family:sans-serif;font-size:12px;color:#F5F2EB;margin:0;">Reply to this email and we'll get back to you.</p>
                <p style="font-family:sans-serif;font-size:10px;color:#555;margin:16px 0 0;">© ${new Date().getFullYear()} Novarease. All rights reserved.</p>
              </div>

            </div>
          </div>
        `,
      });
    }
  }

  return new NextResponse("Success", { status: 200 });
}