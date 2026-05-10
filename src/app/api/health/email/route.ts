// Email smoke-test endpoint. Admin-only.
//
// This route exists to surface ZeptoMail / EMAIL_FROM / domain-verification
// regressions in seconds rather than letting them silently break the signup
// funnel. It performs a real send to a recipient supplied by the admin (or to
// the admin's own session email by default) using the same `send` chokepoint
// that signup verification and trial OTP go through.
//
// Usage:
//   POST /api/health/email
//   { "to": "ops@resumedoctor.in" }   // optional; defaults to admin email
//
// Returns the actual ZeptoMail error if the send fails, so misconfig is visible.
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
    ZEPTOMAIL_SEND_TOKEN:
      !!(process.env.ZEPTOMAIL_SEND_TOKEN?.trim() ||
        process.env.ZEPTOMAIL_TOKEN?.trim() ||
        process.env.ZEPTOMAIL_API_KEY?.trim()),
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
        hint: !env.ZEPTOMAIL_SEND_TOKEN
          ? "ZEPTOMAIL_SEND_TOKEN is missing — copy Send Mail Token from ZeptoMail → Agents → SMTP/API → API tab."
          : !env.EMAIL_FROM
            ? "EMAIL_FROM is missing — use a sender on your ZeptoMail-verified domain (e.g. ResumeDoctor <noreply@resumedoctor.in>)."
            : "Check ZeptoMail logs / domain verification (Associate Domains must not be Pending).",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    to,
    env,
    note: "Smoke email accepted by ZeptoMail. Confirm it lands in the inbox (not Promotions/Spam).",
  });
}
