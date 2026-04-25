// Free vs Pro template allowlists (10 base designs for Free; all 30 for Pro)
import { prisma } from "@/lib/prisma";
import {
  TEMPLATES,
  AVAILABLE_TEMPLATE_IDS,
  TRIAL_TEMPLATE_IDS,
  resolveTemplateId,
} from "@/lib/templates";
import { getResumeAuth } from "@/lib/trial-auth";

/** Legacy template ids still allowed for existing resumes */
export const LEGACY_TRIAL_TEMPLATE_IDS = [
  "trial-classic",
  "trial-modern",
  "trial-bold",
  "trial-minimal",
  "trial-professional",
] as const;

const trialOrdered = TEMPLATES.filter((t) => t.trialAvailable);
/** First 10 trial-marked templates in registry order — matches pricing “10 base” for Free */
export const FREE_PLAN_TEMPLATE_IDS = trialOrdered.slice(0, 10).map((t) => t.id);

function hasProEntitlement(subscription: string, subscriptionExpiresAt: Date | null): boolean {
  if (subscription === "pro_monthly" || subscription === "pro_annual") return true;
  if (
    subscription === "pro_trial_14" &&
    subscriptionExpiresAt &&
    new Date(subscriptionExpiresAt) > new Date()
  ) {
    return true;
  }
  return false;
}

function uniqueIds(ids: string[]): string[] {
  return Array.from(new Set(ids));
}

export function getAllowedTemplateIds(
  isTrial: boolean,
  subscription: string,
  subscriptionExpiresAt: Date | null
): string[] {
  const legacy = [...LEGACY_TRIAL_TEMPLATE_IDS];
  if (isTrial) {
    return uniqueIds([...TRIAL_TEMPLATE_IDS, ...legacy]);
  }
  if (hasProEntitlement(subscription, subscriptionExpiresAt)) {
    return uniqueIds([...AVAILABLE_TEMPLATE_IDS, ...legacy]);
  }
  return uniqueIds([...FREE_PLAN_TEMPLATE_IDS, ...legacy]);
}

export function isTemplateIdAllowedForContext(
  templateId: string,
  allowedIds: string[]
): boolean {
  const resolved = resolveTemplateId(templateId);
  return allowedIds.includes(templateId) || allowedIds.includes(resolved);
}

/** Pick the canonical id from the allowlist (handles aliases). */
export function resolveToAllowedTemplateId(
  templateId: string,
  allowedIds: string[]
): string | null {
  if (allowedIds.includes(templateId)) return templateId;
  const resolved = resolveTemplateId(templateId);
  if (allowedIds.includes(resolved)) return resolved;
  return null;
}

export async function getTemplateAccessContext(): Promise<{
  userId: string;
  isTrial: boolean;
  subscription: string;
  subscriptionExpiresAt: Date | null;
  allowedTemplateIds: string[];
} | null> {
  const auth = await getResumeAuth();
  if (!auth) return null;

  if (auth.isTrial) {
    return {
      userId: auth.userId,
      isTrial: true,
      subscription: "trial",
      subscriptionExpiresAt: null,
      allowedTemplateIds: getAllowedTemplateIds(true, "trial", null),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { subscription: true, subscriptionExpiresAt: true },
  });
  if (!user) return null;

  return {
    userId: auth.userId,
    isTrial: false,
    subscription: user.subscription,
    subscriptionExpiresAt: user.subscriptionExpiresAt,
    allowedTemplateIds: getAllowedTemplateIds(
      false,
      user.subscription,
      user.subscriptionExpiresAt
    ),
  };
}

/** Static flag for gallery UI — templates not in the Free 10 require Pro to create/switch. */
export function isTemplateProOnly(templateId: string): boolean {
  const resolved = resolveTemplateId(templateId);
  if (LEGACY_TRIAL_TEMPLATE_IDS.includes(resolved as (typeof LEGACY_TRIAL_TEMPLATE_IDS)[number])) {
    return false;
  }
  return !FREE_PLAN_TEMPLATE_IDS.includes(resolved);
}
