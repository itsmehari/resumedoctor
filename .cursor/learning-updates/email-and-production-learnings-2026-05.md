# Learning updates — transactional email & production ops (ResumeDoctor)

**Context:** Series of agent sessions on ResumeDoctor (`resumedoctor.in`): moving off Resend sandbox failures, evaluating providers, implementing **Brevo** then **ZeptoMail**, wiring **Vercel** env, debugging **`/try`** OTP and **`/api/health`**.

---

## 1. Transactional email fundamentals

- **Sandbox vs production sender:** Using a provider’s test domain (e.g. Resend `onboarding@resend.dev`) only delivers to the account owner; real users get **403** / blocked sends until **DNS + verified domain + real `From`** are configured.
- **`EMAIL_FROM` is mandatory for our stack:** In production, `src/lib/email.ts` **refuses** sends without `EMAIL_FROM` so misconfiguration fails loudly instead of silent spam or broken UX.
- **“noreply” does not require a mailbox at the registrar:** For ESPs (ZeptoMail, Resend, SES), what matters is **domain verification** (DKIM/SPF/bounce records) in the **email provider**. You do **not** need to create `noreply@domain` in BigRock/cPanel **only** to send transactional mail; replies should use **`EMAIL_REPLY_TO`** (e.g. support@).

---

## 2. Provider-specific (ZeptoMail)

- **REST API vs SMTP:** ZeptoMail shows **SMTP** (`smtp.zeptomail.in`, user `emailapikey`) and **REST** (`POST …/v1.1/email`). This codebase uses the **REST API** + **`Authorization: Zoho-enczapikey <secret>`**, not Nodemailer/SMTP.
- **Send Mail token:** Copy from **Agent → SMTP/API → API tab** → store as **`ZEPTOMAIL_SEND_TOKEN`** (aliases accepted in code: `ZEPTOMAIL_TOKEN`, `ZEPTOMAIL_API_KEY`).
- **Authorization header:** Value must be **`Zoho-enczapikey`** + secret. If the UI copies **`Zoho-enczapikey …`** as one string, the app **normalizes** duplicate prefixes so pasting either form works.
- **Regional API host:** Indian dashboards often show **`api.zeptomail.in`**. Default code uses **`api.zeptomail.com`**; override with **`ZEPTOMAIL_API_URL`** (e.g. `https://api.zeptomail.in/v1.1/email`) if sends return **401** / wrong region.
- **IP blocking:** With **API IP allowlisting** enabled and **no** allowed IPs, **Vercel** (dynamic egress) will fail. Disable API IP restriction for serverless, or use a fixed-egress setup.
- **Senders UI:** There may be no separate “Senders” list; **`Domains`** under the **Mail Agent** shows **verified** domains. Once **`resumedoctor.in`** is verified for that agent, **`From:` `noreply@resumedoctor.in`** is typically valid without a separate mailbox row (unless the product enforces explicit sender lists).

---

## 3. Vercel & environment variables

- **Adding/updating env vars requires a redeploy** for serverless functions to see new values (or use **Redeploy** on the latest deployment).
- **`/api/health` must reflect mail readiness:** Initially only **`ZEPTOMAIL_*`** was checked; **`EMAIL_FROM`** was missing from health while still blocking sends. A follow-up change added **`checks.email_from`** so production shows **degraded** when `EMAIL_FROM` is absent.
- **Remove obsolete secrets** (`RESEND_API_KEY`, `BREVO_API_KEY`) after migrating providers to avoid confusion and accidental use.

---

## 4. Debugging checklist (OTP / verification fails)

1. **`GET /api/health`** — `zeptomail`, `email_from`, DB checks.
2. **Vercel logs** — search for **`trial-otp`**, **`OTP email failed`**, ZeptoMail JSON errors (token, From domain, credits).
3. **ZeptoMail dashboard** — **Sent** count > 0 after a test; **Subscription/credits** if tabs mention limits.
4. **Inbox** — Spam / Promotions for Gmail.

---

## 5. Database (Neon / Prisma) — orthogonal but blocking

- **`/try` uses Prisma** before sending email (sessions, OTP hash, rate limits). If **`checks.prisma`** fails (**Can’t reach database server**), the flow fails even when ZeptoMail env is correct.
- Typical causes: **Neon paused** (free tier), wrong **`DATABASE_URL`/`DIRECT_URL`**, network / allowlist. Fix DB **first** when health is **degraded** on `prisma`.

---

## 6. Local development & CI

- **OneDrive + `.next`:** Local `next build` can hit **ENOENT** during static export/write — sync locking. Prefer building on CI/Vercel or build outside synced folders if flaky.

---

## 7. Security / CSP

- **`connect-src`** in `next.config.js` must include the transactional API host (**`api.zeptomail.com`** and optionally **`api.zeptomail.in`**).

---

## 8. Files touched in this arc (reference)

| Area | Path |
|------|------|
| Mail chokepoint | `src/lib/email.ts` |
| OTP route | `src/app/api/auth/trial/send-otp/route.ts` |
| Health | `src/app/api/health/route.ts`, `src/app/api/health/email/route.ts` |
| CSP | `next.config.js` |
| Env template | `.env.example` |
| Smoke script | `scripts/test-zeptomail.mjs` |
| Ops docs | `docs/DEPLOYMENT-REQUIREMENTS.md`, `docs/DEPLOY-TO-LIVE.md`, `docs/LAUNCH-TODO.md` |

---

*Generated as institutional memory for Cursor agents and humans maintaining ResumeDoctor.*
