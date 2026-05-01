// Free Trial – Extract trial session from request (WBS 11.8 + impersonation)
import { cookies } from "next/headers";
import { verifyTrialToken, getTrialCookieName } from "./trial-jwt";
import { verifyImpersonationToken, getImpersonationCookieName } from "./impersonation";
import { prisma } from "./prisma";
import { sessionUserEmail } from "@/lib/session-user";

export interface TrialUser {
  userId: string;
  email: string;
  trialSessionId: string;
  isTrial: true;
}

export async function getTrialFromRequest(): Promise<TrialUser | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(getTrialCookieName())?.value;
  if (!cookie) return null;

  const payload = await verifyTrialToken(cookie);
  if (!payload) return null;

  return {
    userId: payload.userId,
    email: payload.email,
    trialSessionId: payload.trialSessionId,
    isTrial: true,
  };
}

/** Returns { userId, isTrial } from impersonation, session, or trial. Use in API routes. */
export async function getResumeAuth(): Promise<
  { userId: string; isTrial: boolean } | null
> {
  const cookieStore = await cookies();
  const impersonateCookie = cookieStore.get(getImpersonationCookieName())?.value;
  if (impersonateCookie) {
    const payload = await verifyImpersonationToken(impersonateCookie);
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, subscription: true },
      });
      if (user) return { userId: user.id, isTrial: user.subscription === "trial" };
    }
  }

  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("@/lib/auth");

  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (sessionEmail) {
    const user = await prisma.user.findUnique({
      where: { email: sessionEmail },
      select: { id: true, subscription: true },
    });
    if (user) {
      return {
        userId: user.id,
        isTrial: user.subscription === "trial",
      };
    }
  }

  const trial = await getTrialFromRequest();
  if (trial) return { userId: trial.userId, isTrial: true };

  return null;
}
