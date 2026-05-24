/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/Prismadb";
import { NextResponse, NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { IncomingForm, File as FormidableFile, Files } from "formidable";
import { Readable } from "stream";
import type { IncomingMessage } from "http";
import { Storage } from "@google-cloud/storage";
import path from "path";

// 1. HELPER: Convert NextRequest to Node.js IncomingMessage for Formidable
const toIncomingMessage = async (
  req: NextRequest,
): Promise<IncomingMessage> => {
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
  req: NextRequest,
): Promise<{ fields: Record<string, string[]>; files: Files<string> }> {
  const form = new IncomingForm({ multiples: true });
  const nodeReq = await toIncomingMessage(req);
  return new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) return reject(err);

      const processedFields: Record<string, string[]> = {};
      for (const key in fields) {
        const value = fields[key];
        processedFields[key] = Array.isArray(value)
          ? value.map(String)
          : [String(value)];
      }
      resolve({ fields: processedFields, files });
    });
  });
}

// 3. HELPER: Upload to GCS
async function uploadImageToGCS(
  imageFile: FormidableFile,
  storage: Storage,
  bucketName: string,
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
    console.warn("GCS Public Access Warning");
  }
  return `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
}

// 4. GET BY ID
export async function GET(
  req: NextRequest, // Changed from Request to NextRequest for consistency
  { params }: { params: { id: string } },
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Pen not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// 5. UPDATE BY ID
export async function PATCH(
  req: NextRequest, // FIX: Changed from Request to NextRequest to match parseFormData type
  { params }: { params: { id: string } },
) {
  try {
    const { fields, files } = await parseFormData(req);

    const name = fields.name?.[0];
    const price = fields.price?.[0];
    const description = fields.description?.[0];
    const existingImages = JSON.parse(fields.existingImages?.[0] || "[]");

    // Initialize GCS inside PATCH
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
    const storage = new Storage({ credentials });
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME!;

    // 1. Upload new files to GCS
    const newImageUrls: string[] = [];
    if (files.images) {
      const filesArray = Array.isArray(files.images)
        ? files.images
        : [files.images];
      for (const file of filesArray) {
        // FIX: Replaced placeholder "..." with required arguments
        const url = await uploadImageToGCS(
          file as FormidableFile,
          storage,
          bucketName,
        );
        newImageUrls.push(url);
      }
    }

    // 2. Combine existing and new images
    const finalImages = [...existingImages, ...newImageUrls];

    // 3. Update Prisma
    const updatedPen = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        price: price ? parseFloat(price) : undefined, // Ensure field name matches your Prisma model (price or price)
        description,
        images: finalImages,
      },
    });

    return NextResponse.json({ success: true, data: updatedPen });
  } catch (error: any) {
    // FIX: Added :any to resolve 'unknown' type error
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// 6. DELETE BY ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Pen deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
