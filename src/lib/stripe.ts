import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const STRIPE_PRO_MONTHLY_PRICE_ID =
  process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "";
export const STRIPE_PRO_ANNUAL_PRICE_ID =
  process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? "";
