// Create resume from parsed content + chosen template
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResumeAuth } from "@/lib/trial-auth";
import { parseResumeContent } from "@/lib/resume-utils";
import { AVAILABLE_TEMPLATE_IDS, TRIAL_TEMPLATE_IDS } from "@/lib/templates";
import { recordFeatureUsage } from "@/lib/feature-usage";

export async function POST(req: Request) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { parsed, templateId, title } = body as {
      parsed?: { sections?: unknown[]; meta?: unknown };
      templateId?: string;
      title?: string;
    };

    if (!parsed || !Array.isArray(parsed.sections)) {
      return NextResponse.json({ error: "Invalid parsed content" }, { status: 400 });
    }

    const allowedTemplates = auth.isTrial ? TRIAL_TEMPLATE_IDS : AVAILABLE_TEMPLATE_IDS;
    const resolvedTemplateId = templateId && allowedTemplates.includes(templateId)
      ? templateId
      : auth.isTrial
        ? TRIAL_TEMPLATE_IDS[0] ?? "trial-professional"
        : "professional-in";

    const content = parseResumeContent({ sections: parsed.sections, meta: parsed.meta });

    const resume = await prisma.resume.create({
      data: {
        userId: auth.userId,
        title: (title ?? "Imported Resume").slice(0, 200),
        templateId: resolvedTemplateId,
        content: content as object,
        importSource: "pdf",
      },
    });

    await prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        version: 1,
        content: resume.content as object,
      },
    });

    await recordFeatureUsage(auth.userId, "import", {
      action: "resume-import",
      format: "pdf",
      sectionsCount: content.sections?.length ?? 0,
      templateId: resolvedTemplateId,
    });

    return NextResponse.json(resume);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    console.error("Resume import create error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
