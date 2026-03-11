import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = session.user as { orgId?: string | null; role?: string };
  if (!currentUser.orgId) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }

  const { userId } = await params;

  if (userId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot remove yourself" },
      { status: 400 }
    );
  }

  const targetUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!targetUser || targetUser.orgId !== currentUser.orgId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const org = await db.organization.findUnique({
    where: { id: currentUser.orgId },
  });
  if (!org || org.plan !== "pro") {
    return NextResponse.json(
      { error: "Team management is only available on Pro plans" },
      { status: 403 }
    );
  }

  if (currentUser.role !== "owner" && currentUser.role !== "admin") {
    return NextResponse.json(
      { error: "Only owners and admins can remove team members" },
      { status: 403 }
    );
  }

  if (targetUser.role === "owner") {
    return NextResponse.json(
      { error: "Cannot remove the organization owner" },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { id: userId },
    data: { orgId: null, role: "member" },
  });

  return NextResponse.json({ success: true });
}
