import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Novarease <orders@novarease.com>";

const CARRIER_TRACKING_URLS: Record<string, (n: string) => string> = {
  UPS:   (n) => `https://www.ups.com/track?tracknum=${n}`,
  FedEx: (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}`,
  USPS:  (n) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}`,
  DHL:   (n) => `https://www.dhl.com/en/express/tracking.html?AWB=${n}`,
};

function baseLayout(headerLabel: string, body: string) {
  return `
    <div style="background:#F5F2EB;padding:40px 20px;font-family:Georgia,serif;">
      <div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #E8E3D8;border-radius:8px;overflow:hidden;">
        <div style="background:#1A1A18;padding:32px;text-align:center;">
          <h1 style="color:#B8973A;margin:0;font-size:24px;letter-spacing:4px;text-transform:uppercase;">Novarease</h1>
          <p style="color:#F5F2EB;margin:8px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;">${headerLabel}</p>
        </div>
        <div style="padding:40px 32px;">${body}</div>
        <div style="background:#1A1A18;padding:24px;text-align:center;">
          <p style="font-family:sans-serif;font-size:10px;color:#B8973A;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">Questions?</p>
          <p style="font-family:sans-serif;font-size:12px;color:#F5F2EB;margin:0;">Reply to this email and we'll get back to you.</p>
          <p style="font-family:sans-serif;font-size:10px;color:#555;margin:16px 0 0;">© ${new Date().getFullYear()} Novarease. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
}

function itemsTable(items: { productName: string; quantity: number; totalPrice: number }[]) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #E8E3D8;font-size:14px;color:#1A1A18;font-family:sans-serif;">${item.productName}</td>
        <td style="padding:12px 0;border-bottom:1px solid #E8E3D8;text-align:center;font-size:14px;color:#1A1A18;font-family:sans-serif;">${item.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #E8E3D8;text-align:right;font-size:14px;color:#1A1A18;font-family:sans-serif;">$${item.totalPrice.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:left;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Item</th>
          <th style="font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:center;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Qty</th>
          <th style="font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:right;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ── 1. ORDER CONFIRMATION ─────────────────────────────────────────────────────

export async function sendOrderConfirmation(order: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  totalAmount: number;
  streetName: string;
  houseAddress?: string | null;
  town: string;
  state?: string | null;
  zipCode: string;
  items: { productName: string; quantity: number; totalPrice: number }[];
}) {
  const body = `
    <p style="font-family:sans-serif;font-size:13px;color:#1A1A18;margin:0 0 8px;">Dear ${order.customerName},</p>
    <p style="font-family:sans-serif;font-size:13px;color:#555;margin:0 0 32px;">Thank you for your order. We're preparing it for dispatch and will notify you once it ships.</p>

    <div style="background:#F5F2EB;border-radius:6px;padding:16px 20px;margin-bottom:32px;">
      <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 4px;">Order Number</p>
      <p style="font-size:18px;color:#1A1A18;margin:0;font-weight:bold;">${order.orderNumber}</p>
    </div>

    ${itemsTable(order.items)}

    <div style="text-align:right;margin-top:24px;padding-top:16px;border-top:2px solid #1A1A18;">
      <p style="font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 4px;">Total Paid</p>
      <p style="font-size:28px;color:#1A1A18;margin:0;">$${order.totalAmount.toFixed(2)}</p>
    </div>

    <div style="margin-top:40px;background:#F5F2EB;border-radius:6px;padding:20px;">
      <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 8px;">Shipping To</p>
      <p style="font-family:sans-serif;font-size:13px;color:#1A1A18;margin:0;line-height:1.8;">
        ${order.customerName}<br/>
        ${order.streetName}${order.houseAddress ? ", " + order.houseAddress : ""}<br/>
        ${order.town}, ${order.state ?? ""} ${order.zipCode}
      </p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [order.customerEmail],
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: baseLayout("Order Confirmed", body),
  });

  if (error) console.error("RESEND sendOrderConfirmation ERROR:", JSON.stringify(error));
  else console.log("Order confirmation sent:", order.orderNumber);
}

// ── 2. SHIPPED ────────────────────────────────────────────────────────────────

export async function sendShippedEmail(order: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  trackingNumber: string;
  shippingCarrier: string;
  items: { productName: string; quantity: number; totalPrice: number }[];
}) {
  const trackUrl =
    CARRIER_TRACKING_URLS[order.shippingCarrier]?.(order.trackingNumber) ?? "#";

  const body = `
    <p style="font-family:sans-serif;font-size:13px;color:#1A1A18;margin:0 0 8px;">Dear ${order.customerName},</p>
    <p style="font-family:sans-serif;font-size:13px;color:#555;margin:0 0 32px;">Great news — your order is on its way! Here are your shipping details.</p>

    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:20px;margin-bottom:32px;">
      <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#2563EB;margin:0 0 8px;">Tracking Information</p>
      <p style="font-family:sans-serif;font-size:14px;color:#1A1A18;margin:0 0 12px;"><strong>${order.shippingCarrier}:</strong> ${order.trackingNumber}</p>
      <a href="${trackUrl}" style="display:inline-block;background:#1A1A18;color:#F5F2EB;padding:10px 20px;border-radius:6px;font-family:sans-serif;font-size:12px;font-weight:bold;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">
        Track on ${order.shippingCarrier} →
      </a>
    </div>

    <div style="background:#F5F2EB;border-radius:6px;padding:16px 20px;margin-bottom:32px;">
      <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 4px;">Order Number</p>
      <p style="font-size:16px;color:#1A1A18;margin:0;font-weight:bold;">${order.orderNumber}</p>
    </div>

    ${itemsTable(order.items)}
  `;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [order.customerEmail],
    subject: `Your order is on its way — ${order.orderNumber}`,
    html: baseLayout("Shipped", body),
  });

  if (error) console.error("RESEND sendShippedEmail ERROR:", JSON.stringify(error));
  else console.log("Shipped email sent:", order.orderNumber);
}

