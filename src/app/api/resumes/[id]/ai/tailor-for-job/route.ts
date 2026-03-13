// Phase 1.2 – Paste job description → AI tailor
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatCompletion, isAiConfigured } from "@/lib/ai-client";
import { checkAiRateLimit, recordAiUsage } from "@/lib/ai-rate-limit";
import { getCachedAiResponse, setCachedAiResponse } from "@/lib/ai-cache";
import { recordFeatureUsage } from "@/lib/feature-usage";

const schema = z.object({
  jobDescription: z.string().min(50, "Job description too short").max(15000),
  jobUrl: z.string().url().optional(),
});

export interface TailorSuggestion {
  type: "keywords" | "summary" | "skills" | "bullets";
  sectionId?: string;
  entryIndex?: number;
  bulletIndex?: number;
  suggested: string | string[];
  reason?: string;
}

export interface TailorForJobResponse {
  keywords: string[];
  summarySuggestion?: string;
  skillsToAdd: string[];
  bulletSuggestions: Array<{
    sectionId: string;
    entryIndex: number;
    bulletIndex: number;
    current: string;
    suggested: string;
    reason?: string;
  }>;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "AI not configured. Set GROQ_API_KEY or OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const rateLimit = await checkAiRateLimit(user.id, "tailor-for-job");
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `AI limit reached (${rateLimit.used}/${rateLimit.limit} today). Upgrade to Pro for more.`,
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

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
        { error: parsed.error.flatten().fieldErrors.jobDescription?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    const cacheInput = {
      jobDesc: parsed.data.jobDescription.slice(0, 2000),
      resumeId: id,
      resumeVersion: resume.version,
    };
    const cached = await getCachedAiResponse<TailorForJobResponse>("tailor-for-job", cacheInput);
    if (cached) {
      await recordAiUsage(user.id, "tailor-for-job");
      await recordFeatureUsage(user.id, "ai", { action: "tailor-for-job", cached: true });
      return NextResponse.json(cached);
    }

    const content = resume.content as { sections?: unknown[] };

    const prompt = `You are a resume expert. Given a resume and a job description, suggest specific improvements to tailor the resume.

Resume structure (include section id in bulletSuggestions.sectionId):
---
${buildResumeStructureForAi(content?.sections ?? [])}
---

Job description:
---
${parsed.data.jobDescription.slice(0, 6000)}
---

Return ONLY valid JSON in this exact shape (no markdown, no extra text):
{
  "keywords": ["keyword1", "keyword2", ...],
  "summarySuggestion": "Optional: improved summary paragraph that incorporates job requirements",
  "skillsToAdd": ["skill1", "skill2", ...],
  "bulletSuggestions": [
    {
      "sectionId": "section-id-from-resume",
      "entryIndex": 0,
      "bulletIndex": 0,
      "current": "original bullet text",
      "suggested": "improved bullet with metrics and keywords",
      "reason": "brief reason"
    }
  ]
}

Rules:
- keywords: 5-15 keywords from the job description that are missing or underused in the resume
- summarySuggestion: only if resume has a summary; make it more aligned with the job; omit if no summary
- skillsToAdd: 3-8 skills from the job that aren't clearly in the resume
- bulletSuggestions: suggest 2-5 bullet rewrites; use the exact section "id" from the resume JSON below for sectionId; entryIndex = job index within experience (0-based), bulletIndex = bullet index (0-based)
- Each suggested bullet should use strong action verbs, quantify results, and include job-relevant keywords`;

    const generated = await chatCompletion(
      [
        {
          role: "system",
          content: "Output only valid JSON. No markdown, no code blocks.",
        },
        { role: "user", content: prompt },
      ],
      { maxTokens: 2500 }
    );

    const cleaned = (generated || "{}").replace(/```json|```/g, "").trim();
    let result: TailorForJobResponse;
    try {
      const parsed = JSON.parse(cleaned);
      result = {
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 15) : [],
        summarySuggestion: typeof parsed.summarySuggestion === "string" ? parsed.summarySuggestion : undefined,
        skillsToAdd: Array.isArray(parsed.skillsToAdd) ? parsed.skillsToAdd.slice(0, 10) : [],
        bulletSuggestions: Array.isArray(parsed.bulletSuggestions)
          ? parsed.bulletSuggestions
              .filter(
                (b: unknown) =>
                  b &&
                  typeof b === "object" &&
                  "suggested" in b &&
                  typeof (b as { suggested: unknown }).suggested === "string"
              )
              .slice(0, 8)
          : [],
      };
    } catch {
      result = {
        keywords: [],
        skillsToAdd: [],
        bulletSuggestions: [],
      };
    }

    await recordAiUsage(user.id, "tailor-for-job");
    await recordFeatureUsage(user.id, "ai", { action: "tailor-for-job" });
    await setCachedAiResponse("tailor-for-job", cacheInput, result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Tailor for job error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 }
    );
  }
}

function buildResumeStructureForAi(sections: unknown[]): string {
  const parts: string[] = [];
  for (const s of sections) {
    if (!s || typeof s !== "object") continue;
    const sec = s as { type?: string; id?: string; data?: unknown; order?: number };
    parts.push(`[${sec.type} id=${sec.id ?? "?"}]`);
    const d = sec.data;
    if (!d || typeof d !== "object") continue;
    const data = d as Record<string, unknown>;
    if (sec.type === "experience") {
      const entries = Array.isArray(data.entries) ? data.entries : [data];
      entries.forEach((e: unknown, i: number) => {
        const x = e as Record<string, unknown>;
        parts.push(`  Entry ${i}: ${x.title} at ${x.company}`);
        (Array.isArray(x.bullets) ? x.bullets : []).forEach((b: unknown, bi: number) =>
          parts.push(`    Bullet ${bi}: ${String(b).slice(0, 80)}`)
        );
      });
    }
    if (sec.type === "summary" || sec.type === "objective") {
      parts.push(`  ${String(data.text ?? "").slice(0, 200)}`);
    }
  }
  return parts.join("\n");
}
