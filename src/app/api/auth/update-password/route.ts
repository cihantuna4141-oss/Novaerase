import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // 1. Hash the new permanent password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 2. Update Admin: Set new password and flip passwordChanged flag
    await prisma.admin.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordChanged: true,
        // GENERATE THE FIRST CODE HERE
        verificationCode: Math.floor(
          100000 + Math.random() * 900000,
        ).toString(),
        codeExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Security protocol updated. Please login again.",
    });
  } catch (error) {
    console.error("Update Password Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
