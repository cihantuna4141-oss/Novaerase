import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Novarease <orders@novarease.com>",
      to: ["support@novarease.com"],
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="background:#F5F2EB;padding:40px 20px;font-family:Georgia,serif;">
          <div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #E8E3D8;border-radius:8px;overflow:hidden;">
            <div style="background:#1A1A18;padding:32px;text-align:center;">
              <h1 style="color:#B8973A;margin:0;font-size:24px;letter-spacing:4px;text-transform:uppercase;">Novarease</h1>
              <p style="color:#F5F2EB;margin:8px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;">New Contact Message</p>
            </div>
            <div style="padding:40px 32px;">
              <div style="background:#F5F2EB;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
                <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 4px;">From</p>
                <p style="font-family:sans-serif;font-size:14px;color:#1A1A18;margin:0;font-weight:bold;">${name}</p>
                <p style="font-family:sans-serif;font-size:13px;color:#555;margin:4px 0 0;">${email}</p>
              </div>
              <div style="background:#F5F2EB;border-radius:6px;padding:16px 20px;">
                <p style="font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8973A;margin:0 0 8px;">Message</p>
                <p style="font-family:sans-serif;font-size:14px;color:#1A1A18;margin:0;line-height:1.7;">${message.replace(/\n/g, "<br/>")}</p>
              </div>
            </div>
            <div style="background:#1A1A18;padding:24px;text-align:center;">
              <p style="font-family:sans-serif;font-size:10px;color:#555;margin:0;">Reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND contact error:", JSON.stringify(error));
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
