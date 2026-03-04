// WBS 3.2 – Resume list & create (supports trial)
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";
import { DEFAULT_RESUME_CONTENT, DEMO_RESUME_CONTENT } from "@/types/resume";
import { getResumeAuth } from "@/lib/trial-auth";
import { AVAILABLE_TEMPLATE_IDS, TRIAL_TEMPLATE_IDS } from "@/lib/templates";

const LEGACY_TRIAL = ["trial-classic", "trial-modern", "trial-bold", "trial-minimal", "trial-professional"];

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
      _count: { select: { exportLogs: true } },
    },
  });

  return NextResponse.json(resumes);
}

const createSchema = z.object({
  title: z.string().max(200).optional(),
  templateId: z.string().max(100).optional(),
  prefillDemo: z.boolean().optional(),
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
    const prefillDemo = parsed.success ? parsed.data.prefillDemo : false;
    let templateId = parsed.success ? parsed.data.templateId : undefined;

    // Trial users restricted to trial templates; full users get all Indian templates
    if (auth.isTrial) {
      const allowed = [...TRIAL_TEMPLATE_IDS, ...LEGACY_TRIAL];
      templateId = allowed.includes(templateId || "") ? templateId : TRIAL_TEMPLATE_IDS[0] ?? LEGACY_TRIAL[0];
    } else {
      const allowed = [...AVAILABLE_TEMPLATE_IDS, ...LEGACY_TRIAL];
      templateId = allowed.includes(templateId || "") ? templateId : "professional-in";
    }

    const initialContent =
      auth.isTrial && prefillDemo ? DEMO_RESUME_CONTENT : DEFAULT_RESUME_CONTENT;
    const resume = await prisma.resume.create({
      data: {
        userId: auth.userId,
        title: title || (prefillDemo ? "My Resume" : "Untitled Resume"),
        templateId,
        content: initialContent as object,
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
