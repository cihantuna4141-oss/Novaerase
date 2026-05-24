import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
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
    const { identifier, password } = await req.json();

    // 1. Find Admin
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [{ email: identifier }, { phoneNumber: identifier }],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 2. Verify Password (UUID or Permanent)
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 3. Check if user needs to setup password (UUID Phase)
    if (!admin.passwordChanged) {
      return NextResponse.json({
        nextStep: "SET_NEW_PASSWORD",
        userId: admin.id,
      });
    }

    // 4. GENERATE 2FA CODE (For every login after password change)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 Min Expiry

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        verificationCode: code,
        codeExpires: expires,
      },
    });

    // 5. SEND EMAIL
    try {
      await transporter.sendMail({
        from: `"PERFECT MAN HUB" <${process.env.EMAIL_USER}>`,
        to: admin.email,
        subject: "2FA AUTHORIZATION CODE",
        html: `
          <div style="background-color: #000; color: #fff; padding: 30px; font-family: sans-serif; text-align: center;">
            <h1 style="color: #f59e0b; font-size: 12px; letter-spacing: 4px; text-transform: uppercase;">Security Protocol</h1>
            <p style="color: #71717a; font-size: 14px; margin-bottom: 30px;">Your administrative authorization code is:</p>
            <div style="background: #18181b; padding: 20px; font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #f59e0b; border: 1px solid #27272a;">
              ${code}
            </div>
            <p style="color: #71717a; font-size: 10px; margin-top: 30px; text-transform: uppercase;">This code expires in 10 minutes.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Mail failed:", mailError);
      return NextResponse.json(
        { error: "Failed to send 2FA code" },
        { status: 500 },
      );
    }

    // 6. Tell frontend to go to Verify Page
    return NextResponse.json({
      nextStep: "VERIFY_2FA",
      identifier: identifier,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
