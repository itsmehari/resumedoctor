// Phase 1.1 – Resume import (PDF/DOCX)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResumeAuth } from "@/lib/trial-auth";
import {
  extractTextFromFile,
  validateFile,
  parseResumeWithAi,
  isImportSupported,
  ACCEPTED_TYPES,
} from "@/lib/resume-import";
import { parseResumeContent } from "@/lib/resume-utils";
import {
  getTemplateAccessContext,
  resolveToAllowedTemplateId,
} from "@/lib/template-access";
import { recordFeatureUsage } from "@/lib/feature-usage";

export async function POST(req: Request) {
  const access = await getTemplateAccessContext();
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isImportSupported()) {
    return NextResponse.json(
      { error: "Resume import is not available. AI must be configured." },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const templateId = (formData.get("templateId") as string) || "professional-in";
    const title = (formData.get("title") as string) || "Imported Resume";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded. Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    validateFile(
      { size: file.size, type: file.type },
      ACCEPTED_TYPES
    );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const rawText = await extractTextFromFile(buffer, file.type);

    if (!rawText || rawText.trim().length < 100) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from the file. Ensure it's a valid resume PDF or DOCX with readable text.",
        },
        { status: 400 }
      );
    }

    const parsed = await parseResumeWithAi(rawText);
    const { sections } = parseResumeContent(parsed);

    const allowed = access.allowedTemplateIds;
    const picked = resolveToAllowedTemplateId(templateId, allowed);
    const resolvedTemplateId =
      picked ?? (access.isTrial ? allowed[0] ?? "professional-in" : "professional-in");

    const content = {
      sections: sections.length > 0 ? sections : parsed.sections,
      meta: parsed.meta,
    };

    const importFormat = file.type.includes("pdf") ? "pdf" : "docx";
    const resume = await prisma.resume.create({
      data: {
        userId: access.userId,
        title: title.slice(0, 200),
        templateId: resolvedTemplateId,
        content: content as object,
        importSource: importFormat,
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
      format: importFormat,
      sectionsCount: content.sections.length,
    });

    return NextResponse.json(resume);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    const status =
      message.includes("Unsupported") || message.includes("Invalid")
        ? 400
        : 500;
    console.error("Resume import error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
