#!/usr/bin/env node
/**
 * Test Resend – sends a "Hello World" email.
 * Run: node --env-file=.env.local scripts/test-resend.mjs
 * Or:  npx dotenv -e .env.local -- node scripts/test-resend.mjs
 *
 * Replace harikrishnanhk1988@gmail.com with your email in the script or pass as arg.
 */
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("Missing RESEND_API_KEY. Add it to .env.local and run:");
  console.error("  node --env-file=.env.local scripts/test-resend.mjs");
  process.exit(1);
}

const to = process.argv[2] || "harikrishnanhk1988@gmail.com";
const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from: "ResumeDoctor <onboarding@resend.dev>",
  to,
  subject: "Hello from ResumeDoctor",
  html: "<p>Congrats on sending your <strong>first email</strong> with Resend!</p>",
});

if (error) {
  console.error("Failed:", error);
  process.exit(1);
}
console.log("Sent! ID:", data?.id);
