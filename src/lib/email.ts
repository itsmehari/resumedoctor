// Transactional email via Resend. Used for signup verification, trial OTP,
// password reset, email-change confirmation, and Pro trial reminders.
//
// Deliverability hardening (May 2026):
//  - Always include a plain-text alternative — biggest single lift for inbox
//    placement on Gmail/Outlook. Without it Gmail tags many transactional
//    sends as Promotions.
//  - Set a real `replyTo` so replies do not bounce.
//  - Add a `List-Unsubscribe` header on long-lived/marketing-adjacent emails
//    (the Pro trial reminder); transactional verification mails are excluded
//    per RFC 8058 / Gmail bulk sender guidance.
//  - In production, refuse to send if `EMAIL_FROM` is unset rather than
//    silently sending from the shared `onboarding@resend.dev` sandbox sender,
//    which is heavily filtered.
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const SANDBOX_FROM = "ResumeDoctor <onboarding@resend.dev>";
const fromEmail = process.env.EMAIL_FROM || SANDBOX_FROM;
const replyTo = process.env.EMAIL_REPLY_TO || "support@resumedoctor.in";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "ResumeDoctor";
const isProd = process.env.NODE_ENV === "production";

export const resend = apiKey ? new Resend(apiKey) : null;

if (isProd) {
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY is not set in production. Verification, OTP, and password-reset emails will all fail. Set it in Vercel → Settings → Environment Variables."
    );
  }
  if (!process.env.EMAIL_FROM) {
    console.warn(
      "[email] EMAIL_FROM is not set in production. Transactional emails will be REFUSED rather than sent from the sandbox sender (poor deliverability). Set EMAIL_FROM to a verified Resend domain sender, e.g. \"ResumeDoctor <noreply@resumedoctor.in>\"."
    );
  }
}

type SendResult = { ok: true; data: unknown } | { ok: false; error: unknown };

/**
 * Single chokepoint for all outbound mail. Centralising it lets us:
 *  - refuse to use the Resend sandbox sender in production (deliverability)
 *  - always attach a plain-text alt (deliverability)
 *  - always set replyTo and optional List-Unsubscribe headers (deliverability)
 *  - log a single, structured error line per failure for Vercel logs
 */
async function send(
  args: {
    to: string;
    subject: string;
    html: string;
    text: string;
    headers?: Record<string, string>;
    purpose: string;
  }
): Promise<SendResult> {
  if (!resend) {
    console.error(`[email] ${args.purpose}: Resend client is not configured (RESEND_API_KEY missing).`);
    return { ok: false, error: "Email not configured" };
  }
  if (isProd && (fromEmail === SANDBOX_FROM || !process.env.EMAIL_FROM)) {
    console.error(
      `[email] ${args.purpose}: refusing to send in production from sandbox sender. Set EMAIL_FROM to a verified domain sender.`
    );
    return { ok: false, error: "Email sender not configured for production" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: args.to,
      replyTo,
      subject: args.subject,
      html: args.html,
      text: args.text,
      headers: args.headers,
    });
    if (error) {
      console.error(`[email] ${args.purpose} send failed:`, error);
      return { ok: false, error };
    }
    return { ok: true, data };
  } catch (err) {
    console.error(`[email] ${args.purpose} threw:`, err);
    return { ok: false, error: err };
  }
}

export async function sendVerificationEmail(email: string, verifyLink: string): Promise<SendResult> {
  return send({
    purpose: "verification",
    to: email,
    subject: `Verify your email – ${appName}`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #1e293b; font-size: 20px;">Verify your email</h2>
        <p>Thanks for creating a ${appName} account. Click the button below to verify your email address — you need to do this before you can sign in with your password.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Verify email</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">Or copy and paste this link into your browser:<br/><span style="word-break: break-all;">${verifyLink}</span></p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
    text: [
      `Verify your email — ${appName}`,
      "",
      `Thanks for creating a ${appName} account. Open the link below to verify your email address — you need to do this before you can sign in with your password.`,
      "",
      verifyLink,
      "",
      "This link expires in 24 hours. If you didn't create an account, you can ignore this email.",
    ].join("\n"),
  });
}

