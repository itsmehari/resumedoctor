import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

function genCode(): string {
  return randomBytes(6).toString("base64url").slice(0, 8).toLowerCase();
}

export async function ensureReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (user?.referralCode) return user.referralCode;

  for (let i = 0; i < 5; i++) {
    const code = genCode();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
      return code;
    } catch {
      // unique collision — retry
    }
  }
  const fallback = `${userId.slice(0, 6)}${Date.now().toString(36).slice(-4)}`;
  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: fallback },
  });
  return fallback;
}

export function referralSignupUrl(baseUrl: string, code: string): string {
  return `${baseUrl.replace(/\/$/, "")}/signup?ref=${encodeURIComponent(code)}`;
}
