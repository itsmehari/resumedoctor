// WBS 4.4 – Template list API
import { NextResponse } from "next/server";
import { TEMPLATES } from "@/lib/templates";
import { isTemplateProOnly } from "@/lib/template-access";

export async function GET() {
  return NextResponse.json({
    templates: TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      version: t.version,
      category: t.category,
      colors: t.colors,
      trialAvailable: t.trialAvailable,
      thumbnailUrl: t.thumbnailUrl ?? `/templates/thumbnails/${t.id}.png`,
      isProOnly: isTemplateProOnly(t.id),
    })),
  });
}