export async function sendOtpEmail(email: string, otp: string): Promise<SendResult> {
  return send({
    purpose: "trial-otp",
    to: email,
    subject: `${otp} is your ${appName} verification code`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #1e293b; font-size: 20px;">Your verification code</h2>
        <p>Use this code to start your free ${appName} trial:</p>
        <p style="margin: 24px 0; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #0d65d9;">${otp}</p>
        <p style="color: #64748b; font-size: 14px;">This code expires in 10 minutes.</p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
    text: [
      `Your ${appName} verification code`,
      "",
      `Use this code to start your free ${appName} trial:`,
      "",
      otp,
      "",
      "This code expires in 10 minutes. If you didn't request this, ignore this email.",
    ].join("\n"),
  });
}

export async function sendEmailChangeVerification(
  newEmail: string,
  verifyLink: string,
  currentEmail: string
): Promise<SendResult> {
  return send({
    purpose: "email-change",
    to: newEmail,
    subject: `Confirm your new email – ${appName}`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #1e293b; font-size: 20px;">Confirm your new email</h2>
        <p>You requested to change your ${appName} account email from <strong>${currentEmail}</strong> to this address.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Confirm new email</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">Or copy this link into your browser:<br/><span style="word-break: break-all;">${verifyLink}</span></p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link expires in 1 hour. If you didn't request this change, you can ignore this email.</p>
      </div>
    `,
    text: [
      `Confirm your new email — ${appName}`,
      "",
      `You requested to change your ${appName} account email from ${currentEmail} to this address.`,
      "",
      verifyLink,
      "",
      "This link expires in 1 hour. If you didn't request this change, ignore this email.",
    ].join("\n"),
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<SendResult> {
  return send({
    purpose: "password-reset",
    to: email,
    subject: `Reset your password – ${appName}`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #1e293b; font-size: 20px;">Reset your password</h2>
        <p>You requested a password reset for your ${appName} account. Click the button below to set a new password.</p>
        <p style="margin: 24px 0;">
          <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset password</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">Or copy this link into your browser:<br/><span style="word-break: break-all;">${resetLink}</span></p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link expires in 1 hour. If you didn't request a reset, you can ignore this email.</p>
      </div>
    `,
    text: [
      `Reset your password — ${appName}`,
      "",
      "You requested a password reset for your ResumeDoctor account. Open the link below to set a new password.",
      "",
      resetLink,
      "",
      "This link expires in 1 hour. If you didn't request a reset, ignore this email.",
    ].join("\n"),
  });
}

/** Test email – Resend "Hello World" style. Use for local testing only. */
export async function sendTestEmail(to: string): Promise<SendResult> {
  return send({
    purpose: "test",
    to,
    subject: "Hello from ResumeDoctor",
    html: "<p>Congrats on sending your <strong>first email</strong> with Resend!</p>",
    text: "Congrats on sending your first email with Resend!",
  });
}

/**
 * Pro trial expiry reminder (cron). This email is marketing-adjacent (a
 * renewal nudge), so we attach a List-Unsubscribe header per RFC 8058 / Gmail
 * bulk-sender guidance to keep it out of spam.
 */
export async function sendProTrialExpiryReminder(
  email: string,
  opts: { daysLeft: number; renewUrl: string }
): Promise<SendResult> {
  const { daysLeft, renewUrl } = opts;
  const subject =
    daysLeft <= 1
      ? `Your Pro trial ends tomorrow – ${appName}`
      : `Your Pro trial ends in ${daysLeft} days – ${appName}`;

  return send({
    purpose: "trial-reminder",
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #1e293b; font-size: 20px;">Your Pro trial is ending soon</h2>
        <p>You still have full access to PDF & Word export, ATS checks, and extra AI for about <strong>${daysLeft}</strong> day${daysLeft === 1 ? "" : "s"}.</p>
        <p style="margin: 24px 0;">
          <a href="${renewUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Renew or upgrade</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">If you already upgraded, you can ignore this email.</p>
      </div>
    `,
    text: [
      `Your ${appName} Pro trial is ending soon`,
      "",
      `You still have full access to PDF & Word export, ATS checks, and extra AI for about ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
      "",
      `Renew or upgrade: ${renewUrl}`,
      "",
      "If you already upgraded, you can ignore this email.",
    ].join("\n"),
    headers: {
      "List-Unsubscribe": `<mailto:${replyTo}?subject=unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}
