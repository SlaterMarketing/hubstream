import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPresignedUploadUrl, getPublicUrl, generateUploadKey } from "@/lib/r2";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { filename, contentType, type = "event" } = body;

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: "filename and contentType are required" },
      { status: 400 }
    );
  }

  const validTypes = ["event", "speaker", "cover", "logo"] as const;
  if (!validTypes.includes(type as (typeof validTypes)[number])) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  const uploadType = type as (typeof validTypes)[number];

  const key = generateUploadKey(user.orgId, uploadType, filename);
  const uploadUrl = await getPresignedUploadUrl(key, contentType);
  const publicUrl = await getPublicUrl(key);

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
