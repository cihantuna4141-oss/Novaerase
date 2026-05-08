/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/Prismadb";
import { NextResponse } from "next/server";


// 4. GET BY ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pen = await prisma.pen.findUnique({
      where: { id: params.id },
      include: { variants: true },
    });

    if (!pen) {
      return NextResponse.json({ error: "Pen not found" }, { status: 404 });
    }

    return NextResponse.json(pen);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// 5. UPDATE BY ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    
    const updatedPen = await prisma.pen.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedPen);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

// 6. DELETE BY ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.pen.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Pen deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}