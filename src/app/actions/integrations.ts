"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function saveHubSpotFieldMapping(
  mapping: Record<string, string>
) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) {
    return { error: "Not authenticated" };
  }

  await db.integrationSettings.upsert({
    where: { orgId: user.orgId },
    create: { orgId: user.orgId, hubspotFieldMapping: mapping },
    update: { hubspotFieldMapping: mapping },
  });

  return { success: true };
}

export async function disconnectHubSpot() {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) {
    return { error: "Not authenticated" };
  }

  await db.integrationSettings.upsert({
    where: { orgId: user.orgId },
    create: { orgId: user.orgId },
    update: {
      hubspotAccessToken: null,
      hubspotRefreshToken: null,
      hubspotExpiresAt: null,
    },
  });

  return { success: true };
}
