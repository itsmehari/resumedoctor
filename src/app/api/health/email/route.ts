// Email smoke-test endpoint. Admin-only.
//
// This route exists to surface Brevo / EMAIL_FROM / domain-verification
// regressions in seconds rather than letting them silently break the signup
// funnel. It performs a real send to a recipient supplied by the admin (or to
// the admin's own session email by default) using the same `send` chokepoint
// that signup verification and trial OTP go through.
//
// Usage:
//   POST /api/health/email
//   { "to": "ops@resumedoctor.in" }   // optional; defaults to admin email
//
// Returns the actual Brevo error if the send fails, so misconfig is visible.
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { sendTestEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  to: z.string().email("Invalid email").optional(),
});

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const to = parsed.data.to ?? admin.email;

  const env = {
    BREVO_API_KEY: !!process.env.BREVO_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM ?? null,
    EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO ?? null,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? null,
    NODE_ENV: process.env.NODE_ENV,
  };

  const result = await sendTestEmail(to);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        to,
        env,
        error:
          typeof result.error === "object" && result.error !== null
            ? result.error
            : { message: String(result.error ?? "unknown") },
        hint: !env.BREVO_API_KEY
          ? "BREVO_API_KEY is missing in Vercel Production env."
          : !env.EMAIL_FROM
            ? "EMAIL_FROM is missing — set it to a Brevo-verified sender (e.g. ResumeDoctor <noreply@yourdomain.com>)."
            : "Check the Brevo dashboard for delivery / domain verification errors.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    to,
    env,
    note: "Smoke email accepted by Brevo. Confirm it lands in the inbox (not Promotions/Spam).",
  });
}
