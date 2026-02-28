// WBS 10.1 – Stripe server-side client
import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret && process.env.NODE_ENV === "production") {
  throw new Error("STRIPE_SECRET_KEY is required in production");
}

export const stripe = secret
  ? new Stripe(secret, { apiVersion: "2023-10-16", typescript: true })
  : null;

export const PLANS = {
  free: "free",
  pro_monthly: "pro_monthly",
  pro_annual: "pro_annual",
} as const;

export const PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"] as const;
