// Interview prep – AI-generated sample answer (rate limited)
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatCompletion, isAiConfigured } from "@/lib/ai-client";
import { checkAiRateLimit, recordAiUsage } from "@/lib/ai-rate-limit";

const schema = z.object({
  question: z.string().min(1, "Question required").max(1000),
  resumeId: z.string().optional(),
});

function buildResumeContext(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const obj = content as Record<string, unknown>;
  const sections = Array.isArray(obj.sections) ? obj.sections : [];
  const parts: string[] = [];

  for (const s of sections) {
    if (!s || typeof s !== "object" || !("type" in s)) continue;
    const sec = s as { type: string; data?: unknown };
    const d = sec.data;
    if (!d || typeof d !== "object") continue;
    const data = d as Record<string, unknown>;

    switch (sec.type) {
      case "contact":
        parts.push(
          `Name: ${(data.name as string) || ""}. Title: ${(data.title as string) || ""}.`
        );
        break;
      case "summary":
      case "objective":
        parts.push(`Summary: ${(data.text as string) || ""}`);
        break;
      case "experience":
        if (Array.isArray(data.entries)) {
          for (const e of data.entries as Record<string, unknown>[]) {
            parts.push(
              `${e.title || ""} at ${e.company || ""}: ${Array.isArray(e.bullets) ? (e.bullets as string[]).join(" ") : ""}`
            );
          }
        }
        break;
      case "education":
        if (Array.isArray(data.entries)) {
          for (const e of data.entries as Record<string, unknown>[]) {
            parts.push(`${e.degree || ""} from ${e.school || ""}`);
          }
        }
        break;
      case "skills":
        if (Array.isArray(data.items)) {
          parts.push(`Skills: ${(data.items as string[]).join(", ")}`);
        }
        break;
      default:
        break;
    }
  }

  return parts.join("\n").slice(0, 4000);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "AI not configured." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const rateLimit = await checkAiRateLimit(user.id, "interview-answer");
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Daily limit reached (${rateLimit.used}/${rateLimit.limit}). Upgrade to Pro for more.`,
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
        { error: parsed.error.flatten().fieldErrors.question?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    let resumeContext = "";
    if (parsed.data.resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: parsed.data.resumeId, userId: user.id },
        select: { content: true },
      });
      if (resume?.content) {
        resumeContext = buildResumeContext(resume.content);
      }
    }

    const contextBlock =
      resumeContext.trim().length > 0
        ? `Candidate background (use this to personalize the answer):\n${resumeContext}\n\n`
        : "";

    const answer = await chatCompletion(
      [
        {
          role: "system",
          content: `You are a career coach helping a job seeker prepare for interviews. Given an interview question and optionally the candidate's resume summary, provide a concise, professional sample answer (2-4 short paragraphs). The answer should sound natural when spoken, highlight relevant experience, and be tailored to the candidate's background when provided. Do not use bullet points. Keep tone confident and positive.`,
        },
        {
          role: "user",
          content: `${contextBlock}Interview question: ${parsed.data.question}`,
        },
      ],
      { maxTokens: 500 }
    );

    await recordAiUsage(user.id, "interview-answer");
    return NextResponse.json({ answer: answer || "" });
  } catch (err) {
    console.error("Interview prep answer error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 }
    );
  }
}
