// Deprecated internal fallback — customer payments are collected only via SuperProfile (see /pricing, /api/webhooks/superprofile).
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Checkout is not available here. This is a deprecated internal fallback. Pay on /pricing via SuperProfile with the same email as your ResumeDoctor account.",
    },
    { status: 501 }
  );
}
