// WBS 6.4, 6.6, 6.7 – AI improve professional summary (rate limited + cached)
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
  text: z.string().min(1, "Summary text required").max(2000),
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

  const rateLimit = await checkAiRateLimit(user.id, "improve-summary");
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
        { error: parsed.error.flatten().fieldErrors.text?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    const cached = await getCachedAiResponse<{ text: string }>("improve-summary", { text: parsed.data.text });
    if (cached) {
      await recordAiUsage(user.id, "improve-summary");
      await recordFeatureUsage(user.id, "ai", { action: "improve-summary", cached: true });
      return NextResponse.json(cached);
    }

    const generated = await chatCompletion(
      [
        {
          role: "system",
          content: `You are a professional resume writer. Improve the professional summary to be more impactful, concise, and keyword-rich for ATS. Keep it under 150 words. Use past tense for past roles and present tense for current role.`,
        },
        {
          role: "user",
          content: `Improve this professional summary:\n\n${parsed.data.text}`,
        },
      ],
      { maxTokens: 300 }
    );

    if (!generated) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    await recordAiUsage(user.id, "improve-summary");
    await recordFeatureUsage(user.id, "ai", { action: "improve-summary" });
    await setCachedAiResponse("improve-summary", { text: parsed.data.text }, { text: generated });
    return NextResponse.json({ text: generated });
  } catch (err) {
    console.error("AI improve summary error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 }
    );
  }
}
