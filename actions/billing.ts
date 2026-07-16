"use server";

import { requireUser } from "@/services/auth";
import { db } from "@/lib/db";
import { stripe, PLAN_PRICE_IDS } from "@/services/stripe";
import type { PlanTier } from "@prisma/client";

export async function createCheckoutSession(organizationId: string, plan: Exclude<PlanTier, "FREE">) {
  const user = await requireUser();
  const priceId = PLAN_PRICE_IDS[plan];
  if (!priceId) throw new Error(`No Stripe price configured for plan ${plan}`);

  const billing = await db.billing.upsert({
    where: { organizationId },
    create: { organizationId, plan: "FREE", status: "inactive" },
    update: {},
  });

  let customerId = billing.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { organizationId } });
    customerId = customer.id;
    await db.billing.update({ where: { organizationId }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=cancelled`,
    metadata: { organizationId, plan },
  });

  return { url: session.url };
}
