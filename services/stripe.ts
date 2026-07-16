import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-06-24.dahlia",
});

export const PLAN_PRICE_IDS: Record<string, string | undefined> = {
  STARTER: process.env.STRIPE_PRICE_STARTER,
  GROWTH: process.env.STRIPE_PRICE_GROWTH,
  AGENCY: process.env.STRIPE_PRICE_AGENCY,
};
