"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export type SpeakerData = {
  id?: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  socialLinks?: { twitter?: string; linkedin?: string; website?: string };
};

export async function createSpeaker(data: SpeakerData) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) return { error: "Unauthorized" };

  const speaker = await db.speaker.create({
    data: {
      orgId: user.orgId,
      name: data.name.trim(),
      bio: data.bio?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      socialLinks: data.socialLinks ?? undefined,
    },
  });
  return { success: true, speaker };
}

export async function listOrgSpeakers() {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) return { error: "Unauthorized", speakers: [] };

  const speakers = await db.speaker.findMany({
    where: { orgId: user.orgId },
    orderBy: { name: "asc" },
  });
  return { speakers };
}

export async function updateSpeaker(id: string, data: SpeakerData) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) return { error: "Unauthorized" };

  const speaker = await db.speaker.findFirst({
    where: { id, orgId: user.orgId },
  });
  if (!speaker) return { error: "Speaker not found" };

  await db.speaker.update({
    where: { id },
    data: {
      name: data.name.trim(),
      bio: data.bio?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      socialLinks: data.socialLinks ?? undefined,
    },
  });
  return { success: true };
}
