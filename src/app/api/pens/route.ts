/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/Prismadb";
import { NextResponse } from "next/server";

// 1. GET ALL PENS
export async function GET() {
  try {
    const pens = await prisma.pen.findMany({
      include: { variants: true }, // Includes associated variants
    });
    return NextResponse.json(pens);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pens" }, { status: 500 });
  }
}

// 2. POST (CREATE PEN)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, basePrice, category, images } = body;

    const newPen = await prisma.pen.create({
      data: {
        name,
        description,
        basePrice: parseFloat(basePrice),
        category,
        images,
      },
    });

    return NextResponse.json(newPen, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create pen" }, { status: 400 });
  }
}

// 3. DELETE ALL PENS
export async function DELETE() {
  try {
    await prisma.variant.deleteMany(); // Delete children first if not using Cascade
    await prisma.pen.deleteMany();
    return NextResponse.json({ message: "All pens deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete pens" }, { status: 500 });
  }
}