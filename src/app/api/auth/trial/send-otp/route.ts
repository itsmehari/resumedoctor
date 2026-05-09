// Free Trial – Send OTP to email
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail, resend } from "@/lib/email";
import { recordProductEvent } from "@/lib/product-events";
import { AnalyticsEvents } from "@/lib/analytics-event-names";
import { subMinutes, subHours } from "date-fns";

const MAX_SENDS_PER_EMAIL = 3;
const SEND_WINDOW_MINUTES = 15;
const OTP_VALID_MINUTES = 10;
const TRIAL_COOLDOWN_HOURS = 24;

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  try {
    // Early check: Resend must be configured for trial OTP
    if (!resend) {
      console.error("Send OTP: RESEND_API_KEY is not set in Vercel environment variables");
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      await recordProductEvent({
        name: AnalyticsEvents.otp_request_attempt,
        props: { outcome: "invalid_input" },
      });
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    await recordProductEvent({
      name: AnalyticsEvents.otp_request_attempt,
      props: { email_domain: normalizedEmail.split("@")[1] ?? null },
    });

    // Cooldown: 1 trial per email per 24h
    const cooldownStart = subHours(new Date(), TRIAL_COOLDOWN_HOURS);
    const recentTrial = await prisma.trialSession.findFirst({
      where: {
        email: normalizedEmail,
        verifiedAt: { gte: cooldownStart },
      },
    });
    if (recentTrial) {
      return NextResponse.json(
        { error: "You've already used a trial recently. Try again tomorrow or sign up for full access." },
        { status: 429 }
      );
    }

    const windowStart = subMinutes(new Date(), SEND_WINDOW_MINUTES);
    const recentSends = await prisma.otpAttempt.count({
      where: {
        email: normalizedEmail,
        type: "send",
        createdAt: { gte: windowStart },
      },
    });

    if (recentSends >= MAX_SENDS_PER_EMAIL) {
      return NextResponse.json(
        {
          error: "Too many OTP requests. Please try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    const otp = generateOtp();
    const otpHash = await hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + OTP_VALID_MINUTES * 60 * 1000);

    // Cleanup old expired/unverified sessions (keep table small)
    await prisma.trialSession.deleteMany({
      where: {
        OR: [
          { otpExpiresAt: { lt: new Date() }, verifiedAt: null },
          { sessionExpiresAt: { lt: new Date() } },
        ],
      },
    });

    const existing = await prisma.trialSession.findFirst({
      where: {
        email: normalizedEmail,
        verifiedAt: null,
      },
    });

    if (existing) {
      await prisma.trialSession.update({
        where: { id: existing.id },
        data: { otpHash, otpExpiresAt },
      });
    } else {
      await prisma.trialSession.create({
        data: {
          email: normalizedEmail,
          otpHash,
          otpExpiresAt,
        },
      });
    }

    const result = await sendOtpEmail(normalizedEmail, otp);

    await prisma.otpAttempt.create({
      data: {
        email: normalizedEmail,
        type: "send",
        success: result.ok,
      },
    });

    if (!result.ok) {
      console.error("OTP email failed:", result.error);
      return NextResponse.json(
        { error: "Failed to send verification code. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Verification code sent to your email",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const isDev = process.env.NODE_ENV === "development";

    // Log full error for debugging (visible in Vercel Logs)
    console.error("Send OTP error:", err);
    if (err instanceof Error && err.stack) {
      console.error("Stack:", err.stack);
    }

    // Database/Prisma errors often mean DATABASE_URL or migrations
    const isDbError =
      message.includes("Prisma") ||
      message.includes("database") ||
      message.includes("DATABASE_URL") ||
      message.includes("DIRECT_URL") ||
      message.includes("connect");

    return NextResponse.json(
      {
        error: isDev
          ? `Something went wrong: ${message}`
          : isDbError
            ? "Service temporarily unavailable. Please try again in a few moments."
            : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
