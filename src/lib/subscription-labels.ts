// Subscription plan display labels
export function getSubscriptionLabel(
  subscription: string,
  subscriptionExpiresAt?: string | null
): string {
  if (subscription === "pro_trial_14" && subscriptionExpiresAt) {
    if (new Date(subscriptionExpiresAt) <= new Date()) {
      return "Free";
    }
    return "Pro (14-day trial)";
  }
  switch (subscription) {
    case "pro_monthly":
      return "Pro (one-time — monthly plan)";
    case "pro_annual":
      return "Pro (one-time — annual plan)";
    case "pro_trial_14":
      return "Pro (14-day trial)";
    case "trial":
      return "Trial";
    case "free":
    default:
      return "Free";
  }
}

import { getTemplateOrFallback, resolveTemplateId } from "./templates";

export function getTemplateDisplayName(templateId: string): string {
  const t = getTemplateOrFallback(resolveTemplateId(templateId));
  return t.name;
}
