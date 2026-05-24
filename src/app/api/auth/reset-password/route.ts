import { NextResponse } from "next/server";
import { prisma } from "@/lib/Prismadb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, code, newPassword } = await req.json();

  const admin = await prisma.admin.findFirst({
    where: { 
      email, 
      verificationCode: code, 
      codeExpires: { gt: new Date() } 
    }
  });

  if (!admin) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      password: hashedPassword,
      verificationCode: null,
      codeExpires: null,
      passwordChanged: true
    }
  });

  return NextResponse.json({ success: true });
}