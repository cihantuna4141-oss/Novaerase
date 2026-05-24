import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Use a more reliable transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Using 'service' is more reliable for Gmail than manual host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function GET(req: Request) {
  try {
    // const secretKey = req.headers.get("x-secret-key");
    // if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    //   return NextResponse.json(
    //     { error: "Unauthorized access" },
    //     { status: 401 },
    //   );
    // }
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        passwordChanged: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: admins });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admin list" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phoneNumber, secretKey } =
      await req.json();

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "Unauthorized Secret Key" },
        { status: 401 },
      );
    }

    const existing = await prisma.admin.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 },
      );
    }

    const tempPassword = uuidv4();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);
    const appName = "Perfect Man Hub";

    // 1. SEND EMAIL FIRST (If this fails, we don't create the user)
    // This prevents creating "ghost users" who don't have their passwords.
    try {
      await transporter.sendMail({
        from: `"PERFECT MAN HUB" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "ADMIN ACCESS GRANTED",
        html: `
        <div>
          <p style="padding-bottom: 4px">Welcome, <b>${firstName} ${lastName}</b>. Your administrative key is below...</p>
          <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
            <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: 2px;">Protocol Initialized</h1>
            <p style="font-size: 14px; color: #a1a1aa;">You have been granted administrative access to the Alpha System.</p>
            <div style="background-color: #18181b; padding: 20px; border: 1px solid #27272a; border-radius: 10px; margin: 30px 0;">
              <p style="font-size: 10px; color: #71717a; text-transform: uppercase; font-weight: bold;">Temporary Command Key</p>
              <p style="font-size: 18px; color: #f59e0b; font-weight: bold; font-family: monospace;">${tempPassword}</p>
            </div>
            <p style="font-size: 12px; color: #71717a;">Use your email and this UUID to log in. You will be prompted to set a permanent password upon first access.</p>
          </div>
           <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; margin-top: 20px; font-size: 0.9em; color: #777;">
          <p>© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
        </div>
        </div>
        `,
      });
    } catch (mailError: any) {
      console.error("NODEMAILER ERROR:", mailError.message);
      return NextResponse.json(
        { error: "Failed to send credential email. User not created." },
        { status: 500 },
      );
    }

    // 2. CREATE USER ONLY IF EMAIL SUCCEEDED
    await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        passwordChanged: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin created and email sent.",
    });
  } catch (error) {
    console.error("GENERAL REGISTRATION ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
