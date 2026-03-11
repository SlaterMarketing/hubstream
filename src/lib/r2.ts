import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

function getR2Client() {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 credentials not configured");
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function uploadObject(
  key: string,
  body: Buffer | Uint8Array | ReadableStream,
  contentType: string
): Promise<void> {
  const client = getR2Client();
  if (!R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME not configured");

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const client = getR2Client();
  if (!R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME not configured");

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function getPublicUrl(key: string): Promise<string> {
  if (!R2_PUBLIC_URL) {
    throw new Error("R2_PUBLIC_URL not configured");
  }
  const base = R2_PUBLIC_URL.replace(/\/$/, "");
  const path = key.startsWith("/") ? key : `/${key}`;
  return `${base}${path}`;
}

export function generateUploadKey(
  orgId: string,
  type: "logo" | "cover" | "event" | "speaker",
  filename: string
): string {
  const ext = filename.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `uploads/${orgId}/${type}/${timestamp}-${safeName}`;
}
