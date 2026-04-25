// Create resume from parsed content + chosen template
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTemplateAccessContext, resolveToAllowedTemplateId } from "@/lib/template-access";
import { parseResumeContent } from "@/lib/resume-utils";
import { recordFeatureUsage } from "@/lib/feature-usage";

export async function POST(req: Request) {
  const access = await getTemplateAccessContext();
  if (!access) {
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

    const allowed = access.allowedTemplateIds;
    const picked = templateId ? resolveToAllowedTemplateId(templateId, allowed) : null;
    const resolvedTemplateId =
      picked ?? (access.isTrial ? allowed[0] ?? "professional-in" : "professional-in");

    const content = parseResumeContent({ sections: parsed.sections, meta: parsed.meta });

    const resume = await prisma.resume.create({
      data: {
        userId: access.userId,
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

    await recordFeatureUsage(access.userId, "import", {
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
