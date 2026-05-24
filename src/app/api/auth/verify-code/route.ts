import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { identifier, code } = await req.json();

    if (!identifier || !code) {
      return NextResponse.json(
        { error: "Identification and Code required" },
        { status: 400 }
      );
    }

    // 1. Locate the Admin
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phoneNumber: identifier }
        ],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Security record not found" },
        { status: 404 }
      );
    }

    // 2. Check if a code even exists
    if (!admin.verificationCode) {
      return NextResponse.json(
        { error: "No active verification request found" },
        { status: 400 }
      );
    }

    // 3. Verify Code Match
    if (admin.verificationCode !== code) {
      return NextResponse.json(
        { error: "Invalid authorization code" },
        { status: 400 }
      );
    }

    // 4. Check Expiration
    if (admin.codeExpires && new Date() > admin.codeExpires) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // 5. Successful Verification
    // We clear the code from the DB so it cannot be used again
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        verificationCode: null,
        codeExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Identity verified. Protocol authorized.",
    });
    
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { error: "Internal security synchronization failure" },
      { status: 500 }
    );
  }
}