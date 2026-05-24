import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, fullName, items, totalAmount, symbol } = await req.json();

    // Create the HTML for the product list
    const itemsHtml = items
      .map(
        (item: any) => `
      <div style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
        <div>
          <strong style="text-transform: uppercase; font-size: 14px;">${
            item.name
          }</strong>
          <p style="margin: 0; color: #666; font-size: 12px;">Quantity: ${
            item.quantity
          }</p>
        </div>
        <div style="font-weight: bold;">${symbol} ${item.totalPrice.toFixed(
          2
        )}</div>
      </div>
    `
      )
      .join("");

    const { data, error } = await resend.emails.send({
      from: "Perfect Man Hub <orders@yourdomain.com>",
      to: [email],
      subject: `Order Confirmed: Welcome to the Alpha Collection`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <div style="text-align: center; background: #000; padding: 20px;">
             <h1 style="color: #f59e0b; margin: 0; text-transform: uppercase;">Perfect Man Hub</h1>
          </div>
          
          <h2 style="text-transform: uppercase; letter-spacing: -1px;">Order Confirmed, ${fullName}</h2>
          <p style="color: #555;">Your growth journey has officially begun. We are preparing your order for dispatch.</p>
          
          <div style="margin: 30px 0;">
            <h3 style="border-bottom: 2px solid #000; padding-bottom: 5px; text-transform: uppercase; font-size: 12px;">Order Summary</h3>
            ${itemsHtml}
          </div>

          <div style="text-align: right; font-size: 20px; font-weight: black;">
            <span style="font-size: 12px; text-transform: uppercase; color: #999;">Total Amount Paid:</span><br/>
            ${symbol} ${totalAmount.toFixed(2)}
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 10px; color: #aaa; text-align: center;">
            <p>Certified Turkish Formulations. 90-Day Results Guarantee.</p>
            <p>&copy; 2026 Perfect Man Hub. All Rights Reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Email Sent" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
