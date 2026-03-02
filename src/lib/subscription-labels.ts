// Subscription plan display labels
export function getSubscriptionLabel(subscription: string): string {
  switch (subscription) {
    case "pro_monthly":
      return "Pro (Monthly)";
    case "pro_annual":
      return "Pro (Annual)";
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
