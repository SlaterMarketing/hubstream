import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.orgId;
        if (!orgId || session.mode !== "subscription") break;

        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const sub = subscription as Stripe.Subscription & { current_period_end?: number };
        const priceId = subscription.items.data[0]?.price.id;
        const interval = subscription.items.data[0]?.price.recurring?.interval ?? "month";
        const currentPeriodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null;
        const cancelAt = sub.cancel_at ? new Date(sub.cancel_at * 1000) : null;

        await db.subscription.upsert({
          where: { orgId },
          create: {
            orgId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            status: subscription.status,
            interval,
            currentPeriodEnd,
            cancelAt,
          },
          update: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            status: subscription.status,
            interval,
            currentPeriodEnd,
            cancelAt,
          },
        });

        await db.organization.update({
          where: { id: orgId },
          data: { plan: "pro" },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription & { current_period_end?: number };
        const orgId =
          subscription.metadata?.orgId ??
          (await db.subscription.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          }))?.orgId;
        if (!orgId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const interval = subscription.items.data[0]?.price.recurring?.interval ?? "month";
        const currentPeriodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null;
        const cancelAt = subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000)
          : null;

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: priceId,
            status: subscription.status,
            interval,
            currentPeriodEnd,
            cancelAt,
          },
        });

        const plan = subscription.status === "active" ? "pro" : "free";
        await db.organization.updateMany({
          where: { id: orgId },
          data: { plan },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = await db.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (!sub) break;
        const orgId = sub.orgId;
        await db.subscription.update({
          where: { id: sub.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            status: "canceled",
            currentPeriodEnd: null,
            cancelAt: null,
          },
        });

        await db.organization.update({
          where: { id: orgId },
          data: { plan: "free" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subRef = (invoice as unknown as { subscription?: string | Stripe.Subscription }).subscription;
        const subscriptionId =
          typeof subRef === "string" ? subRef : subRef?.id ?? null;
        if (!subscriptionId) break;

        const sub = await db.subscription.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
          include: { organization: { include: { users: true } } },
        });
        if (!sub) break;

        await db.subscription.update({
          where: { id: sub.id },
          data: { status: "past_due" },
        });

        const ownerEmail = sub.organization.users[0]?.email;
        if (ownerEmail) {
          await sendEmail({
            to: ownerEmail,
            subject: "Payment failed: HubStream Pro",
            html: `
              <p>Your HubStream Pro payment failed. Please update your payment method in Settings to avoid service interruption.</p>
              <p><a href="${process.env.NEXTAUTH_URL}/en/dashboard/settings">Manage billing</a></p>
            `,
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
