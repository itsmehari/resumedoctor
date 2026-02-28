// WBS 5.2 – HTML export for print preview (free tier)
import { NextRequest, NextResponse } from "next/server";
import { getResumeForExport, logExport } from "@/lib/export-api-helpers";
import { resumeToHtml } from "@/lib/export-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getResumeForExport(id);
  if ("error" in result) return result.error;

  const { resume, userId, subscription } = result;
  const isPro = ["pro_monthly", "pro_annual"].includes(subscription);
  const withWatermark = !isPro;

  const sections = resume.content.sections ?? [];
  const html = resumeToHtml(sections, resume.title, { withWatermark });

  await logExport(userId, id, "html");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
