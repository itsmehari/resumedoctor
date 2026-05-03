import { NextResponse } from "next/server";
import { getEffectiveAuth } from "@/lib/effective-auth";
import { getAiDailyUsageState } from "@/lib/ai-rate-limit";

/** AI usage for today (UTC); supports trial and impersonation via effective auth. */
export async function GET() {
  const auth = await getEffectiveAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ai = await getAiDailyUsageState(auth.userId);
  if (!ai) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    isTrial: auth.isTrial,
    ai: {
      used: ai.used,
      limit: ai.limit,
      remaining: Math.max(0, ai.limit - ai.used),
      isProTier: ai.isProTier,
    },
  });
}
