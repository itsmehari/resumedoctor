import { NextResponse } from "next/server";
import { subHours, subMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendTrialPreviewFollowupEmail, sendTrialPreviewReminder24hEmail } from "@/lib/email";
import { hasFullProAccess } from "@/lib/subscription-entitlements";
import { recordProductEvent } from "@/lib/product-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function alreadySent(userId: string, name: string): Promise<boolean> {
  const existing = await prisma.productEvent.findFirst({
    where: { userId, name },
    select: { id: true },
  });
  return Boolean(existing);
}

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumedoctor.in";
  const tryUrl = `${baseUrl}/try`;
  const pricingUrl = `${baseUrl}/pricing#trial`;

  const now = new Date();
  const immediateStart = subMinutes(now, 30);
  const immediateEnd = subMinutes(now, 10);
  const h24Start = subHours(now, 25);
  const h24End = subHours(now, 23);

  const sessions = await prisma.trialSession.findMany({
    where: {
      verifiedAt: { not: null },
      OR: [
        { verifiedAt: { gte: immediateStart, lte: immediateEnd } },
        { verifiedAt: { gte: h24Start, lte: h24End } },
      ],
    },
    select: { id: true, email: true, verifiedAt: true },
    take: 200,
  });

  let examined = sessions.length;
  let sentImmediate = 0;
  let sent24h = 0;
  const errors: string[] = [];

  for (const s of sessions) {
    const email = s.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, subscription: true, subscriptionExpiresAt: true },
    });
    if (!user) continue;

    // Don't email if already Pro (or in a paid pass).
    if (hasFullProAccess(user.subscription, user.subscriptionExpiresAt)) continue;

    const verifiedAt = s.verifiedAt?.getTime() ?? 0;
    const isImmediate = verifiedAt >= immediateStart.getTime() && verifiedAt <= immediateEnd.getTime();
    const is24h = verifiedAt >= h24Start.getTime() && verifiedAt <= h24End.getTime();

    if (isImmediate) {
      const eventName = "trial_followup_email_sent";
      if (await alreadySent(user.id, eventName)) continue;
      const r = await sendTrialPreviewFollowupEmail(email, { tryUrl, pricingUrl });
      if (r.ok) {
        await recordProductEvent({
          userId: user.id,
          name: eventName,
          props: { trialSessionId: s.id },
        });
        sentImmediate += 1;
      } else {
        errors.push(`${email}:15m:${String(r.error)}`);
      }
      continue;
    }

    if (is24h) {
      const eventName = "trial_followup_24h_email_sent";
      if (await alreadySent(user.id, eventName)) continue;
      const r = await sendTrialPreviewReminder24hEmail(email, { tryUrl, pricingUrl });
      if (r.ok) {
        await recordProductEvent({
          userId: user.id,
          name: eventName,
          props: { trialSessionId: s.id },
        });
        sent24h += 1;
      } else {
        errors.push(`${email}:24h:${String(r.error)}`);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    examined,
    sentImmediate,
    sent24h,
    errors: errors.length ? errors.slice(0, 20) : undefined,
  });
}

