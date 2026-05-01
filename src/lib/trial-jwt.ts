// Free Trial – JWT for trial session (no NextAuth)
import { SignJWT, jwtVerify } from "jose";
import { getTrialJwtSecretBytes, requireTrialJwtSecretBytes } from "@/lib/trial-secret";

const COOKIE_NAME = "trial_session";

export interface TrialPayload {
  userId: string;
  email: string;
  exp: number; // sessionExpiresAt as unix
  trialSessionId: string;
}

export async function createTrialToken(
  userId: string,
  email: string,
  sessionExpiresAt: Date,
  trialSessionId: string
): Promise<string> {
  return new SignJWT({
    userId,
    email,
    trialSessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(sessionExpiresAt.getTime() / 1000))
    .sign(requireTrialJwtSecretBytes());
}

export async function verifyTrialToken(token: string): Promise<TrialPayload | null> {
  const secret = getTrialJwtSecretBytes();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      !payload.userId ||
      !payload.email ||
      !payload.exp ||
      !payload.trialSessionId
    ) {
      return null;
    }
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      exp: payload.exp as number,
      trialSessionId: payload.trialSessionId as string,
    };
  } catch {
    return null;
  }
}

export function getTrialCookieName(): string {
  return COOKIE_NAME;
}
