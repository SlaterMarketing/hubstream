"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export async function updateOrganization(data: {
  name?: string;
  slug?: string;
  logoUrl?: string | null;
  ctaColor?: string | null;
}) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) return { error: "Unauthorized" };

  const org = await db.organization.findUnique({
    where: { id: user.orgId },
  });
  if (!org) return { error: "Organization not found" };

  const updates: Record<string, string | null> = {};
  if (data.name?.trim()) updates.name = data.name.trim();
  if (data.slug?.trim()) {
    const slug = slugify(data.slug.trim());
    if (!slug) return { error: "Slug cannot be empty" };
    const existing = await db.organization.findUnique({
      where: { slug },
    });
    if (existing && existing.id !== user.orgId) {
      return { error: "This slug is already taken" };
    }
    updates.slug = slug;
  }
  if (data.logoUrl !== undefined) updates.logoUrl = data.logoUrl?.trim() || null;
  if (data.ctaColor !== undefined) {
    const color = data.ctaColor?.trim() || null;
    if (color && !HEX_COLOR_REGEX.test(color)) {
      return { error: "CTA colour must be a valid hex colour (e.g. #ff724c)" };
    }
    updates.ctaColor = color;
  }

  if (Object.keys(updates).length === 0) return { success: true };

  await db.organization.update({
    where: { id: user.orgId },
    data: updates,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
