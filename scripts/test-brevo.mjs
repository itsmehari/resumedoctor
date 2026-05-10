#!/usr/bin/env node
/**
 * Send a test transactional email via Brevo API.
 * Run: pnpm test:email
 * Or:  node --env-file=.env.local scripts/test-brevo.mjs you@example.com
 *
 * Requires BREVO_API_KEY and EMAIL_FROM (a sender verified in Brevo).
 */
const apiKey = process.env.BREVO_API_KEY?.trim();
const fromRaw = process.env.EMAIL_FROM?.trim();
const to = process.argv[2] || "harikrishnanhk1988@gmail.com";

if (!apiKey) {
  console.error("Missing BREVO_API_KEY. Add it to .env.local (see .env.example).");
  process.exit(1);
}
if (!fromRaw) {
  console.error("Missing EMAIL_FROM. Set to a Brevo-verified sender, e.g.:");
  console.error('  EMAIL_FROM="ResumeDoctor <noreply@yourdomain.com>"');
  process.exit(1);
}

function parseFrom(from) {
  const m = from.match(/^\s*(.+?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1].replace(/^["']|["']$/g, "").trim(), email: m[2].trim() };
  return { email: from.trim() };
}

const sender = parseFrom(fromRaw);
const body = {
  sender: { name: sender.name || "ResumeDoctor", email: sender.email },
  to: [{ email: to }],
  subject: "Hello from ResumeDoctor (Brevo test)",
  htmlContent: "<p>Brevo transactional test from <strong>ResumeDoctor</strong>.</p>",
  textContent: "Brevo transactional test from ResumeDoctor.",
};

const r = await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",
  headers: {
    "api-key": apiKey,
    "Content-Type": "application/json",
    accept: "application/json",
  },
  body: JSON.stringify(body),
});

const data = await r.json().catch(() => ({}));
if (!r.ok) {
  console.error("Failed:", r.status, data);
  process.exit(1);
}
console.log("Sent OK:", data);
