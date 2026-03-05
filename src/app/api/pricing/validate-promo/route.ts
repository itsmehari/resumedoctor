// Validate promo code – hardened against brute-force
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkIpRateLimit, getClientIp, auditLog } from "@/lib/ip-rate-limit";

const schema = z.object({
  code: z.string().min(1).max(50),
});

// 20 attempts per IP per 10 minutes – prevents automated code enumeration
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, maxRequests: 20 };

export async function POST(req: Request) {
  const ip = getClientIp(req);

  const rl = await checkIpRateLimit("validate-promo", ip, RATE_LIMIT);
  if (!rl.allowed) {
    await auditLog("promo_attempt", { ip, success: false, meta: { reason: "rate_limited" } });
    return NextResponse.json(
      { valid: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000)) },
      }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ valid: false, error: "Invalid code" }, { status: 400 });
    }

    const code = parsed.data.code.trim().toUpperCase();
    const promo = await prisma.promoCode.findUnique({ where: { code } });

    if (!promo) {
      // Log failed attempts so admin can spot enumeration in the audit log
      await auditLog("promo_attempt", { ip, success: false, meta: { code } });
      return NextResponse.json({ valid: false, error: "Invalid or expired code" });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Code has expired" });
    }

    if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ valid: false, error: "Code has reached usage limit" });
    }

    const label =
      promo.discountType === "percent"
        ? `${promo.discountValue}% off`
        : `₹${promo.discountValue / 100} off`;

    await auditLog("promo_attempt", { ip, success: true, meta: { code } });

    return NextResponse.json({
      valid: true,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      label,
    });
  } catch (err) {
    console.error("Validate promo error:", err);
    return NextResponse.json({ valid: false, error: "Something went wrong" }, { status: 500 });
  }
}
