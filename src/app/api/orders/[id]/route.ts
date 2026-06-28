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
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const { orderStatus, paymentStatus, trackingNumber, shippingCarrier } = body;

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        trackingNumber: trackingNumber ?? undefined,
        shippingCarrier: shippingCarrier ?? undefined,
      },
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// 3. DELETE ORDER
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Order record archived" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
