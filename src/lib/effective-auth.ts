// WBS 11.8 – Effective auth (session + trial + impersonation)
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTrialFromRequest } from "@/lib/trial-auth";
import { verifyImpersonationToken, getImpersonationCookieName } from "@/lib/impersonation";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";

/** Get effective userId for API routes. Checks: 1) impersonation, 2) session, 3) trial. */
export async function getEffectiveUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const impersonateCookie = cookieStore.get(getImpersonationCookieName())?.value;
  if (impersonateCookie) {
    const payload = await verifyImpersonationToken(impersonateCookie);
    if (payload) return payload.userId;
  }

  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (sessionEmail) {
    const user = await prisma.user.findUnique({
      where: { email: sessionEmail },
      select: { id: true },
    });
    if (user) return user.id;
  }

  const trial = await getTrialFromRequest();
  if (trial) return trial.userId;

  return null;
}

/** Full effective auth: userId + isTrial + isImpersonating */
export async function getEffectiveAuth(): Promise<{
  userId: string;
  isTrial: boolean;
  isImpersonating?: boolean;
} | null> {
  const cookieStore = await cookies();
  const impersonateCookie = cookieStore.get(getImpersonationCookieName())?.value;
  if (impersonateCookie) {
    const payload = await verifyImpersonationToken(impersonateCookie);
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, subscription: true },
      });
      if (user) {
        return {
          userId: user.id,
          isTrial: user.subscription === "trial",
          isImpersonating: true,
        };
      }
    }
  }

  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (sessionEmail) {
    const user = await prisma.user.findUnique({
      where: { email: sessionEmail },
      select: { id: true, subscription: true },
    });
    if (user) {
      return { userId: user.id, isTrial: user.subscription === "trial" };
    }
  }

  const trial = await getTrialFromRequest();
  if (trial) return { userId: trial.userId, isTrial: true };

  return null;
}
