// Transactional email via ZeptoMail (Zoho) REST API. Used for signup verification,
// trial OTP, password reset, email-change confirmation, and Pro trial reminders.
//
// Docs: https://www.zoho.com/zeptomail/help/api/email-sending.html
//
// Deliverability:
//  - htmlbody + textbody when both supported
//  - reply_to set
//  - mime_headers for List-Unsubscribe on trial reminder (RFC 8058)
//  - Production refuses sends without EMAIL_FROM (sender must use a verified domain in ZeptoMail)

const ZEPTOMAIL_API = "https://api.zeptomail.com/v1.1/email";

function zeptoSendToken(): string | null {
  const t =
    process.env.ZEPTOMAIL_SEND_TOKEN?.trim() ||
    process.env.ZEPTOMAIL_TOKEN?.trim() ||
    process.env.ZEPTOMAIL_API_KEY?.trim();
  return t || null;
}

const sendToken = zeptoSendToken();
const replyTo = process.env.EMAIL_REPLY_TO || "support@resumedoctor.in";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "ResumeDoctor";
const isProd = process.env.NODE_ENV === "production";
/** Avoid noisy duplicate warnings during `next build` static analysis. */
const isNextProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

/** `true` when a ZeptoMail Send Mail token is present (sends can be attempted). */
export const emailProviderConfigured = Boolean(sendToken);

if (isProd && !isNextProductionBuild) {
  if (!sendToken) {
    console.warn(
      "[email] ZEPTOMAIL_SEND_TOKEN (or ZEPTOMAIL_API_KEY) is not set in production. Verification, OTP, and password-reset emails will all fail. Set it in Vercel → Settings → Environment Variables."
    );
  }
  if (!process.env.EMAIL_FROM) {
    console.warn(
      "[email] EMAIL_FROM is not set in production. Transactional emails will be refused. Set EMAIL_FROM to a ZeptoMail-verified sender, e.g. \"ResumeDoctor <noreply@resumedoctor.in>\"."
    );
  }
}

type SendResult = { ok: true; data: unknown } | { ok: false; error: unknown };

function parseFromHeader(from: string): { name?: string; email: string } {
  const m = from.match(/^\s*(.+?)\s*<([^>]+)>\s*$/);
  if (m) {
    const name = m[1].replace(/^["']|["']$/g, "").trim();
    return { name: name || undefined, email: m[2].trim() };
  }
  return { email: from.trim() };
}

function recipientDisplayName(email: string): string {
  const local = email.split("@")[0] ?? "";
  return local.replace(/[._-]+/g, " ").trim() || "there";
}

/**
 * Single chokepoint for all outbound mail.
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
  if (!sendToken) {
    console.error(
      `[email] ${args.purpose}: ZeptoMail is not configured (set ZEPTOMAIL_SEND_TOKEN from Agents → SMTP/API → Send Mail Token).`
    );
    return { ok: false, error: "Email not configured" };
  }

  const fromRaw = process.env.EMAIL_FROM || "";
  if (isProd && !fromRaw.trim()) {
    console.error(
      `[email] ${args.purpose}: refusing to send in production without EMAIL_FROM. Set EMAIL_FROM to a ZeptoMail-verified sender.`
    );
    return { ok: false, error: "Email sender not configured for production" };
  }
  if (!fromRaw.trim()) {
    console.error(
      `[email] ${args.purpose}: set EMAIL_FROM to a ZeptoMail-verified sender (e.g. ResumeDoctor <noreply@yourdomain.com>).`
    );
    return { ok: false, error: "EMAIL_FROM is not set" };
  }

  const sender = parseFromHeader(fromRaw);
  if (!sender.email) {
    return { ok: false, error: "Invalid EMAIL_FROM" };
  }

  const payload: Record<string, unknown> = {
    from: {
      address: sender.email,
      name: sender.name || appName,
    },
    to: [
      {
        email_address: {
          address: args.to,
          name: recipientDisplayName(args.to),
        },
      },
    ],
    reply_to: [{ address: replyTo, name: appName }],
    subject: args.subject,
    htmlbody: args.html,
    textbody: args.text,
    track_clicks: false,
    track_opens: false,
  };

  if (args.headers && Object.keys(args.headers).length > 0) {
    payload.mime_headers = args.headers;
  }

  try {
    const r = await fetch(ZEPTOMAIL_API, {
      method: "POST",
      headers: {
        Authorization: `Zoho-enczapikey ${sendToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await r.json().catch(() => ({}))) as Record<string, unknown>;

    if (!r.ok) {
      console.error(`[email] ${args.purpose} send failed:`, r.status, data);
      return { ok: false, error: data };
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

/** Admin smoke test — sends a short transactional message via ZeptoMail. */
export async function sendTestEmail(to: string): Promise<SendResult> {
  return send({
    purpose: "test",
    to,
    subject: "Hello from ResumeDoctor",
    html: "<p>This is a <strong>test email</strong> from ResumeDoctor (ZeptoMail).</p>",
    text: "This is a test email from ResumeDoctor (ZeptoMail).",
  });
}

/**
 * Pro trial expiry reminder (cron). Marketing-adjacent — List-Unsubscribe header.
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
