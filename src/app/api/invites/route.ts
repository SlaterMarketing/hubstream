import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getPlanLimits } from "@/lib/plans";
import { sendInviteEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const INVITE_EXPIRY_DAYS = 7;
const BASE_URL = process.env.NEXTAUTH_URL ?? "https://hubstream.app";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { orgId?: string | null; email?: string | null };
  if (!user.orgId) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }

  const body = await req.json();
  const { email, role = "member" } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.includes("@")) {
    return NextResponse.json(
      { error: "Invalid email" },
      { status: 400 }
    );
  }

  if (role !== "member" && role !== "admin") {
    return NextResponse.json(
      { error: "Role must be member or admin" },
      { status: 400 }
    );
  }

  const org = await db.organization.findUnique({
    where: { id: user.orgId },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  if (org.plan !== "pro") {
    return NextResponse.json(
      { error: "Team invites are only available on Pro plans" },
      { status: 403 }
    );
  }

  const limits = getPlanLimits(org.plan as "free" | "pro");
  const currentMemberCount = await db.user.count({
    where: { orgId: org.id },
  });
  const pendingInviteCount = await db.invite.count({
    where: { orgId: org.id },
  });
  if (currentMemberCount + pendingInviteCount >= limits.maxTeamMembers) {
    return NextResponse.json(
      { error: "Team member limit reached" },
      { status: 403 }
    );
  }

  const existingUser = await db.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser?.orgId === org.id) {
    return NextResponse.json(
      { error: "This person is already a team member" },
      { status: 400 }
    );
  }

  const existingInvite = await db.invite.findUnique({
    where: {
      orgId_email: { orgId: org.id, email: normalizedEmail },
    },
  });
  if (existingInvite) {
    if (existingInvite.expiresAt > new Date()) {
      return NextResponse.json(
        { error: "An invite has already been sent to this email" },
        { status: 400 }
      );
    }
    await db.invite.delete({
      where: { id: existingInvite.id },
    });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);

  const inviter = await db.user.findUnique({
    where: { id: session.user.id },
  });

  const invite = await db.invite.create({
    data: {
      orgId: org.id,
      email: normalizedEmail,
      role,
      token,
      invitedById: session.user.id,
      expiresAt,
    },
  });

  const inviteUrl = `${BASE_URL}/invite/${token}`;
  const result = await sendInviteEmail({
    to: normalizedEmail,
    orgName: org.name,
    inviterName: inviter?.name ?? undefined,
    inviteUrl,
    expiresInDays: INVITE_EXPIRY_DAYS,
  });

  if (!result.success) {
    await db.invite.delete({ where: { id: invite.id } });
    return NextResponse.json(
      { error: result.error ?? "Failed to send invite email" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    invite: {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt.toISOString(),
    },
  });
}
