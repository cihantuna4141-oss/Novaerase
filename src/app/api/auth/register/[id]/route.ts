import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/Prismadb"; // Using the singleton instance
import bcrypt from "bcryptjs";

// Helper function to verify the Secret Key
const verifySecret = (req: Request) => {
  const secretKey = req.headers.get("x-secret-key");
  return secretKey === process.env.ADMIN_SECRET_KEY;
};

// Define the context type for Next.js 15
type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET: Fetch a single admin by ID
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    // 1. Await params in Next.js 15
    const { id } = await context.params;

    // if (!verifySecret(req)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const admin = await prisma.admin.findUnique({
      where: { id },
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
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE: Remove an admin by ID
 */
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    // 1. Await params in Next.js 15
    const { id } = await context.params;

    // Uncomment if you want to protect delete with secret key
    // if (!verifySecret(req)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}

/**
 * PATCH (UPDATE): Update admin details by ID
 */
export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    // 1. Await params in Next.js 15
    const { id } = await context.params;

    if (!verifySecret(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, email, phoneNumber, role, password } = body;

    // Prepare data object
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (role) updateData.role = role;
    
    // If updating password, hash it and reset passwordChanged status
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
      updateData.passwordChanged = false; 
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        passwordChanged: true,
      }
    });

    return NextResponse.json({ success: true, data: updatedAdmin });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}