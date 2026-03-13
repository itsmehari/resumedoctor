// Phase 1.3 – Fetch resume by public slug (for /r/[slug])
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug?.trim()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const resume = await prisma.resume.findUnique({
    where: { publicSlug: slug },
    select: {
      id: true,
      title: true,
      templateId: true,
      content: true,
      updatedAt: true,
    },
  });
  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(resume);
}
