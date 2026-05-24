import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/Prismadb";
import { sendStatusEmail } from "@/lib/Mail";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// 1. GET ORDER BY ID
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching order" }, { status: 500 });
  }
}

// 2. UPDATE ORDER (e.g., updating Status)
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { orderStatus } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { orderStatus },
    });

    // Send professional status email to customer
    try {
      await sendStatusEmail(updatedOrder, orderStatus);
    } catch (emailErr) {
      console.error("Email Notification Failed:", emailErr);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("PATCH_ORDER_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 3. DELETE ORDER
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Order record archived" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}