// WBS 5 – Shared helpers for export API routes (blocks trial users)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";
import { getResumeAuth } from "@/lib/trial-auth";

const PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"];
const PRO_TRIAL_14 = "pro_trial_14";

export async function getResumeForExport(
  resumeId: string,
  options?: { requirePro?: boolean }
) {
  const auth = await getResumeAuth();
  if (!auth) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  // Trial users cannot export at all
  if (auth.isTrial) {
    return {
      error: NextResponse.json(
        { error: "Sign up to save and export your resume", code: "TRIAL_EXPORT_BLOCKED" },
        { status: 403 }
      ),
    };
  }

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: auth.userId },
    include: { user: { select: { id: true, subscription: true, subscriptionExpiresAt: true, resumePackCredits: true } } },
  });

  if (!resume) {
    return { error: NextResponse.json({ error: "Resume not found" }, { status: 404 }) };
  }

  if (options?.requirePro) {
    const isPro =
      PRO_SUBSCRIPTIONS.includes(resume.user.subscription) ||
      (resume.user.subscription === PRO_TRIAL_14 &&
        resume.user.subscriptionExpiresAt &&
        new Date(resume.user.subscriptionExpiresAt) > new Date());
    const hasPackCredits = (resume.user.resumePackCredits ?? 0) > 0;
    if (!isPro && !hasPackCredits) {
      return {
        error: NextResponse.json(
          { error: "Upgrade to Pro to export PDF or Word", code: "PRO_REQUIRED" },
          { status: 403 }
        ),
      };
    }
  }

  const content = parseResumeContent(resume.content);
  return {
    resume: { ...resume, content },
    userId: resume.user.id,
    subscription: resume.user.subscription,
    subscriptionExpiresAt: resume.user.subscriptionExpiresAt,
    resumePackCredits: resume.user.resumePackCredits ?? 0,
  };
}

export function isProSubscription(
  subscription: string,
  subscriptionExpiresAt?: Date | string | null
): boolean {
  if (PRO_SUBSCRIPTIONS.includes(subscription)) return true;
  if (subscription === PRO_TRIAL_14 && subscriptionExpiresAt) {
    return new Date(subscriptionExpiresAt) > new Date();
  }
  return false;
}

export async function logExport(
  userId: string,
  resumeId: string,
  format: "txt" | "pdf" | "docx" | "html"
) {
  await prisma.exportLog.create({
    data: { userId, resumeId, format },
  });
  const total = await prisma.exportLog.count({ where: { userId } });
  if (total === 1) {
    const { recordProductEvent } = await import("@/lib/product-events");
    const { AnalyticsEvents } = await import("@/lib/analytics-event-names");
    await recordProductEvent({
      userId,
      name: AnalyticsEvents.first_export,
      props: { format },
    });
  }
}

/** WBS 10.7 – Consume one Resume Pack credit for PDF/DOCX (basic users only) */
export async function consumePackCreditIfNeeded(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscription: true, subscriptionExpiresAt: true, resumePackCredits: true },
  });
  if (!user) return false;
  const isPro =
    PRO_SUBSCRIPTIONS.includes(user.subscription) ||
    (user.subscription === PRO_TRIAL_14 &&
      user.subscriptionExpiresAt &&
      new Date(user.subscriptionExpiresAt) > new Date());
  if (isPro) return false; // Pro users don't use credits
  const credits = user.resumePackCredits ?? 0;
  if (credits <= 0) return false;
  await prisma.user.update({
    where: { id: userId },
    data: { resumePackCredits: { decrement: 1 } },
  });
  return true;
}
