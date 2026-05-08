/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";

// Simple map for backend usage since we can't use React Context here
const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "₵",
  USD: "$",
  GBP: "£",
  EUR: "€",
  CAD: "CA$",
  ZAR: "R",
  NGN: "₦",
  XOF: "CFA",
  XAF: "FCFA",
};

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendStatusEmail = async (order: any, status: string) => {
  const statusMessages: any = {
    PROCESSING: "We have received your payment. Your Perfect Man Kit is being prepared.",
    SHIPPED: "Great news! Your package has been handed to our logistics partners.",
    DELIVERED: "Your transformation has arrived. Your order is marked as delivered.",
  };

  // Determine Symbol (Default to ₵ if missing)
  const currencyCode = order.currency || "GHS";
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;

  // Generate Product Rows HTML
  const productRows = order.items.map((item: any) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px;">
        <img src="${item.productImage}" alt="${item.productName}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 5px; border: 1px solid #ddd;" />
      </td>
      <td style="padding: 10px;">
        <p style="margin: 0; font-weight: bold; font-size: 14px;">${item.productName}</p>
        <p style="margin: 0; color: #777; font-size: 12px;">Qty: ${item.quantity}</p>
      </td>
      <td style="padding: 10px; text-align: right;">
        <p style="margin: 0; font-weight: bold;">${symbol} ${item.totalPrice.toFixed(2)}</p>
      </td>
    </tr>
  `).join("");

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 8px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: #000; padding: 25px; text-align: center;">
        <h1 style="color: #f59e0b; margin: 0; font-size: 24px; letter-spacing: 2px;">PERFECT MAN HUB</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #333; margin-top: 0;">Order #${order.orderNumber}</h2>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">${statusMessages[status] || "Your order status has been updated."}</p>
        
        <div style="margin: 25px 0; border: 1px solid #eee; border-radius: 8px; padding: 15px;">
          <h3 style="margin-top: 0; color: #f59e0b; font-size: 14px; text-transform: uppercase;">Delivery Address</h3>
          <p style="margin: 0; color: #333;">${order.houseAddress}, ${order.streetName}</p>
          <p style="margin: 5px 0 0; color: #555;">${order.town}, ${order.country} (${order.zipCode})</p>
        </div>

        <h3 style="border-bottom: 2px solid #f59e0b; padding-bottom: 10px; color: #333;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${productRows}
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <p style="margin: 5px 0;">Subtotal: <strong>${symbol} ${order.subtotal.toFixed(2)}</strong></p>
          <p style="margin: 5px 0;">Shipping: <strong>${symbol} ${order.shippingCost.toFixed(2)}</strong></p>
          <h3 style="margin: 10px 0; color: #f59e0b;">Total: ${symbol} ${order.totalAmount.toFixed(2)}</h3>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/shop" style="background: #000; color: #f59e0b; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 30px; font-size: 14px; text-transform: uppercase;">Shop Again</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #eee; padding: 20px; text-align: center; font-size: 12px; color: #777;">
        <p>© ${new Date().getFullYear()} Perfect Man Hub. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Perfect Man Hub" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `Order Update: ${status} - #${order.orderNumber}`,
    html,
  });
};