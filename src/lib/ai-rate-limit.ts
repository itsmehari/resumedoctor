// WBS 6.7 – AI rate limiting (Free: 5/day, Pro: 50/day)
import { prisma } from "@/lib/prisma";

const PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"];
const PRO_TRIAL_14 = "pro_trial_14";
const LIMIT_FREE = 5;
const LIMIT_PRO = 50;

export type AiAction =
  | "improve-bullet"
  | "improve-summary"
  | "suggest-bullets"
  | "customize-cover"
  | "tailor-for-job";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  used: number;
  code?: "RATE_LIMITED";
}

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function isProUser(
  subscription: string,
  subscriptionExpiresAt: Date | null
): boolean {
  if (PRO_SUBSCRIPTIONS.includes(subscription)) return true;
  if (
    subscription === PRO_TRIAL_14 &&
    subscriptionExpiresAt &&
    new Date(subscriptionExpiresAt) > new Date()
  ) {
    return true;
  }
  return false;
}

/**
 * Check AI rate limit and optionally record usage.
 * Call before performing the AI action.
 */
export async function checkAiRateLimit(
  userId: string,
  action: AiAction
): Promise<RateLimitResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscription: true, subscriptionExpiresAt: true },
  });
  if (!user) {
    return { allowed: false, limit: LIMIT_FREE, used: LIMIT_FREE };
  }

  const limit = isProUser(user.subscription, user.subscriptionExpiresAt)
    ? LIMIT_PRO
    : LIMIT_FREE;
  const since = startOfTodayUTC();

  const count = await prisma.aiUsageLog.count({
    where: {
      userId,
      createdAt: { gte: since },
    },
  });

  if (count >= limit) {
    return {
      allowed: false,
      limit,
      used: count,
      code: "RATE_LIMITED",
    };
  }

  return { allowed: true, limit, used: count };
}

/**
 * Record an AI usage. Call after a successful AI request.
 */
export async function recordAiUsage(
  userId: string,
  action: AiAction
): Promise<void> {
  await prisma.aiUsageLog.create({
    data: { userId, action },
  });
}
