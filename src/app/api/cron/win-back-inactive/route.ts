import { NextResponse } from "next/server";
import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendWinBackEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inactiveSince = subDays(new Date(), 30);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumedoctor.in";

  const users = await prisma.user.findMany({
    where: {
      winBackEmailSentAt: null,
      emailVerified: { not: null },
      subscription: { in: ["basic", "trial"] },
      resumes: { some: {} },
      NOT: {
        productEvents: {
          some: { createdAt: { gte: inactiveSince } },
        },
      },
    },
    select: { id: true, email: true, name: true },
    take: 50,
  });

  let sent = 0;
  const errors: string[] = [];

  for (const u of users) {
    const result = await sendWinBackEmail(u.email, {
      name: u.name,
      dashboardUrl: `${baseUrl}/dashboard`,
    });
    if (result.ok) {
      await prisma.user.update({
        where: { id: u.id },
        data: { winBackEmailSentAt: new Date() },
      });
      sent++;
    } else {
      errors.push(`${u.email}: ${result.error ?? "send failed"}`);
    }
  }

  return NextResponse.json({ ok: true, candidates: users.length, sent, errors });
}
