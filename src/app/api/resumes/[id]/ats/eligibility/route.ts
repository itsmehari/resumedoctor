import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResumeAuth } from "@/lib/trial-auth";
import { hasFullProAccess } from "@/lib/subscription-entitlements";

/** Whether ATS API will allow another check for this resume (Basic teaser vs Pro unlimited). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (auth.isTrial) {
    return NextResponse.json({
      trialBlocked: true,
      unlimited: false,
      teaserAvailable: false,
      teaserConsumed: false,
    });
  }

  const { id: resumeId } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: auth.userId },
    include: {
      user: { select: { subscription: true, subscriptionExpiresAt: true } },
    },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const unlimited = hasFullProAccess(
    resume.user.subscription,
    resume.user.subscriptionExpiresAt
  );

  if (unlimited) {
    return NextResponse.json({
      trialBlocked: false,
      unlimited: true,
      teaserAvailable: true,
      teaserConsumed: false,
    });
  }

  const existingTeaserRows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT 1 as count FROM "FeatureUsageLog"
    WHERE "userId" = ${auth.userId} AND feature = 'ats'
    AND meta->>'resumeId' = ${resumeId}
    LIMIT 1
  `;
  const teaserConsumed = existingTeaserRows.length > 0;

  return NextResponse.json({
    trialBlocked: false,
    unlimited: false,
    teaserAvailable: !teaserConsumed,
    teaserConsumed,
  });
}
