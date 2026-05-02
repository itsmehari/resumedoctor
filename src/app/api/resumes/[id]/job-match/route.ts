// POST deterministic JD ↔ resume keyword match (no AI)
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";
import { parseResumeContent } from "@/lib/resume-utils";
import { computeJobDescriptionMatch } from "@/lib/job-description-match";

const schema = z.object({
  jobDescription: z.string().min(50, "Job description too short").max(15000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: user.id },
  });
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.flatten().fieldErrors.jobDescription?.[0] ?? "Invalid input",
        },
        { status: 400 }
      );
    }

    const content = parseResumeContent(resume.content);
    const result = computeJobDescriptionMatch(
      content.sections,
      parsed.data.jobDescription
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("Job match error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 }
    );
  }
}
