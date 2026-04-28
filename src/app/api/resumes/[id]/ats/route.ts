// WBS 7.4, 7.7, 7.8, 11.5 – ATS score API (Pro full; basic: one teaser per resume)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";
import { getResumeAuth } from "@/lib/trial-auth";
import { computeAtsScore } from "@/lib/ats-checker";
import { recordFeatureUsage } from "@/lib/feature-usage";

const PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"];
const PRO_TRIAL_14 = "pro_trial_14";
const BASIC_TEASER_SUGGESTIONS = 3;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (auth.isTrial) {
    return NextResponse.json(
      { error: "Sign up to use ATS checker", code: "TRIAL_BLOCKED" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: auth.userId },
    include: { user: { select: { subscription: true, subscriptionExpiresAt: true } } },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const isPro =
    PRO_SUBSCRIPTIONS.includes(resume.user.subscription) ||
    (resume.user.subscription === PRO_TRIAL_14 &&
      resume.user.subscriptionExpiresAt &&
      new Date(resume.user.subscriptionExpiresAt) > new Date());

  const content = parseResumeContent(resume.content);
  const sections = content.sections ?? [];
  const version = resume.version;

  // Basic tier: one teaser per resume (score + first 3 suggestions)
  if (!isPro) {
    const existingTeaserRows = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT 1 as count FROM "FeatureUsageLog"
      WHERE "userId" = ${auth.userId} AND feature = 'ats'
      AND meta->>'resumeId' = ${id}
      LIMIT 1
    `;
    if (existingTeaserRows.length > 0) {
      return NextResponse.json(
        {
          error: "You've used your basic ATS check for this resume. Upgrade to Pro for unlimited checks.",
          code: "TEASER_USED",
        },
        { status: 403 }
      );
    }

    const cached = await prisma.atsScoreCache.findUnique({
      where: { resumeId_version: { resumeId: id, version } },
    });

    let result: { score: number; suggestions: object[]; checks: object[] };
    if (cached) {
      result = {
        score: cached.score,
        suggestions: (cached.suggestions as object[]) ?? [],
        checks: (cached.checks as object[]) ?? [],
      };
    } else {
      result = computeAtsScore(sections);
      await prisma.atsScoreCache.upsert({
        where: { resumeId_version: { resumeId: id, version } },
        create: {
          resumeId: id,
          version,
          score: result.score,
          suggestions: result.suggestions as object[],
          checks: result.checks as object[],
        },
        update: {
          score: result.score,
          suggestions: result.suggestions as object[],
          checks: result.checks as object[],
        },
      });
    }

    await recordFeatureUsage(auth.userId, "ats", { resumeId: id, teaser: true });
    const suggestions = Array.isArray(result.suggestions) ? result.suggestions : [];
    return NextResponse.json({
      score: result.score,
      suggestions: suggestions.slice(0, BASIC_TEASER_SUGGESTIONS),
      checks: result.checks ?? [],
      teaser: true,
      cached: !!cached,
    });
  }

  const cached = await prisma.atsScoreCache.findUnique({
    where: { resumeId_version: { resumeId: id, version } },
  });

  if (cached) {
    return NextResponse.json({
      score: cached.score,
      suggestions: (cached.suggestions as object[]) ?? [],
      checks: (cached.checks as object[]) ?? [],
      cached: true,
    });
  }

  await recordFeatureUsage(auth.userId, "ats");
  const result = computeAtsScore(sections);
  await prisma.atsScoreCache.upsert({
    where: { resumeId_version: { resumeId: id, version } },
    create: {
      resumeId: id,
      version,
      score: result.score,
      suggestions: result.suggestions as object[],
      checks: result.checks as object[],
    },
    update: {
      score: result.score,
      suggestions: result.suggestions as object[],
      checks: result.checks as object[],
    },
  });

  return NextResponse.json({
    ...result,
    cached: false,
  });
}
