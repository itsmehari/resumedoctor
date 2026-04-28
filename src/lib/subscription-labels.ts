// Subscription plan display labels
export function getSubscriptionLabel(
  subscription: string,
  subscriptionExpiresAt?: string | null
): string {
  const normalized = subscription === "free" ? "basic" : subscription;

  if (normalized === "pro_trial_14" && subscriptionExpiresAt) {
    if (new Date(subscriptionExpiresAt) <= new Date()) {
      return "Basic";
    }
    return "Pro (14-day trial)";
  }
  switch (normalized) {
    case "pro_monthly":
      return "Pro (one-time — monthly plan)";
    case "pro_annual":
      return "Pro (one-time — annual plan)";
    case "pro_trial_14":
      return "Pro (14-day trial)";
    case "trial":
      return "Trial";
    case "basic":
    default:
      return "Basic";
  }
}

import { getTemplateOrFallback, resolveTemplateId } from "./templates";

export function getTemplateDisplayName(templateId: string): string {
  const t = getTemplateOrFallback(resolveTemplateId(templateId));
  return t.name;
}
