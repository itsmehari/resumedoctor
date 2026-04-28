// Vercel Cron – set subscription to basic when pro_trial_14 has expired (keeps DB aligned with gating)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const result = await prisma.user.updateMany({
    where: {
      subscription: "pro_trial_14",
      subscriptionExpiresAt: { lt: now },
    },
    data: {
      subscription: "basic",
      subscriptionExpiresAt: null,
    },
  });

  return NextResponse.json({ ok: true, updated: result.count });
}
