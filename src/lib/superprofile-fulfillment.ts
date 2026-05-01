import type { Prisma } from "@prisma/client";
import { AnalyticsEvents } from "@/lib/analytics-event-names";
import { prisma } from "@/lib/prisma";
import { recordProductEvent } from "@/lib/product-events";

export const SUPERPROFILE_PRODUCT_KEYS = [
  "pro_monthly",
  "pro_annual",
  "pro_trial_14",
  "resume_pack",
] as const;

export type SuperprofileProductKey = (typeof SUPERPROFILE_PRODUCT_KEYS)[number];

const DEFAULT_RESUME_PACK_CREDITS = 5;
const MAX_RESUME_PACK_CREDITS = 100;

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
    } else {
      await tx.user.update({
        where: { id: user.id },
        data: {
          subscription: input.productKey,
          subscriptionExpiresAt: null,
          billingProvider: "superprofile",
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
