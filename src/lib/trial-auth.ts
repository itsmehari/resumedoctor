// Free Trial – Extract trial session from request
import { cookies } from "next/headers";
import { verifyTrialToken, getTrialCookieName } from "./trial-jwt";

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

/** Returns { userId, isTrial } from session or trial. Use in API routes. */
export async function getResumeAuth(): Promise<
  { userId: string; isTrial: boolean } | null
> {
  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("@/lib/auth");
  const { prisma } = await import("@/lib/prisma");

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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
