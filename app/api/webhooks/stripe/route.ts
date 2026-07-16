import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/services/stripe";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizationId = session.metadata?.organizationId;
      const plan = session.metadata?.plan as "STARTER" | "GROWTH" | "AGENCY" | undefined;
      if (organizationId && plan) {
        await db.billing.update({
          where: { organizationId },
          data: {
            plan,
            status: "active",
            stripeSubscriptionId: session.subscription as string,
          },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await db.billing.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
        },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
