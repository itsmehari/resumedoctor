// Dashboard onboarding checklist – merges auto-detected + manual overrides; completes once
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMergedOnboardingForUser, type OnboardingStepKey } from "@/lib/onboarding";
import { recordProductEvent } from "@/lib/product-events";
import { AnalyticsEvents } from "@/lib/analytics-event-names";
import { sessionUserEmail } from "@/lib/session-user";

export const dynamic = "force-dynamic";

function allDone(steps: Record<OnboardingStepKey, boolean>): boolean {
  return (
    steps.template_chosen &&
    steps.section_filled &&
    steps.ats_run &&
    steps.export_done
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true, onboardingCompletedAt: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const merged = await getMergedOnboardingForUser(user.id);
  const { steps, completedAt, checklistHidden } = merged;

  if (!checklistHidden && allDone(steps) && !completedAt) {
    const started = await prisma.user.findUnique({
      where: { id: user.id },
      select: { createdAt: true },
    });
    const completed = new Date();
    const ttcSec = started
      ? Math.max(0, Math.round((completed.getTime() - started.createdAt.getTime()) / 1000))
      : undefined;

    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingCompletedAt: completed },
    });

    await recordProductEvent({
      userId: user.id,
      name: AnalyticsEvents.onboarding_completed,
      props: ttcSec != null ? { time_to_complete_sec: ttcSec } : undefined,
    });
  }

  const fresh = await getMergedOnboardingForUser(user.id);

  return NextResponse.json({
    steps: fresh.steps,
    completedAt: fresh.completedAt ? fresh.completedAt.toISOString() : null,
    checklistHidden: fresh.checklistHidden,
  });
}
