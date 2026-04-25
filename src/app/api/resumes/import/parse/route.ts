// Parse resume file + AI suggest 2 templates (no DB create)
import { NextResponse } from "next/server";
import { getTemplateAccessContext } from "@/lib/template-access";
import {
  extractTextFromFile,
  validateFile,
  parseResumeWithAi,
  suggestTemplatesFromResume,
  isImportSupported,
  ACCEPTED_TYPES,
} from "@/lib/resume-import";
import { parseResumeContent } from "@/lib/resume-utils";
import { getTemplate } from "@/lib/templates";

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

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded. Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    validateFile({ size: file.size, type: file.type }, ACCEPTED_TYPES);

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
    const content = {
      sections: sections.length > 0 ? sections : parsed.sections,
      meta: parsed.meta,
    };

    const allowedIds = access.allowedTemplateIds;
    let suggested = await suggestTemplatesFromResume(parsed);
    suggested = suggested
      .filter((s) => allowedIds.includes(s.id))
      .slice(0, 10);
    if (suggested.length === 0) {
      const fallback = access.isTrial ? allowedIds[0] : "professional-in";
      const t = getTemplate(fallback ?? "professional-in");
      suggested = [{ id: fallback ?? "professional-in", name: t?.name ?? "Professional", reason: "Best fit for your profile" }];
    }
    // Pad to at least 10 options from allowed templates if AI returned fewer
    const used = new Set(suggested.map((s) => s.id));
    for (const id of allowedIds) {
      if (used.size >= 10) break;
      if (!used.has(id)) {
        const t = getTemplate(id);
        suggested.push({ id, name: t?.name ?? id, reason: "Alternative option" });
        used.add(id);
      }
    }

    return NextResponse.json({
      parsed: content,
      title: file.name.replace(/\.[^/.]+$/, "") || "Imported Resume",
      suggestedTemplates: suggested,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("Resume import parse error:", message, stack);
    return NextResponse.json(
      { error: message },
      { status: message.includes("Unsupported") || message.includes("Invalid") ? 400 : 500 }
    );
  }
}
