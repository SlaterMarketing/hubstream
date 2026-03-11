import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!cleanSlug) {
    return NextResponse.json(
      { error: "Invalid slug" },
      { status: 400 }
    );
  }

  const existing = await db.organization.findUnique({
    where: { slug: cleanSlug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "This URL slug is already taken" },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.orgId) {
    return NextResponse.json(
      { error: "You already have an organization" },
      { status: 400 }
    );
  }

  const org = await db.organization.create({
    data: {
      name: name.trim(),
      slug: cleanSlug,
      plan: "free",
    },
  });

  await db.user.update({
    where: { id: session.user.id },
    data: { orgId: org.id, role: "owner" },
  });

  return NextResponse.json({ success: true, orgId: org.id });
}
