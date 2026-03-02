// WBS 7.4, 7.7, 7.8 – ATS score API (Pro gated, cached)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";
import { getResumeAuth } from "@/lib/trial-auth";
import { computeAtsScore } from "@/lib/ats-checker";

const PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"];

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
    include: { user: { select: { subscription: true } } },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const isPro = PRO_SUBSCRIPTIONS.includes(resume.user.subscription);
  if (!isPro) {
    return NextResponse.json(
      { error: "Upgrade to Pro for ATS checker", code: "PRO_REQUIRED" },
      { status: 403 }
    );
  }

  const content = parseResumeContent(resume.content);
  const sections = content.sections ?? [];
  const version = resume.version;

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
