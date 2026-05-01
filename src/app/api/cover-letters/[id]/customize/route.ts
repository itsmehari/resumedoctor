// WBS 8.4 – AI customize cover letter for job (Groq or OpenAI, rate limited)
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatCompletion, isAiConfigured } from "@/lib/ai-client";
import { checkAiRateLimit, recordAiUsage } from "@/lib/ai-rate-limit";
import { sessionUserEmail } from "@/lib/session-user";

const schema = z.object({
  jobDescription: z.string().min(1, "Job description required").max(10000),
  resumeContent: z.string().optional(),
  tone: z.enum(["formal", "casual", "technical"]).optional(),
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

  if (!isAiConfigured()) {
    return NextResponse.json({ error: "AI not configured. Set GROQ_API_KEY or OPENAI_API_KEY." }, { status: 503 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: user.id },
    include: { resume: true },
  });

  if (!letter) {
    return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
  }

  const rateLimit = await checkAiRateLimit(user.id, "customize-cover");
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `AI limit reached (${rateLimit.used}/${rateLimit.limit} today). Upgrade to Pro for more.`,
        code: "RATE_LIMITED",
        limit: rateLimit.limit,
        used: rateLimit.used,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.jobDescription?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    let resumeText = parsed.data.resumeContent;
    if (!resumeText && letter.resumeId && letter.resume) {
      const content = (letter.resume as { content?: unknown }).content;
      resumeText = typeof content === "object" && content && "sections" in content
        ? JSON.stringify((content as { sections?: unknown }).sections)
        : "";
    }

    const toneMap: Record<string, string> = {
      formal: "Formal, professional, and polished. Use standard business language, proper salutations (Dear Hiring Manager), and avoid contractions.",
      casual: "Friendly, conversational, and approachable. You may use contractions and a warmer, less stiff tone while still remaining professional.",
      technical: "Precise, technically focused, and industry-specific. Emphasize skills, tools, and achievements with concrete terminology. Professional but direct.",
    };
    const toneInstruction = toneMap[parsed.data.tone ?? "formal"] ?? toneMap.formal;

    const generated = await chatCompletion(
      [
        {
          role: "system",
          content: `You are a professional cover letter writer. Write a compelling, personalized cover letter that:
- Addresses the job description and requirements
- Highlights relevant experience from the resume
- Is 3-4 short paragraphs
- Tone: ${toneInstruction}
- Starts with a strong opening, ends with a call to action
- Uses "Dear Hiring Manager" unless a name is provided`,
        },
        {
          role: "user",
          content: `Job description:\n${parsed.data.jobDescription}\n\n${
            resumeText ? `Resume summary (sections):\n${resumeText.slice(0, 4000)}\n\n` : ""
          }${
            letter.company ? `Company: ${letter.company}\n` : ""
          }${letter.role ? `Role: ${letter.role}\n` : ""}
Write a tailored cover letter:`,
        },
      ],
      { maxTokens: 800 }
    );
    if (!generated) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    await recordAiUsage(user.id, "customize-cover");
    await prisma.coverLetter.update({
      where: { id },
      data: { content: generated },
    });

    return NextResponse.json({ content: generated });
  } catch (err) {
    console.error("AI customize error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 }
    );
  }
}
