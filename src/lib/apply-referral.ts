import { prisma } from "@/lib/prisma";

/** Attach referral on signup when ref code is valid (best-effort). */
export async function applyReferralOnSignup(referredUserId: string, refCode: string | undefined): Promise<void> {
  const code = refCode?.trim().toLowerCase();
  if (!code || code.length < 4) return;

  const referrer = await prisma.user.findFirst({
    where: { referralCode: code },
    select: { id: true },
  });
  if (!referrer || referrer.id === referredUserId) return;

  const existing = await prisma.referralAttribution.findUnique({
    where: { referredUserId },
  });
  if (existing) return;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: referredUserId },
      data: { referredByUserId: referrer.id },
    }),
    prisma.referralAttribution.create({
      data: {
        referrerUserId: referrer.id,
        referredUserId,
      },
    }),
  ]);
}
