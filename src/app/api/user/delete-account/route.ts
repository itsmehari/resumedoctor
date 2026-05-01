// User – Delete account (requires email confirmation + per-user rate limit)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkIpRateLimit, getClientIp, auditLog } from "@/lib/ip-rate-limit";
import { AnalyticsEvents } from "@/lib/analytics-event-names";
import { normalizeEmail } from "@/lib/email-normalize";
import { sessionUserEmail } from "@/lib/session-user";
import { requireVerifiedEmailOr403 } from "@/lib/email-verification-guard";

// 3 attempts per IP per 24 hours – prevents repeated automated deletion attempts
const IP_RATE_LIMIT = { windowMs: 24 * 60 * 60 * 1000, maxRequests: 3 };

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const verifiedBlock = await requireVerifiedEmailOr403(sessionEmail);
  if (verifiedBlock) return verifiedBlock;

  const ip = getClientIp(req);

  // IP rate limit – even authenticated accounts; prevents scripted/social-engineering attacks
  const rl = await checkIpRateLimit("delete-account", ip, IP_RATE_LIMIT);
  if (!rl.allowed) {
    await auditLog("delete_account", {
      userId: undefined,
      ip,
      success: false,
      meta: { reason: "rate_limited", email: sessionEmail },
    });
    return NextResponse.json(
      { error: "Too many requests. Please try again tomorrow." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000)) },
      }
    );
  }

  const body = await req.json().catch(() => ({}));
  const confirmed = body.confirm === true;
  const confirmedEmail: string | undefined = body.email;
  const churnReason: string | undefined =
    typeof body.churnReason === "string" ? body.churnReason.slice(0, 200) : undefined;
  const churnDetail: string | undefined =
    typeof body.churnDetail === "string" ? body.churnDetail.slice(0, 2000) : undefined;

  if (!confirmed) {
    return NextResponse.json(
      { error: "Confirmation required. Send { confirm: true, email: \"your@email.com\" }." },
      { status: 400 }
    );
  }

  // Require the user to explicitly type their own email address
  if (!confirmedEmail || normalizeEmail(confirmedEmail) !== sessionEmail) {
    await auditLog("delete_account", {
      ip,
      success: false,
      meta: { reason: "email_mismatch", provided: confirmedEmail, session: sessionEmail },
    });
    return NextResponse.json(
      { error: "Email confirmation does not match your account." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (churnReason) {
        await tx.churnFeedback.create({
          data: {
            userId: user.id,
            userEmail: sessionEmail,
            reason: churnReason,
            detail: churnDetail,
            source: "delete_account",
          },
        });
      }
      await tx.productEvent.create({
        data: {
          userId: user.id,
          name: AnalyticsEvents.churn_completed,
          props: churnReason ? { reason_code: churnReason } : undefined,
        },
      });
      await tx.user.delete({ where: { id: user.id } });
    });

    await auditLog("delete_account", {
      userId: user.id,
      ip,
      success: true,
      meta: { email: sessionEmail },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);
    await auditLog("delete_account", {
      userId: user.id,
      ip,
      success: false,
      meta: { reason: "db_error", email: sessionEmail },
    });
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
