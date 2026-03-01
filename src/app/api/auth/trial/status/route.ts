// Free Trial – Get session expiry for 5-min timer
import { NextResponse } from "next/server";
import { verifyTrialToken } from "@/lib/trial-jwt";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("trial_session")?.value;
  if (!cookie) {
    return NextResponse.json({ isTrial: false }, { status: 200 });
  }

  const payload = await verifyTrialToken(cookie);
  if (!payload) {
    return NextResponse.json({ isTrial: false }, { status: 200 });
  }

  return NextResponse.json({
    isTrial: true,
    sessionExpiresAt: new Date(payload.exp * 1000).toISOString(),
  });
}
