// WBS 5 – Shared helpers for export API routes
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";

const PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"];

export async function getResumeForExport(
  resumeId: string,
  options?: { requirePro?: boolean }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, user: { email: session.user.email } },
    include: { user: { select: { id: true, subscription: true } } },
  });

  if (!resume) {
    return { error: NextResponse.json({ error: "Resume not found" }, { status: 404 }) };
  }

  if (options?.requirePro) {
    const isPro = PRO_SUBSCRIPTIONS.includes(resume.user.subscription);
    if (!isPro) {
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
  };
}

export function isProSubscription(subscription: string): boolean {
  return PRO_SUBSCRIPTIONS.includes(subscription);
}

export async function logExport(
  userId: string,
  resumeId: string,
  format: "txt" | "pdf" | "docx" | "html"
) {
  await prisma.exportLog.create({
    data: { userId, resumeId, format },
  });
}
