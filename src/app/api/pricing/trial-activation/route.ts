// Disabled — trial sales are only through SuperProfile; admin UPI approvals remain in /admin for legacy rows.
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "This form is no longer used. Buy the 14-day trial on /pricing through SuperProfile with the same email as your account.",
    },
    { status: 410 }
  );
}
