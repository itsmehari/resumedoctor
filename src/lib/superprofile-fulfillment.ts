import type { Prisma } from "@prisma/client";
import { AnalyticsEvents } from "@/lib/analytics-event-names";
import { prisma } from "@/lib/prisma";
import { recordProductEvent } from "@/lib/product-events";

export const SUPERPROFILE_PRODUCT_KEYS = [
  "pro_monthly",
  "pro_annual",
  "pro_trial_14",
  "resume_pack",
  // Pro Link – standalone ₹99/mo SKU. Optional add-on for monthly Pro and Basic
  // users; redundant for annual Pro subscribers (annual already implies Pro Link
  // via subscription-entitlement logic, so a separate purchase is wasteful but
  // harmless — it just stacks the standalone expiry on top).
  "pro_link",
] as const;

export type SuperprofileProductKey = (typeof SUPERPROFILE_PRODUCT_KEYS)[number];

const DEFAULT_RESUME_PACK_CREDITS = 5;
const MAX_RESUME_PACK_CREDITS = 100;
/** Standalone Pro Link is sold as a 30-day chunk (recurring monthly). */
const PRO_LINK_DURATION_DAYS = 30;

export type FulfillResult =
  | { ok: true; duplicate?: false; userId: string }
  | { ok: true; duplicate: true }
  | { ok: false; reason: "user_not_found" };

function resumePackCreditsFromPayload(credits: number | undefined): number {
  if (credits == null) return DEFAULT_RESUME_PACK_CREDITS;
  return Math.min(Math.max(credits, 1), MAX_RESUME_PACK_CREDITS);
}

/**
 * Applies a SuperProfile purchase once per idempotencyKey (DB unique).
 */
export async function fulfillSuperprofilePurchase(input: {
  idempotencyKey: string;
  email: string;
  productKey: SuperprofileProductKey;
  credits?: number;
  payloadSnapshot?: Prisma.InputJsonValue;
}): Promise<FulfillResult> {
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.superprofilePurchaseEvent.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  });
  if (existing) {
    return { ok: true, duplicate: true };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return { ok: false, reason: "user_not_found" };
  }

  const credits = resumePackCreditsFromPayload(input.credits);

  await prisma.$transaction(async (tx) => {
    if (input.productKey === "resume_pack") {
      await tx.user.update({
        where: { id: user.id },
        data: {
          resumePackCredits: { increment: credits },
          billingProvider: "superprofile",
        },
      });
    } else if (input.productKey === "pro_trial_14") {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14);
      await tx.user.update({
        where: { id: user.id },
        data: {
          subscription: "pro_trial_14",
          subscriptionExpiresAt: expiresAt,
          billingProvider: "superprofile",
        },
      });
    } else if (input.productKey === "pro_link") {
      // Standalone Pro Link add-on. Does NOT touch `subscription` — a Basic or
      // monthly-Pro user remains on their main plan; only the Pro Link entitlement
      // window is extended. If the user already has time on the clock, we extend
      // from the existing expiry; otherwise we extend from now.
      const current = await tx.user.findUnique({
        where: { id: user.id },
        select: { proLinkExpiresAt: true },
      });
      const base =
        current?.proLinkExpiresAt && current.proLinkExpiresAt > new Date()
          ? new Date(current.proLinkExpiresAt)
          : new Date();
      base.setDate(base.getDate() + PRO_LINK_DURATION_DAYS);
      await tx.user.update({
        where: { id: user.id },
        data: {
          proLinkActive: true,
          proLinkExpiresAt: base,
          proLinkSource: "standalone",
          billingProvider: "superprofile",
        },
      });
    } else {
      // pro_monthly / pro_annual.
      // Annual Pro implicitly grants Pro Link (computed by getProLinkStatus at read
      // time); we still flip the cached flag for snappy reads in admin / billing UI
      // and keep `proLinkSource` informative.
      const isAnnual = input.productKey === "pro_annual";
      await tx.user.update({
        where: { id: user.id },
        data: {
          subscription: input.productKey,
          subscriptionExpiresAt: null,
          billingProvider: "superprofile",
          ...(isAnnual
            ? {
                proLinkActive: true,
                proLinkExpiresAt: null, // implicit, follows the subscription
                proLinkSource: "annual",
              }
            : {}),
        },
      });
    }

    await tx.superprofilePurchaseEvent.create({
      data: {
        idempotencyKey: input.idempotencyKey,
        email,
        productKey: input.productKey,
        userId: user.id,
        payloadSnapshot: input.payloadSnapshot ?? undefined,
      },
    });
  });

  await recordProductEvent({
    userId: user.id,
    name: AnalyticsEvents.payment_success,
    props: {
      plan_id: input.productKey,
      billing_provider: "superprofile",
      idempotency_key: input.idempotencyKey,
      ...(input.productKey === "resume_pack" ? { resume_pack_credits: credits } : {}),
    },
  });

  return { ok: true, userId: user.id };
}
