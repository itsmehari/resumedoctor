// WBS 3.9 – Duplicate resume (supports trial)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";
import { getResumeAuth } from "@/lib/trial-auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id, userId: auth.userId },
    include: { versions: true },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const newTitle = resume.title.includes(" (Copy)")
    ? `${resume.title} (2)`
    : `${resume.title} (Copy)`;

  const duplicate = await prisma.resume.create({
    data: {
      userId: auth.userId,
      title: newTitle,
      templateId: resume.templateId,
      content: resume.content as object,
      version: resume.version,
    },
  });

  // Copy latest version (or all if we want history - for simplicity copy latest only)
  const latestVersion = resume.versions.sort(
    (a, b) => b.version - a.version
  )[0];
  if (latestVersion) {
    await prisma.resumeVersion.create({
      data: {
        resumeId: duplicate.id,
        version: latestVersion.version,
        content: latestVersion.content as object,
      },
    });
  } else {
    await prisma.resumeVersion.create({
      data: {
        resumeId: duplicate.id,
        version: 1,
        content: resume.content as object,
      },
    });
  }

  return NextResponse.json({
    ...duplicate,
    content: parseResumeContent(duplicate.content),
  });
}
