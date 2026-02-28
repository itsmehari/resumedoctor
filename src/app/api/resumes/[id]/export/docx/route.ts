// WBS 5.4 – DOCX export (Pro tier)
import { NextResponse } from "next/server";
import {
  getResumeForExport,
  logExport,
} from "@/lib/export-api-helpers";
import { buildDocx } from "@/lib/docx-export";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "resume";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getResumeForExport(id, { requirePro: true });
  if ("error" in result) return result.error;

  const { resume, userId } = result;
  const sections = resume.content.sections ?? [];

  const buffer = await buildDocx(sections, resume.title);
  await logExport(userId, id, "docx");

  const filename = `${slugify(resume.title)}-resume.docx`;
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
