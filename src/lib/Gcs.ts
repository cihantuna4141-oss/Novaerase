import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_CLIENT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME!);

export async function uploadToGCS(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `products/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const gcsFile = bucket.file(fileName);

  await gcsFile.save(buffer, {
    contentType: file.type,
    metadata: { cacheControl: "public, max-age=31536000" },
  });

  
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}



export async function deleteFromGCS(url: string) {
  try {
    const fileName = url.split(`${bucket.name}/`)[1];
    if (fileName) {
      await bucket.file(fileName).delete();
      console.log(`Deleted ${fileName} from GCS`);
    }
  } catch (error) {
    console.error("Failed to delete file from GCS:", error);
  }
}