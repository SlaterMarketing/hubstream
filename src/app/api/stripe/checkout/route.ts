import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { stripe, STRIPE_PRO_MONTHLY_PRICE_ID, STRIPE_PRO_ANNUAL_PRICE_ID } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null; email?: string | null };
  if (!user?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const interval = body.interval as "month" | "year";
  const priceId =
    interval === "year" ? STRIPE_PRO_ANNUAL_PRICE_ID : STRIPE_PRO_MONTHLY_PRICE_ID;

  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price not configured" },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const successUrl = `${baseUrl}/en/dashboard/settings?billing=success`;
  const cancelUrl = `${baseUrl}/en/dashboard/settings?billing=canceled`;

  let customerId: string | null = null;
  const subscription = await db.subscription.findUnique({
    where: { orgId: user.orgId },
  });
  if (subscription) {
    customerId = subscription.stripeCustomerId;
  }

  if (!customerId) {
    const org = await db.organization.findUnique({
      where: { id: user.orgId },
    });
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: org?.name ?? undefined,
      metadata: { orgId: user.orgId },
    });
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { orgId: user.orgId },
    subscription_data: {
      metadata: { orgId: user.orgId },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
