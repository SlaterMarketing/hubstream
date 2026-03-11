"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isSuperAdmin } from "@/lib/admin";

export async function upgradeOrgToPro(orgId: string) {
  const session = await auth();
  const user = session?.user as { email?: string | null };
  if (!isSuperAdmin(user?.email)) {
    return { error: "Unauthorized" };
  }

  await db.organization.update({
    where: { id: orgId },
    data: { plan: "pro" },
  });

  return { success: true };
}

export async function downgradeOrgToFree(orgId: string) {
  const session = await auth();
  const user = session?.user as { email?: string | null };
  if (!isSuperAdmin(user?.email)) {
    return { error: "Unauthorized" };
  }

  await db.organization.update({
    where: { id: orgId },
    data: { plan: "free" },
  });

  return { success: true };
}
