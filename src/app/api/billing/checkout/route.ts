// Disabled — customer payments are collected only via SuperProfile (see /pricing, /api/webhooks/superprofile).
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Checkout is not available here. Pay on the pricing page through SuperProfile with the same email as your ResumeDoctor account.",
    },
    { status: 501 }
  );
}
