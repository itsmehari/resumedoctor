// Security – IP rate limiting for unauthenticated critical endpoints (DB-backed, Vercel-safe)
import { prisma } from "@/lib/prisma";

export interface RateLimitConfig {
  windowMs: number;   // window duration in ms
  maxRequests: number; // max requests per window
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Extract the real client IP from request headers.
 * Vercel sets x-forwarded-for; fall back to x-real-ip.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * DB-backed IP rate limiter. Safe for serverless (no shared memory).
 * key format: "{endpoint}:{ip}"
 */
export async function checkIpRateLimit(
  endpoint: string,
  ip: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `${endpoint}:${ip}`;
  const now = new Date();
  const newWindowEnd = new Date(Date.now() + config.windowMs);

  try {
    const existing = await prisma.ipRateLimit.findUnique({ where: { key } });

    // Expired window or first request → reset/create
    if (!existing || existing.windowEnd < now) {
      await prisma.ipRateLimit.upsert({
        where: { key },
        create: { key, count: 1, windowEnd: newWindowEnd },
        update: { count: 1, windowEnd: newWindowEnd },
      });
      return { allowed: true, remaining: config.maxRequests - 1, resetAt: newWindowEnd };
    }

    // Within window and over limit
    if (existing.count >= config.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: existing.windowEnd };
    }

    // Within window and under limit → increment
    await prisma.ipRateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: config.maxRequests - existing.count - 1,
      resetAt: existing.windowEnd,
    };
  } catch {
    // Non-critical: fail open so legit traffic isn't blocked by DB issues
    return { allowed: true, remaining: 1, resetAt: newWindowEnd };
  }
}

/**
 * Write a security audit entry (fire-and-forget, never throws).
 */
export async function auditLog(
  action: string,
  opts: {
    userId?: string;
    ip?: string;
    meta?: Record<string, unknown>;
    success?: boolean;
  } = {}
): Promise<void> {
  try {
    await prisma.securityAuditLog.create({
      data: {
        action,
        userId: opts.userId,
        ip: opts.ip,
        meta: opts.meta as object | undefined,
        success: opts.success ?? true,
      },
    });
  } catch {
    // Never block the request for an audit write failure
  }
}
