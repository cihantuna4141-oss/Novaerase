import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!orderNumber || !email) {
    return NextResponse.json({ error: "Order number and email are required" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      customerEmail: { equals: email, mode: "insensitive" },
    },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "No order found with those details" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: order });
}
