// LAUNCH-TODO – Transactional email via Resend
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.EMAIL_FROM || "ResumeDoctor <onboarding@resend.dev>";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "ResumeDoctor";

export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendVerificationEmail(email: string, verifyLink: string) {
  if (!resend) return { ok: false, error: "Email not configured" };

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `Verify your email – ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Verify your email</h2>
        <p>Thanks for signing up for ${appName}. Click the button below to verify your email address.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Verify Email</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">Or copy this link: <a href="${verifyLink}">${verifyLink}</a></p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  });

  return error ? { ok: false, error } : { ok: true, data };
}

export async function sendOtpEmail(email: string, otp: string) {
  if (!resend) return { ok: false, error: "Email not configured" };

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `Your verification code – ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Your verification code</h2>
        <p>Use this code to start your free resume trial:</p>
        <p style="margin: 24px 0; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #0d65d9;">${otp}</p>
        <p style="color: #64748b; font-size: 14px;">This code expires in 10 minutes.</p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });

  return error ? { ok: false, error } : { ok: true, data };
}

export async function sendEmailChangeVerification(newEmail: string, verifyLink: string, currentEmail: string) {
  if (!resend) return { ok: false, error: "Email not configured" };

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: newEmail,
    subject: `Confirm your new email – ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Confirm your new email</h2>
        <p>You requested to change your ${appName} account email from <strong>${currentEmail}</strong> to this address.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Confirm New Email</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">Or copy this link: <a href="${verifyLink}">${verifyLink}</a></p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link expires in 1 hour. If you didn't request this change, you can ignore this email.</p>
      </div>
    `,
  });

  return error ? { ok: false, error } : { ok: true, data };
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  if (!resend) return { ok: false, error: "Email not configured" };

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `Reset your password – ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Reset your password</h2>
        <p>You requested a password reset for your ${appName} account. Click the button below to set a new password.</p>
        <p style="margin: 24px 0;">
          <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link expires in 1 hour. If you didn't request a reset, you can ignore this email.</p>
      </div>
    `,
  });

  return error ? { ok: false, error } : { ok: true, data };
}

/** Test email – Resend "Hello World" style. Use for local testing only. */
export async function sendTestEmail(to: string) {
  if (!resend) return { ok: false, error: "Email not configured" };

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: "Hello from ResumeDoctor",
    html: "<p>Congrats on sending your <strong>first email</strong> with Resend!</p>",
  });

  return error ? { ok: false, error } : { ok: true, data };
}

/** Pro trial (e.g. ₹49 on SuperProfile) – reminder before subscriptionExpiresAt (cron + Resend) */
export async function sendProTrialExpiryReminder(
  email: string,
  opts: { daysLeft: number; renewUrl: string }
) {
  if (!resend) return { ok: false, error: "Email not configured" };

  const { daysLeft, renewUrl } = opts;
  const subject =
    daysLeft <= 1
      ? `Your Pro trial ends tomorrow – ${appName}`
      : `Your Pro trial ends in ${daysLeft} days – ${appName}`;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Your Pro trial is ending soon</h2>
        <p>You still have full access to PDF & Word export, ATS checks, and extra AI for about <strong>${daysLeft}</strong> day${daysLeft === 1 ? "" : "s"}.</p>
        <p style="margin: 24px 0;">
          <a href="${renewUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Renew or upgrade</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">If you already upgraded, you can ignore this email.</p>
      </div>
    `,
  });

  return error ? { ok: false, error } : { ok: true, data };
}
