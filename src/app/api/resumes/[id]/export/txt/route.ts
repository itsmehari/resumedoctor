// WBS 5.1 – TXT export (free tier)
import { NextResponse } from "next/server";
import { getResumeForExport, logExport } from "@/lib/export-api-helpers";
import { resumeToPlainText } from "@/lib/export-utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getResumeForExport(id);
  if ("error" in result) return result.error;

  const { resume, userId } = result;
  const sections = resume.content.sections ?? [];
  const text = resumeToPlainText(sections, resume.title);

  await logExport(userId, id, "txt");

  const filename = `${slugify(resume.title)}-resume.txt`;
  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "resume";
}
