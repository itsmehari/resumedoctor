#!/usr/bin/env node
/**
 * Smoke-test ZeptoMail transactional API (same path as production).
 * Run: npm run test:email
 */
const token =
  process.env.ZEPTOMAIL_SEND_TOKEN?.trim() ||
  process.env.ZEPTOMAIL_TOKEN?.trim() ||
  process.env.ZEPTOMAIL_API_KEY?.trim();
const fromRaw = process.env.EMAIL_FROM?.trim();
const to = process.argv[2] || "harikrishnanhk1988@gmail.com";

if (!token) {
  console.error("Missing ZEPTOMAIL_SEND_TOKEN (or ZEPTOMAIL_API_KEY). See .env.example.");
  process.exit(1);
}
if (!fromRaw) {
  console.error('Set EMAIL_FROM="ResumeDoctor <noreply@yourdomain.com>" (ZeptoMail-verified sender).');
  process.exit(1);
}

function parseFrom(from) {
  const m = from.match(/^\s*(.+?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1].replace(/^["']|["']$/g, "").trim(), email: m[2].trim() };
  return { email: from.trim(), name: "ResumeDoctor" };
}

const sender = parseFrom(fromRaw);

const r = await fetch("https://api.zeptomail.com/v1.1/email", {
  method: "POST",
  headers: {
    Authorization: `Zoho-enczapikey ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    from: { address: sender.email, name: sender.name || "ResumeDoctor" },
    to: [{ email_address: { address: to, name: to.split("@")[0] || "" } }],
    subject: "ZeptoMail test — ResumeDoctor",
    htmlbody: "<p><strong>ZeptoMail</strong> test from ResumeDoctor.</p>",
    textbody: "ZeptoMail test from ResumeDoctor.",
    track_clicks: false,
    track_opens: false,
  }),
});

const data = await r.json().catch(() => ({}));
if (!r.ok) {
  console.error("Failed:", r.status, data);
  process.exit(1);
}
console.log("OK:", data);
