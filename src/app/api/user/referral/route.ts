import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";
import { ensureReferralCode, referralSignupUrl } from "@/lib/referral";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const code = await ensureReferralCode(session.user.id);
  const count = await prisma.referralAttribution.count({
    where: { referrerUserId: session.user.id },
  });

  return NextResponse.json({
    code,
    inviteUrl: referralSignupUrl(siteUrl, code),
    referralsCount: count,
  });
}
