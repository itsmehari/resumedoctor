import { NextResponse } from "next/server";
import { getEffectiveAuth } from "@/lib/effective-auth";
import { getAiDailyUsageState } from "@/lib/ai-rate-limit";
import { loadUserEntitlements } from "@/lib/entitlements";

/** Usage limits and entitlements for the current requester (session, trial, or impersonation). */
export async function GET() {
  const auth = await getEffectiveAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [ai, entitlements] = await Promise.all([
    getAiDailyUsageState(auth.userId),
    loadUserEntitlements(auth.userId, auth.isTrial),
  ]);

  if (!ai || !entitlements) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    isTrial: auth.isTrial,
    isImpersonating: auth.isImpersonating ?? false,
    entitlements: {
      hasFullPro: entitlements.hasFullPro,
      canExportPaidFormats: entitlements.canExportPaidFormats,
      resumePackCredits: entitlements.resumePackCredits,
      proLinkActive: entitlements.proLink.active,
    },
    ai: {
      used: ai.used,
      limit: ai.limit,
      remaining: Math.max(0, ai.limit - ai.used),
      isProTier: ai.isProTier,
    },
  });
}
