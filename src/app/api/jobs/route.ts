// WBS 9.2, 9.4, 9.8 – Job feed API (paginated, filterable, keyword-matched)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractResumeKeywords } from "@/lib/resume-utils";
import { sessionUserEmail } from "@/lib/session-user";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
  const industry = searchParams.get("industry") ?? undefined;
  const location = searchParams.get("location") ?? undefined;
  const query = searchParams.get("q") ?? undefined;
  const resumeId = searchParams.get("resumeId") ?? undefined;
  const skip = (page - 1) * limit;

  const where = {
    active: true,
    ...(industry ? { industry: { contains: industry, mode: "insensitive" as const } } : {}),
    ...(location ? { location: { contains: location, mode: "insensitive" as const } } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { company: { contains: query, mode: "insensitive" as const } },
            { description: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.job.count({ where }),
  ]);

  // Keyword matching: fetch user resume and compute match scores
  let resumeKeywords: string[] = [];
  if (resumeId && sessionEmail) {
    const user = await prisma.user.findUnique({
      where: { email: sessionEmail },
      select: { id: true },
    });
    if (user) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: user.id },
        select: { content: true },
      });
      if (resume) {
        resumeKeywords = extractResumeKeywords(resume.content);
      }
    }
  }

  // Attach match score and saved status
  let savedJobIds = new Set<string>();
  if (sessionEmail) {
    const user = await prisma.user.findUnique({
      where: { email: sessionEmail },
      select: { id: true },
    });
    if (user) {
      const applications = await prisma.jobApplication.findMany({
        where: { userId: user.id, jobId: { in: jobs.map((j) => j.id) } },
        select: { jobId: true },
      });
      savedJobIds = new Set(applications.map((a) => a.jobId));
    }
  }

  const enriched = jobs.map((job) => {
    const jobSkills = (job.skills as string[]) ?? [];
    let matchScore = 0;
    if (resumeKeywords.length > 0) {
      const matched = jobSkills.filter((s) =>
        resumeKeywords.some((k) => k.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(k.toLowerCase()))
      );
      matchScore = Math.round((matched.length / Math.max(jobSkills.length, 1)) * 100);
    }
    return { ...job, matchScore, saved: savedJobIds.has(job.id) };
  });

  // Sort by match score if resume provided
  if (resumeKeywords.length > 0) {
    enriched.sort((a, b) => b.matchScore - a.matchScore);
  }

  return NextResponse.json({
    jobs: enriched,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
