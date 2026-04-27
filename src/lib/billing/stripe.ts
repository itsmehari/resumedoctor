import Stripe from "stripe";

export type CheckoutPlanId = "pro_monthly" | "pro_annual" | "pro_trial_14";

const PLAN_AMOUNTS_INR: Record<CheckoutPlanId, number> = {
  pro_monthly: 199_00, // paise
  pro_annual: 1499_00,
  pro_trial_14: 49_00, // ₹49 (paise; legacy — checkout disabled, SuperProfile sets real price)
};

const PLAN_AMOUNTS_USD: Record<CheckoutPlanId, number> = {
  pro_monthly: 499, // cents
  pro_annual: 3900,
  pro_trial_14: 50, // $0.50
};

const PLAN_LABELS: Record<CheckoutPlanId, string> = {
  pro_monthly: "ResumeDoctor Pro – Monthly",
  pro_annual: "ResumeDoctor Pro – Annual",
  pro_trial_14: "ResumeDoctor Pro – 14-day trial",
};

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export function getPlanLineItem(
  planId: CheckoutPlanId,
  currency: "inr" | "usd"
): Stripe.Checkout.SessionCreateParams.LineItem {
  const unit_amount = currency === "inr" ? PLAN_AMOUNTS_INR[planId] : PLAN_AMOUNTS_USD[planId];
  return {
    quantity: 1,
    price_data: {
      currency,
      unit_amount,
      product_data: {
        name: PLAN_LABELS[planId],
      },
    },
  };
}

export function parseCheckoutPlanId(value: string): CheckoutPlanId | null {
  if (value === "pro_monthly" || value === "pro_annual" || value === "pro_trial_14") return value;
  return null;
}
