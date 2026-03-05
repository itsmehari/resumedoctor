// WBS 6.2, 6.6, 6.7 – AI improve single bullet point (rate limited + cached)
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
  bullet: z.string().min(1, "Bullet text required").max(500),
  context: z.string().optional(), // job title, company for context
});

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

  const rateLimit = await checkAiRateLimit(user.id, "improve-bullet");
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
        { error: parsed.error.flatten().fieldErrors.bullet?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    const contextNote = parsed.data.context
      ? `Context: ${parsed.data.context}\n\n`
      : "";
    const cacheInput = { bullet: parsed.data.bullet, context: parsed.data.context };
    const cached = await getCachedAiResponse<{ bullet: string }>("improve-bullet", cacheInput);
    if (cached) {
      await recordAiUsage(user.id, "improve-bullet");
      await recordFeatureUsage(user.id, "ai", { action: "improve-bullet", cached: true });
      return NextResponse.json(cached);
    }

    const generated = await chatCompletion(
      [
        {
          role: "system",
          content: `You are a professional resume writer. Rewrite the bullet point to be more impactful: use strong action verbs, quantify results when possible, and keep it concise (1-2 lines). Return ONLY the improved bullet, no quotes or extra text.`,
        },
        {
          role: "user",
          content: `${contextNote}Rewrite this bullet point:\n\n${parsed.data.bullet}`,
        },
      ],
      { maxTokens: 150 }
    );

    if (!generated) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    const cleaned = generated.replace(/^["']|["']$/g, "").trim();
    await recordAiUsage(user.id, "improve-bullet");
    await recordFeatureUsage(user.id, "ai", { action: "improve-bullet" });
    await setCachedAiResponse("improve-bullet", cacheInput, { bullet: cleaned });
    return NextResponse.json({ bullet: cleaned });
  } catch (err) {
    console.error("AI improve bullet error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 }
    );
  }
}
