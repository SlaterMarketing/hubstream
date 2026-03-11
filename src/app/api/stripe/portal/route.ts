import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const subscription = await db.subscription.findUnique({
    where: { orgId: user.orgId },
  });
  if (!subscription) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const returnUrl = `${baseUrl}/en/dashboard/settings`;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: returnUrl,
  });

  return NextResponse.json({ url: portalSession.url });
}
