import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { orgId?: string | null; role?: string };
  if (!user.orgId) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }

  const { id } = await params;

  const invite = await db.invite.findUnique({
    where: { id },
    include: { organization: true },
  });

  if (!invite || invite.orgId !== user.orgId) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (invite.organization.plan !== "pro") {
    return NextResponse.json(
      { error: "Team management is only available on Pro plans" },
      { status: 403 }
    );
  }

  if (user.role !== "owner" && user.role !== "admin") {
    return NextResponse.json(
      { error: "Only owners and admins can revoke invites" },
      { status: 403 }
    );
  }

  await db.invite.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
