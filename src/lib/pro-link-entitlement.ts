// Single source of truth for "does this user have Pro Link right now?"
//
// Pro Link is the resume-link monetisation surface:
//  - vanity slug (/r/hari-krishnan)
//  - view analytics (count + lastViewedAt)
//  - public-page footer removal
//
// Entitlement comes from one of three sources, in priority order:
//   1. ANNUAL Pro subscription  → implicit, free, recomputed at read time
//   2. STANDALONE SuperProfile SKU (₹99/mo) → explicit, time-bound via proLinkExpiresAt
//   3. ADMIN COMPLIMENTARY grant → explicit boolean, no expiry
//
// Monthly Pro alone does NOT include Pro Link; that user must buy the standalone SKU.
// Pro 14-day pass and Pro trial flavours also do NOT include Pro Link by design — keeps
// the annual upgrade lever sharp.

import type { User } from "@prisma/client";

export type ProLinkSource = "annual" | "standalone" | "complimentary";

export type UserProLinkRow = Pick<
  User,
  "subscription" | "proLinkActive" | "proLinkExpiresAt" | "proLinkSource"
>;

export interface ProLinkStatus {
  active: boolean;
  source: ProLinkSource | null;
  expiresAt: Date | null;
  /** Free for the user (annual) vs paid add-on (standalone). Useful for pricing copy. */
  isImplicit: boolean;
}

const ANNUAL_PRO_SUBSCRIPTIONS = new Set(["pro_annual"]);

export function getProLinkStatus(user: UserProLinkRow | null | undefined): ProLinkStatus {
  if (!user) return { active: false, source: null, expiresAt: null, isImplicit: false };

  if (ANNUAL_PRO_SUBSCRIPTIONS.has(user.subscription)) {
    return { active: true, source: "annual", expiresAt: null, isImplicit: true };
  }

  if (user.proLinkActive) {
    if (user.proLinkSource === "complimentary") {
      return { active: true, source: "complimentary", expiresAt: null, isImplicit: false };
    }
    if (user.proLinkExpiresAt && new Date(user.proLinkExpiresAt) > new Date()) {
      return {
        active: true,
        source: "standalone",
        expiresAt: new Date(user.proLinkExpiresAt),
        isImplicit: false,
      };
    }
    return { active: false, source: null, expiresAt: null, isImplicit: false };
  }

  return { active: false, source: null, expiresAt: null, isImplicit: false };
}

/** Pretty label for UI (Settings → Billing, share popover, pricing). */
export function describeProLinkStatus(status: ProLinkStatus): string {
  if (!status.active) return "Inactive";
  switch (status.source) {
    case "annual":
      return "Active — included with Pro annual";
    case "complimentary":
      return "Active — complimentary";
    case "standalone":
      return status.expiresAt
        ? `Active until ${status.expiresAt.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}`
        : "Active";
    default:
      return "Active";
  }
}
