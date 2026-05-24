import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();

    const admin = await prisma.admin.findFirst({
      where: { OR: [{ email: identifier }, { phoneNumber: identifier }] },
    });

    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.admin.update({
      where: { id: admin.id },
      data: { verificationCode: code, codeExpires: expires },
    });

    // Send the email
    await transporter.sendMail({
      from: `"PERFECT MAN" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "AUTHENTICATION CODE",
      html: `
        <div style="background-color: #f9fafb; padding: 50px; font-family: sans-serif;">
          <div style="max-width: 400px; margin: auto; background: white; padding: 40px; border-radius: 20px; border: 1px solid #e5e7eb;">
            <h2 style="text-transform: uppercase; letter-spacing: 1px; font-size: 14px; color: #6b7280;">Security Protocol</h2>
            <h1 style="font-size: 32px; font-weight: 900; margin: 10px 0; color: #000;">${code}</h1>
            <p style="color: #9ca3af; font-size: 12px;">This code will expire in 10 minutes. Do not share this with anyone.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
