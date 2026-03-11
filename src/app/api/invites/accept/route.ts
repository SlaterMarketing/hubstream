import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Sign in to accept this invite" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { token } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { error: "Invalid invite link" },
      { status: 400 }
    );
  }

  const invite = await db.invite.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invite) {
    return NextResponse.json(
      { error: "Invite not found or expired" },
      { status: 404 }
    );
  }

  if (invite.expiresAt < new Date()) {
    await db.invite.delete({ where: { id: invite.id } });
    return NextResponse.json(
      { error: "This invite has expired" },
      { status: 400 }
    );
  }

  const userEmail = (session.user as { email?: string | null }).email;
  if (!userEmail || userEmail.toLowerCase() !== invite.email) {
    return NextResponse.json(
      {
        error:
          "This invite was sent to a different email. Sign in with the invited email to accept.",
      },
      { status: 403 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.orgId === invite.orgId) {
    await db.invite.delete({ where: { id: invite.id } });
    return NextResponse.json({
      success: true,
      message: "Already a member",
      redirect: "/en/dashboard",
    });
  }

  if (user.orgId) {
    return NextResponse.json(
      {
        error:
          "You're already a member of another organization. Leave it first to accept this invite.",
      },
      { status: 403 }
    );
  }

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { orgId: invite.orgId, role: invite.role },
    }),
    db.invite.delete({ where: { id: invite.id } }),
  ]);

  return NextResponse.json({
    success: true,
    message: "Invite accepted",
    redirect: "/en/dashboard",
  });
}
