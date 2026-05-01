// WBS 6.3, 6.6, 6.7 – AI suggest bullets for role from job description (rate limited + cached)
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatCompletion, isAiConfigured } from "@/lib/ai-client";
import { checkAiRateLimit, recordAiUsage } from "@/lib/ai-rate-limit";
import { getCachedAiResponse, setCachedAiResponse } from "@/lib/ai-cache";
import { recordFeatureUsage } from "@/lib/feature-usage";
import { sessionUserEmail } from "@/lib/session-user";

const schema = z.object({
  jobDescription: z.string().min(1, "Job description required").max(8000),
  role: z.string().optional(), // job title
  company: z.string().optional(),
  existingBullets: z.array(z.string()).optional(),
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
    return NextResponse.json(
      { error: "AI not configured. Set GROQ_API_KEY or OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const rateLimit = await checkAiRateLimit(user.id, "suggest-bullets");
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
      jobDescription: parsed.data.jobDescription,
      role: parsed.data.role,
      company: parsed.data.company,
    };
    const cachedBullets = await getCachedAiResponse<{ bullets: string[] }>("suggest-bullets", cacheInput);
    if (cachedBullets) {
      await recordAiUsage(user.id, "suggest-bullets");
      await recordFeatureUsage(user.id, "ai", { action: "suggest-bullets", cached: true });
      return NextResponse.json(cachedBullets);
    }

    const roleNote = parsed.data.role ? `Role: ${parsed.data.role}\n` : "";
    const companyNote = parsed.data.company ? `Company: ${parsed.data.company}\n` : "";
    const existingNote =
      parsed.data.existingBullets?.length
        ? `\nExisting bullets (avoid duplicating):\n${parsed.data.existingBullets.filter(Boolean).join("\n")}\n`
        : "";

    const generated = await chatCompletion(
      [
        {
          role: "system",
          content: `You are a professional resume writer. Suggest 4-6 achievement bullet points tailored to the job description. Each bullet should:
1. Use strong action verbs
2. Quantify results where possible (%, numbers, time saved)
3. Align with key requirements in the job description
4. Be concise (1-2 lines each)

Return ONLY a JSON array of strings, e.g. ["bullet 1", "bullet 2", ...] No other text.`,
        },
        {
          role: "user",
          content: `${roleNote}${companyNote}Job description:\n${parsed.data.jobDescription}${existingNote}\nSuggest tailored achievement bullets:`,
        },
      ],
      { maxTokens: 600 }
    );

    if (!generated) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    const cleaned = generated.replace(/```json|```/g, "").trim();
    let bullets: string[];
    try {
      const arr = JSON.parse(cleaned);
      bullets = Array.isArray(arr)
        ? arr.map((b: unknown) => String(b ?? "")).filter(Boolean)
        : [];
    } catch {
      bullets = cleaned
        .split("\n")
        .map((s) => s.replace(/^[-*]\s*/, "").trim())
        .filter(Boolean);
    }

    await recordAiUsage(user.id, "suggest-bullets");
    await recordFeatureUsage(user.id, "ai", { action: "suggest-bullets" });
    await setCachedAiResponse("suggest-bullets", cacheInput, { bullets });
    return NextResponse.json({ bullets });
  } catch (err) {
    console.error("AI suggest bullets error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 }
    );
  }
}
