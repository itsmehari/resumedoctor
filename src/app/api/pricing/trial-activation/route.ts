// WBS 10.6 – Submit 14-day trial activation request (user paid ₹1 via UPI)
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkIpRateLimit, getClientIp, auditLog } from "@/lib/ip-rate-limit";

const schema = z.object({
  email: z.string().email("Valid email required"),
  upiRef: z.string().min(6, "UPI reference required").max(50),
});

// 3 attempts per IP per hour – prevents spam activation with arbitrary emails
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, maxRequests: 3 };

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // IP rate limit check (unauthenticated endpoint)
  const rl = await checkIpRateLimit("trial-activation", ip, RATE_LIMIT);
  if (!rl.allowed) {
    await auditLog("trial_activation", { ip, success: false, meta: { reason: "rate_limited" } });
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
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
      return NextResponse.json(
        {
          error:
            parsed.error.flatten().fieldErrors.email?.[0] ??
            parsed.error.flatten().fieldErrors.upiRef?.[0] ??
            "Invalid input",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.trialActivationRequest.findFirst({
      where: { email: parsed.data.email, status: "pending" },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending request. We'll activate within 24 hours." },
        { status: 400 }
      );
    }

    // Reject duplicate UPI reference numbers (replay attack / accidental duplicates)
    const dupUpi = await prisma.trialActivationRequest.findFirst({
      where: { upiRef: parsed.data.upiRef.trim() },
    });
    if (dupUpi) {
      await auditLog("trial_activation", {
        ip,
        success: false,
        meta: { reason: "duplicate_upi_ref", email: parsed.data.email },
      });
      return NextResponse.json(
        { error: "This UPI reference has already been submitted." },
        { status: 400 }
      );
    }

    await prisma.trialActivationRequest.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        upiRef: parsed.data.upiRef.trim(),
      },
    });

    await auditLog("trial_activation", {
      ip,
      success: true,
      meta: { email: parsed.data.email },
    });

    return NextResponse.json({
      success: true,
      message:
        "Request submitted. We'll activate your 14-day Pro trial within 24 hours. Check your email.",
    });
  } catch (err) {
    console.error("Trial activation request error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
