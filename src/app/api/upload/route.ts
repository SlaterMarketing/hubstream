import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadObject, getPublicUrl, generateUploadKey } from "@/lib/r2";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const type = (formData.get("type") as string) || "event";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validTypes = ["event", "speaker", "cover", "logo"] as const;
  if (!validTypes.includes(type as (typeof validTypes)[number])) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  const uploadType = type as (typeof validTypes)[number];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size: 10MB" },
      { status: 400 }
    );
  }

  try {
    const key = generateUploadKey(user.orgId, uploadType, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadObject(key, buffer, file.type);
    const publicUrl = await getPublicUrl(key);

    return NextResponse.json({ publicUrl, key });
  } catch (err) {
    console.error("Upload error:", err);

    let message = "Upload failed";
    if (err instanceof Error) {
      message = err.message;
      // R2/S3 Access Denied - usually API token permissions
      if (
        message.includes("Access Denied") ||
        (err as { name?: string }).name === "AccessDenied"
      ) {
        message =
          "Storage access denied. Check R2 API token has Object Read & Write permission in Cloudflare dashboard.";
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
