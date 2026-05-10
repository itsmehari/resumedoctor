// Phase 1.3 + Pro Link – fetch resume by public OR vanity slug.
//
// Both publicSlug (random, permanent, server-generated) and vanitySlug
// (Pro Link, user-claimed, optional) resolve to the same resume. We never
// 301 between them: every link the user has shared keeps working forever.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const trimmed = slug?.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const resume = await prisma.resume.findFirst({
    where: {
      OR: [{ publicSlug: trimmed }, { vanitySlug: trimmed }],
    },
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
