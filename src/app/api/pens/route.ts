/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/Prismadb";
import { readFile } from "fs/promises";
import { IncomingForm, File as FormidableFile, Files } from "formidable";
import { Readable } from "stream";
import type { IncomingMessage } from "http";
import { Storage } from "@google-cloud/storage";
import path from "path";

// 1. HELPER: Convert NextRequest to Node.js IncomingMessage for Formidable
const toIncomingMessage = async (req: NextRequest): Promise<IncomingMessage> => {
  const bodyBuffer = Buffer.from(await req.arrayBuffer());
  const stream = new Readable();
  stream.push(bodyBuffer);
  stream.push(null);
  return Object.assign(stream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  }) as IncomingMessage;
};

// 2. HELPER: Parse Multipart Form Data
async function parseFormData(
  req: NextRequest
): Promise<{ fields: Record<string, string[]>; files: Files<string> }> {
  const form = new IncomingForm({ multiples: true });
  const nodeReq = await toIncomingMessage(req);
  return new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) return reject(err);
      
      const processedFields: Record<string, string[]> = {};
      for (const key in fields) {
        const value = fields[key];
        processedFields[key] = Array.isArray(value) ? value.map(String) : [String(value)];
      }
      resolve({ fields: processedFields, files });
    });
  });
}

// 3. HELPER: Upload to GCS
async function uploadImageToGCS(
  imageFile: FormidableFile,
  storage: Storage,
  bucketName: string
): Promise<string> {
  const bucket = storage.bucket(bucketName);
  const bytes = await readFile(imageFile.filepath);
  const buffer = Buffer.from(bytes);
  const fileExtension = path.extname(imageFile.originalFilename || ".jpg");
  const uniqueFileName = `pens/${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
  
  const blob = bucket.file(uniqueFileName);
  const blobStream = blob.createWriteStream({
    contentType: imageFile.mimetype ?? "image/jpeg",
    resumable: false,
  });

  await new Promise<void>((resolve, reject) => {
    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => resolve());
    blobStream.end(buffer);
  });

  try {
    await blob.makePublic();
  } catch (e) {
    console.warn("GCS Public Access Warning: Ensure bucket has correct permissions");
  }
  return `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
}

// --- API HANDLERS ---

// GET: Fetch all pens
export async function GET() {
  try {
    const pens = await prisma.product.findMany({
      orderBy: { name: "asc" }
    });
    return NextResponse.json({ success: true, data: pens });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a product with Image Upload
export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseFormData(req);

    // Extract basic fields
    const name = fields.name?.[0];
    const description = fields.description?.[0];
    const price = fields.price?.[0];
    const category = fields.category?.[0];

    if (!name || !price) {
      return NextResponse.json({ error: "Name and Price are required" }, { status: 400 });
    }

    // Initialize Storage
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
    const storage = new Storage({ credentials });
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME!;

    // Handle Image Uploads (Support multiple images if provided)
    const imageUrls: string[] = [];
    const imageFiles = files.images; // Expecting 'images' field in FormData

    if (imageFiles) {
      const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
      for (const file of filesArray) {
        const url = await uploadImageToGCS(file, storage, bucketName);
        imageUrls.push(url);
      }
    }

    // Save to Prisma
    const newPen = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        images: imageUrls,
      },
    });

    return NextResponse.json({ success: true, data: newPen }, { status: 201 });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE ALL
export async function DELETE() {
    try {
      await prisma.product.deleteMany();
      await prisma.product.deleteMany();
      return NextResponse.json({ message: "All products deleted" });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}