// WBS 6.7 – AI rate limiting (Basic: 5/day, Pro: 50/day)
import { prisma } from "@/lib/prisma";
import { hasFullProAccess } from "@/lib/subscription-entitlements";

export const AI_DAILY_LIMIT_BASIC = 5;
export const AI_DAILY_LIMIT_PRO = 50;

export type AiAction =
  | "improve-bullet"
  | "improve-summary"
  | "suggest-bullets"
  | "customize-cover"
  | "tailor-for-job"
  | "interview-answer";

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
    return { allowed: false, limit: AI_DAILY_LIMIT_BASIC, used: AI_DAILY_LIMIT_BASIC };
  }

  const limit = hasFullProAccess(user.subscription, user.subscriptionExpiresAt)
    ? AI_DAILY_LIMIT_PRO
    : AI_DAILY_LIMIT_BASIC;
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

/** Today's AI usage vs tier limit (UTC day). */
export async function getAiDailyUsageState(userId: string): Promise<{
  used: number;
  limit: number;
  isProTier: boolean;
} | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscription: true, subscriptionExpiresAt: true },
  });
  if (!user) return null;
  const isProTier = hasFullProAccess(user.subscription, user.subscriptionExpiresAt);
  const limit = isProTier ? AI_DAILY_LIMIT_PRO : AI_DAILY_LIMIT_BASIC;
  const since = startOfTodayUTC();
  const used = await prisma.aiUsageLog.count({
    where: { userId, createdAt: { gte: since } },
  });
  return { used, limit, isProTier };
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
