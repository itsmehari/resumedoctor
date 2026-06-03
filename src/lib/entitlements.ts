import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hasFullProAccess } from "@/lib/subscription-entitlements";
import { getProLinkStatus } from "@/lib/pro-link-entitlement";

export type UserEntitlements = {
  /** Trial users are treated as constrained even though they map to a User row. */
  isTrial: boolean;
  /** Full Pro unlock (templates, higher AI tier, etc). */
  hasFullPro: boolean;
  /** Pack credits can unlock individual PDF/DOCX exports for basic users. */
  resumePackCredits: number;
  /** Can export PDF/DOCX right now (Pro or pack credits). */
  canExportPaidFormats: boolean;
  /** Pro Link (vanity slug + analytics) status. */
  proLink: ReturnType<typeof getProLinkStatus>;
};

export type EntitlementsInputUser = Pick<
  User,
  | "subscription"
  | "subscriptionExpiresAt"
  | "resumePackCredits"
  | "proLinkActive"
  | "proLinkExpiresAt"
  | "proLinkSource"
>;

export const ENTITLEMENTS_USER_SELECT = {
  subscription: true,
  subscriptionExpiresAt: true,
  resumePackCredits: true,
  proLinkActive: true,
  proLinkExpiresAt: true,
  proLinkSource: true,
} as const;

/** Single place to convert a `User` row into feature gates. */
export function getUserEntitlements(args: {
  user: EntitlementsInputUser;
  isTrial: boolean;
}): UserEntitlements {
  const { user, isTrial } = args;
  const hasFullPro = hasFullProAccess(user.subscription, user.subscriptionExpiresAt);
  const resumePackCredits = user.resumePackCredits ?? 0;
  const canExportPaidFormats = !isTrial && (hasFullPro || resumePackCredits > 0);
  const proLink = getProLinkStatus(user);

  return {
    isTrial,
    hasFullPro,
    resumePackCredits,
    canExportPaidFormats,
    proLink,
  };
}

/** Load entitlements for an effective-auth userId + trial flag. */
export async function loadUserEntitlements(
  userId: string,
  isTrial: boolean
): Promise<UserEntitlements | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: ENTITLEMENTS_USER_SELECT,
  });
  if (!user) return null;
  return getUserEntitlements({ user, isTrial });
}
