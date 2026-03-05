// WBS 13.7 – Health check / uptime monitoring endpoint
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const checks: Record<string, { ok: boolean; message: string }> = {};

  // 1. Resend API key
  checks.resend = process.env.RESEND_API_KEY
    ? { ok: true, message: "RESEND_API_KEY is set" }
    : { ok: false, message: "RESEND_API_KEY is missing in Vercel env" };

  // 2. Database URLs
  const hasDb = !!process.env.DATABASE_URL;
  const hasDirect = !!process.env.DIRECT_URL;
  checks.database_url = hasDb
    ? { ok: true, message: "DATABASE_URL is set" }
    : { ok: false, message: "DATABASE_URL is missing in Vercel env" };
  checks.direct_url = hasDirect
    ? { ok: true, message: "DIRECT_URL is set" }
    : { ok: false, message: "DIRECT_URL is missing (required for Prisma with Neon/Supabase)" };

  // 3. Prisma connection + TrialSession table
  try {
    await prisma.$queryRaw`SELECT 1`;
    await prisma.trialSession.findFirst({ take: 1 });
    checks.prisma = { ok: true, message: "Database connected, TrialSession table exists" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    checks.prisma = {
      ok: false,
      message: msg.includes("DIRECT_URL") || msg.includes("directUrl")
        ? "DIRECT_URL not set or invalid. Add it in Vercel env (use Neon direct connection URL)."
        : msg.includes("TrialSession") || msg.includes("does not exist")
          ? "Migrations not run. Run: npx prisma migrate deploy"
          : msg.length > 80
            ? msg.slice(0, 80) + "..."
            : msg,
    };
  }

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "unknown",
      timestamp: new Date().toISOString(),
      checks,
      hint: !allOk
        ? "Fix the failing checks above. Add env vars in Vercel → Settings → Environment Variables, then Redeploy."
        : null,
    },
    { status: allOk ? 200 : 503 }
  );
}
