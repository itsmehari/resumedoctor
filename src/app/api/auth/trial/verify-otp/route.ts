// Free Trial – Verify OTP and create trial session
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTrialToken, getTrialCookieName } from "@/lib/trial-jwt";
import { recordProductEvent } from "@/lib/product-events";
import { AnalyticsEvents } from "@/lib/analytics-event-names";
import { subMinutes } from "date-fns";

// May 2026: was 5 + 3. Five minutes is below realistic resume-build time;
// users who hit the OTP wall and got logged out before they could finish a
// draft did not come back. Lengthening the session is the cheapest lever to
// improve trial→signup conversion and is reversible if abuse spikes.
const TRIAL_DURATION_MINUTES = 15;
const TRIAL_EXTEND_MINUTES = 5; // extra time for returning trial users
const MAX_VERIFY_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function safeTrialReturnTo(raw: unknown): string {
  if (typeof raw !== "string" || !raw.startsWith("/")) return "/try/templates";
  if (raw.startsWith("//") || raw.includes("..")) return "/try/templates";
  if (!raw.startsWith("/resumes/")) return "/try/templates";
  return raw;
}

const schema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be digits only"),
  returnTo: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { email, otp, returnTo: returnToRaw } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const returnTo = safeTrialReturnTo(returnToRaw);

    // Lockout check: too many failed verify attempts
    const lockoutStart = subMinutes(new Date(), LOCKOUT_MINUTES);
    const failedAttempts = await prisma.otpAttempt.count({
      where: {
        email: normalizedEmail,
        type: "verify",
        success: false,
        createdAt: { gte: lockoutStart },
      },
    });

    if (failedAttempts >= MAX_VERIFY_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const trialSession = await prisma.trialSession.findFirst({
      where: {
        email: normalizedEmail,
        verifiedAt: null,
        otpExpiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!trialSession) {
      await prisma.otpAttempt.create({
        data: {
          email: normalizedEmail,
          type: "verify",
          success: false,
        },
      });
      return NextResponse.json(
        { error: "Invalid or expired code. Please request a new one." },
        { status: 400 }
      );
    }

    const valid = await compare(otp, trialSession.otpHash);
    if (!valid) {
      await prisma.otpAttempt.create({
        data: {
          email: normalizedEmail,
          type: "verify",
          success: false,
        },
      });
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    await prisma.otpAttempt.create({
      data: {
        email: normalizedEmail,
        type: "verify",
        success: true,
      },
    });

    // Extend trial for returning trial users (had a verified trial session before)
    const previousTrial = await prisma.trialSession.count({
      where: {
        email: normalizedEmail,
        verifiedAt: { not: null },
        id: { not: trialSession.id },
      },
    });
    const extraMinutes = previousTrial > 0 ? TRIAL_EXTEND_MINUTES : 0;
    const totalMinutes = TRIAL_DURATION_MINUTES + extraMinutes;

    const sessionExpiresAt = new Date(
      Date.now() + totalMinutes * 60 * 1000
    );

    // Create or find trial User
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          subscription: "trial",
          emailVerified: new Date(),
        },
      });
    } else if (user.subscription !== "trial") {
      // Existing user with full account - don't override; create trial session anyway
      // They might be testing. We could either block or allow. Allow for now.
      // If they have password, they can sign in. If not, we created them from OAuth - they have account.
      // For trial we need a way to let them use the builder. Create a separate "trial" session.
      // Actually the plan says create User with subscription=trial. For existing users, we have a conflict.
      // Simple: if user exists and has password or OAuth, redirect them to login. Don't create trial.
      if (user.passwordHash || (await prisma.account.count({ where: { userId: user.id } })) > 0) {
        return NextResponse.json(
          { error: "An account already exists with this email. Please sign in." },
          { status: 409 }
        );
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { subscription: "trial", emailVerified: new Date() },
      });
    }

    await prisma.trialSession.update({
      where: { id: trialSession.id },
      data: {
        verifiedAt: new Date(),
        sessionExpiresAt,
      },
    });

    await recordProductEvent({
      userId: user.id,
      name: AnalyticsEvents.trial_start,
      props: { source: "otp_verify" },
    });

    const token = await createTrialToken(
      user.id,
      user.email,
      sessionExpiresAt,
      trialSession.id
    );

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = [
      `${getTrialCookieName()}=${token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${totalMinutes * 60}`,
      ...(isProd ? ["Secure"] : []),
    ].join("; ");

    const response = NextResponse.json(
      {
        success: true,
        sessionExpiresAt: sessionExpiresAt.toISOString(),
        redirectTo: returnTo,
      },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", cookieOptions);

    return response;
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
