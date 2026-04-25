// Vercel Cron – email users on pro_trial_14 before subscriptionExpiresAt (3d and 1d windows)
import { NextResponse } from "next/server";
import { addDays, addHours } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendProTrialExpiryReminder } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumedoctor.in";
  const renewUrl = `${baseUrl}/pricing`;

  const window3dStart = addDays(now, 2);
  const window3dEnd = addDays(now, 4);
  const window1dStart = addHours(now, 12);
  const window1dEnd = addHours(now, 36);

  const candidates = await prisma.user.findMany({
    where: {
      subscription: "pro_trial_14",
      subscriptionExpiresAt: { gt: now },
      OR: [
        {
          subscriptionExpiresAt: { gte: window3dStart, lte: window3dEnd },
          proTrialReminder3dSentAt: null,
        },
        {
          subscriptionExpiresAt: { gte: window1dStart, lte: window1dEnd },
          proTrialReminder1dSentAt: null,
        },
      ],
    },
    select: {
      id: true,
      email: true,
      subscriptionExpiresAt: true,
      notificationPrefs: true,
      proTrialReminder3dSentAt: true,
      proTrialReminder1dSentAt: true,
    },
  });

  let sent3d = 0;
  let sent1d = 0;
  const errors: string[] = [];

  for (const u of candidates) {
    const prefs = u.notificationPrefs as { productUpdates?: boolean } | null;
    if (prefs?.productUpdates === false) continue;

    const exp = u.subscriptionExpiresAt;
    if (!exp) continue;

    const msLeft = exp.getTime() - now.getTime();
    const daysLeft = Math.max(1, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));

    const in3dWindow = exp >= window3dStart && exp <= window3dEnd && !u.proTrialReminder3dSentAt;
    const in1dWindow = exp >= window1dStart && exp <= window1dEnd && !u.proTrialReminder1dSentAt;

    if (in1dWindow) {
      const r = await sendProTrialExpiryReminder(u.email, { daysLeft: 1, renewUrl });
      if (r.ok) {
        await prisma.user.update({
          where: { id: u.id },
          data: { proTrialReminder1dSentAt: new Date() },
        });
        sent1d += 1;
      } else {
        errors.push(`${u.id}:1d:${String(r.error)}`);
      }
      continue;
    }

    if (in3dWindow) {
      const r = await sendProTrialExpiryReminder(u.email, { daysLeft: Math.min(daysLeft, 3), renewUrl });
      if (r.ok) {
        await prisma.user.update({
          where: { id: u.id },
          data: { proTrialReminder3dSentAt: new Date() },
        });
        sent3d += 1;
      } else {
        errors.push(`${u.id}:3d:${String(r.error)}`);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    examined: candidates.length,
    sent3d,
    sent1d,
    errors: errors.length ? errors.slice(0, 20) : undefined,
  });
}
