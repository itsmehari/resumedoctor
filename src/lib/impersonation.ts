// WBS 11.8 – Admin impersonation (expiring JWT cookie)
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "impersonate";
const MAX_AGE_SEC = 60 * 60; // 1 hour

export function getImpersonationCookieName() {
  return COOKIE_NAME;
}

export async function createImpersonationToken(
  targetUserId: string,
  adminId: string
): Promise<string> {
  const secret = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "change-me"
  );
  return new SignJWT({ userId: targetUserId, adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .setIssuedAt()
    .sign(secret);
}

export async function verifyImpersonationToken(
  token: string
): Promise<{ userId: string; adminId: string } | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "change-me"
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;
    const adminId = payload.adminId as string;
    if (!userId || !adminId) return null;
    return { userId, adminId };
  } catch {
    return null;
  }
}
