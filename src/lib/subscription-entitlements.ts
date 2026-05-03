/**
 * Single source of truth for paid Pro access (monthly/annual + active 14-day pass).
 * Resume Pack credits are handled separately in export-api-helpers for PDF/DOCX only.
 */

export const PAID_PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"] as const;
export type PaidProSubscription = (typeof PAID_PRO_SUBSCRIPTIONS)[number];

export const PRO_TRIAL_14_SUBSCRIPTION = "pro_trial_14";

const PAID_SET = new Set<string>(PAID_PRO_SUBSCRIPTIONS);

/** Full Pro template/export/ATS/AI-tier access (not Basic + resume pack). */
export function hasFullProAccess(
  subscription: string,
  subscriptionExpiresAt?: Date | string | null
): boolean {
  if (PAID_SET.has(subscription)) return true;
  if (
    subscription === PRO_TRIAL_14_SUBSCRIPTION &&
    subscriptionExpiresAt != null &&
    String(subscriptionExpiresAt).length > 0
  ) {
    return new Date(subscriptionExpiresAt) > new Date();
  }
  return false;
}
