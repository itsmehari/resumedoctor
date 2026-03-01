// WBS 3.2 – Resume list & create (supports trial)
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";
import { DEFAULT_RESUME_CONTENT } from "@/types/resume";
import { getResumeAuth } from "@/lib/trial-auth";

const TRIAL_TEMPLATES = ["trial-classic", "trial-modern", "trial-bold", "trial-minimal", "trial-professional"];

export async function GET() {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: auth.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      templateId: true,
      version: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(resumes);
}

const createSchema = z.object({
  title: z.string().max(200).optional(),
  templateId: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = createSchema.safeParse(body);
    const title = parsed.success ? parsed.data.title : undefined;
    let templateId = parsed.success ? parsed.data.templateId : undefined;

    // Trial users restricted to trial templates
    if (auth.isTrial) {
      templateId = TRIAL_TEMPLATES.includes(templateId || "")
        ? templateId
        : TRIAL_TEMPLATES[0];
    } else {
      templateId = templateId || "professional-v1";
    }

    const resume = await prisma.resume.create({
      data: {
        userId: auth.userId,
        title: title || "Untitled Resume",
        templateId,
        content: DEFAULT_RESUME_CONTENT as object,
      },
    });

    // Create initial version
    await prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        version: 1,
        content: resume.content as object,
      },
    });

    return NextResponse.json(resume);
  } catch (err) {
    console.error("Create resume error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