// ── 3. DELIVERED ──────────────────────────────────────────────────────────────

export async function sendDeliveredEmail(order: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: { productName: string; quantity: number; totalPrice: number }[];
}) {
  const body = `
    <p style="font-family:sans-serif;font-size:13px;color:#1A1A18;margin:0 0 8px;">Dear ${order.customerName},</p>
    <p style="font-family:sans-serif;font-size:13px;color:#555;margin:0 0 32px;">Your order has been delivered. We hope you love your Novarease pen — enjoy clean, highlight-free pages.</p>

    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;padding:20px;margin-bottom:32px;text-align:center;">
      <p style="font-family:sans-serif;font-size:32px;margin:0 0 8px;">✓</p>
      <p style="font-family:sans-serif;font-size:14px;font-weight:bold;color:#15803D;margin:0;">Delivered</p>
    </div>

    <div style="background:#F5F2EB;border-radius:6px;padding:16px 20px;margin-bottom:32px;">
      <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 4px;">Order Number</p>
      <p style="font-size:16px;color:#1A1A18;margin:0;font-weight:bold;">${order.orderNumber}</p>
    </div>

    ${itemsTable(order.items)}

    <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:32px;text-align:center;">
      Had an issue? Just reply to this email and we'll make it right.
    </p>
  `;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [order.customerEmail],
    subject: `Your order has been delivered — ${order.orderNumber}`,
    html: baseLayout("Delivered", body),
  });

  if (error) console.error("RESEND sendDeliveredEmail ERROR:", JSON.stringify(error));
  else console.log("Delivered email sent:", order.orderNumber);
}

// ── 4. ADMIN ORDER NOTIFICATION ───────────────────────────────────────────────

export async function sendAdminOrderNotification(order: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderNumber: string;
  totalAmount: string;
  streetName: string;
  houseAddress?: string | null;
  town: string;
  state?: string | null;
  zipCode: string;
  items: { productName: string; quantity: number; totalPrice: number }[];
}) {
  const rows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #E8E3D8;font-family:sans-serif;font-size:14px;color:#1A1A18;">${item.productName}</td>
          <td style="padding:10px 0;border-bottom:1px solid #E8E3D8;text-align:center;font-family:sans-serif;font-size:14px;color:#1A1A18;">${item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #E8E3D8;text-align:right;font-family:sans-serif;font-size:14px;color:#1A1A18;">$${item.totalPrice.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="background:#1A1A18;padding:40px 20px;font-family:Georgia,serif;">
      <div style="max-width:580px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">

        <div style="background:#B8973A;padding:24px 32px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#1A1A18;margin:0 0 4px;font-weight:bold;">New Order Received</p>
            <p style="font-family:sans-serif;font-size:20px;font-weight:bold;color:#1A1A18;margin:0;">${order.orderNumber}</p>
          </div>
          <div style="background:#1A1A18;color:#B8973A;padding:8px 16px;border-radius:20px;font-family:sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
            PAID
          </div>
        </div>

        <div style="padding:32px;">

          <div style="display:flex;gap:16px;margin-bottom:24px;">
            <div style="flex:1;background:#F5F2EB;border-radius:6px;padding:16px;">
              <p style="font-family:sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 6px;font-weight:bold;">Customer</p>
              <p style="font-family:sans-serif;font-size:13px;font-weight:bold;color:#1A1A18;margin:0;">${order.customerName}</p>
              <p style="font-family:sans-serif;font-size:12px;color:#555;margin:4px 0 0;">${order.customerEmail}</p>
              <p style="font-family:sans-serif;font-size:12px;color:#555;margin:2px 0 0;">${order.customerPhone}</p>
            </div>
            <div style="flex:1;background:#F5F2EB;border-radius:6px;padding:16px;">
              <p style="font-family:sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 6px;font-weight:bold;">Ship To</p>
              <p style="font-family:sans-serif;font-size:13px;color:#1A1A18;margin:0;line-height:1.7;">
                ${order.streetName}${order.houseAddress ? ", " + order.houseAddress : ""}<br/>
                ${order.town}, ${order.state ?? ""} ${order.zipCode}
              </p>
            </div>
          </div>

          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="font-family:sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:left;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Item</th>
                <th style="font-family:sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:center;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Qty</th>
                <th style="font-family:sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#B8973A;text-align:right;padding-bottom:8px;border-bottom:2px solid #1A1A18;">Price</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div style="text-align:right;margin-top:20px;padding-top:16px;border-top:2px solid #1A1A18;">
            <p style="font-family:sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 4px;">Total Collected</p>
            <p style="font-size:28px;color:#1A1A18;margin:0;font-weight:bold;">$${order.totalAmount}</p>
          </div>

        </div>

        <div style="background:#1A1A18;padding:16px 32px;text-align:center;">
          <p style="font-family:sans-serif;font-size:10px;color:#555;margin:0;">Go to your admin dashboard to update this order's status.</p>
        </div>

      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM,
    to: ["support@novarease.com"],
    subject: `[New Order] ${order.orderNumber} — $${order.totalAmount}`,
    html,
  });

  if (error) console.error("RESEND sendAdminOrderNotification ERROR:", JSON.stringify(error));
  else console.log("Admin notification sent for:", order.orderNumber);
}
