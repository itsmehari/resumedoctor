// Shared API auth helpers — session-only vs effective (session + trial + impersonation)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEffectiveAuth } from "@/lib/effective-auth";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";

export type SessionUser = { id: string; email: string };

/**
 * Full account session only (no trial cookie, no impersonation).
 * Use for settings, billing profile, 2FA, delete account, cover letters, jobs.
 */
export async function requireSessionUser(): Promise<
  { user: SessionUser } | { error: NextResponse }
> {
  const session = await getServerSession(authOptions);
  const email = sessionUserEmail(session);
  if (!email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  if (!user) {
    return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
  }

  return { user: { id: user.id, email: user.email } };
}

/**
 * Effective identity for resume builder, export, ATS, AI (when allowed), impersonation.
 */
export async function requireEffectiveAuth(): Promise<
  | { userId: string; isTrial: boolean; isImpersonating?: boolean }
  | { error: NextResponse }
> {
  const auth = await getEffectiveAuth();
  if (!auth) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return auth;
}

/** Block OTP trial users from features that require a full account. */
export async function requireFullAccountAuth(): Promise<
  | { userId: string; isImpersonating?: boolean }
  | { error: NextResponse }
> {
  const auth = await getEffectiveAuth();
  if (!auth) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (auth.isTrial) {
    return {
      error: NextResponse.json(
        { error: "Sign up for a free account to use this feature", code: "TRIAL_ACCOUNT_REQUIRED" },
        { status: 403 }
      ),
    };
  }
  return { userId: auth.userId, isImpersonating: auth.isImpersonating };
}
