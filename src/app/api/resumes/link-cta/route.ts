import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResumeAuth } from "@/lib/trial-auth";

/** Auth-aware destination for "Get your resume link" CTAs. */
export async function GET() {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ href: "/try", reason: "guest" as const });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: auth.userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, publicSlug: true },
    take: 10,
  });

  if (resumes.length === 0) {
    return NextResponse.json({ href: "/resumes/new", reason: "no_resume" as const });
  }

  const withLink = resumes.find((r) => r.publicSlug);
  const target = withLink ?? resumes[0];

  if (withLink?.publicSlug) {
    return NextResponse.json({
      href: `/dashboard?highlight=share&resumeId=${target.id}`,
      reason: "has_link" as const,
      resumeId: target.id,
      publicSlug: withLink.publicSlug,
    });
  }

  return NextResponse.json({
    href: `/resumes/${target.id}/edit?share=1`,
    reason: "needs_publish" as const,
    resumeId: target.id,
  });
}
