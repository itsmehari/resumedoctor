# ResumeDoctor – Pre-Launch Checklist (resumedoctor.in)

**Legend:** ✅ Done in code · ⚙️ Ops/config only (no code needed) · ❌ Not done

---

## 1. Auth & Email ✅

| Item | Status | File / Notes |
|------|--------|--------------|
| Email verification on signup | ✅ | `src/lib/email.ts` + signup route |
| Password reset flow | ✅ | `/api/auth/forgot-password` |
| Google OAuth | ✅ | NextAuth + `GOOGLE_CLIENT_ID/SECRET` |
| LinkedIn OAuth | ✅ | NextAuth + `LINKEDIN_CLIENT_ID/SECRET` |
| 2FA (TOTP) | ✅ | `/api/user/2fa/*` routes |
| Protected routes middleware | ✅ | `src/middleware.ts` |
| Admin role protection | ✅ | `src/lib/admin-auth.ts` |
| ZeptoMail domain + sender for `resumedoctor.in` | ⚙️ | ZeptoMail → Associate Domains → verify DNS; Vercel: `ZEPTOMAIL_SEND_TOKEN`, `EMAIL_FROM` |

---

## 2. Legal & Compliance ✅

| Item | Status | File / Notes |
|------|--------|--------------|
| Privacy policy page (`/privacy`) | ✅ | `src/app/privacy/page.tsx` |
| Terms of service page (`/terms`) | ✅ | `src/app/terms/page.tsx` |
| Data retention policy | ✅ | `/privacy` §4 — full table + DPDPA reference |
| Download my data | ✅ | Settings → Data & Privacy → `/api/user/export-data` |
| Delete account | ✅ | Settings → Data & Privacy → `/api/user/delete-account` |
| Cookie/consent banner | ✅ | `src/components/consent-banner.tsx` |
| DPDPA compliance note in Privacy | ✅ | `privacy@resumedoctor.in` email + 30-day response commitment |

---

## 3. Security ✅

| Item | Status | File / Notes |
|------|--------|--------------|
| Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type, Referrer-Policy, Permissions-Policy) | ✅ | `next.config.js` `headers()` |
| `/dev/*` route blocked in production | ✅ | `next.config.js` `redirects()` |
| Input validation (Zod) on all API routes | ✅ | All routes use `z.safeParse()` |
| Passwords hashed (bcrypt) | ✅ | `src/lib/auth.ts` |
| Admin routes role-checked | ✅ | `src/lib/admin-auth.ts` |
| File upload type + size restriction | ✅ | `src/app/api/user/avatar/upload` |
| AI rate limiting per user tier | ✅ | `src/lib/ai-rate-limit.ts` |
| HTTPS enforced | ⚙️ | Automatic on Vercel; verify after domain hookup |

---

## 4. Monitoring & DevOps ✅

| Item | Status | File / Notes |
|------|--------|--------------|
| Sentry error tracking (code ready) | ✅ | `sentry.*.config.ts`, `next.config.js` |
| Sentry DSN added to Vercel env vars | ⚙️ | Add `NEXT_PUBLIC_SENTRY_DSN` + `SENTRY_AUTH_TOKEN` at sentry.io |
| Health check endpoint | ✅ | `GET /api/health` — returns `200 ok` or `503 degraded` |
| Vercel cron uptime check (every 5 min) | ✅ | `vercel.json` cron on `/api/health` |
| GitHub Actions uptime monitor (every 5 min) | ✅ | `.github/workflows/uptime-monitor.yml` — opens/closes GH issues |
| Slack alerts on downtime | ⚙️ | Add `SLACK_WEBHOOK_URL` GitHub Actions secret (optional) |
| Automated daily DB backup | ✅ | `.github/workflows/db-backup.yml` — pg_dump → S3/R2, 30-day retention |
| S3/R2 bucket for backups | ⚙️ | Create bucket; add `BACKUP_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` GitHub secrets |
| External uptime monitor (optional extra layer) | ⚙️ | Point UptimeRobot / Better Uptime at `https://resumedoctor.in/api/health` |
| CI/CD pipeline (lint + build + Sentry release) | ✅ | `.github/workflows/ci.yml` |

---

## 5. Infrastructure (Ops only) ⚙️

All items below are **configuration tasks** — no code changes needed.

| Item | Status | Action |
|------|--------|--------|
| Vercel project linked to GitHub repo | ⚙️ | vercel.com → New Project → Import repo |
| Production branch set to `main` | ⚙️ | Vercel → Settings → Git → Production Branch |
| **Environment variables set in Vercel** | ⚙️ | See table below |
| Database provisioned (Neon / Supabase) | ⚙️ | neon.tech or supabase.com → New project |
| DB migrations deployed | ⚙️ | `npx prisma migrate deploy` (run once on prod DB) |
| DB connection pooling enabled | ⚙️ | Use Neon pooler URL (`?pgbouncer=true`) as `DATABASE_URL` |
| Domain `resumedoctor.in` pointed to Vercel | ⚙️ | Vercel → Domains → Add → update DNS A/CNAME at registrar |
| SSL certificate | ⚙️ | Auto-provisioned by Vercel after domain is connected |
| `www` → apex redirect | ⚙️ | Vercel handles this automatically |
| Google OAuth redirect URI for prod | ⚙️ | console.cloud.google.com → OAuth → add `https://resumedoctor.in/api/auth/callback/google` |
| LinkedIn OAuth redirect URI for prod | ⚙️ | linkedin.com/developers → app → Auth → add `https://resumedoctor.in/api/auth/callback/linkedin` |
| OpenAI / Groq usage limits set | ⚙️ | Set monthly budget cap in OpenAI/Groq dashboard |

### Required Vercel Environment Variables

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon/Supabase → Connection string (pooled) |
| `DIRECT_URL` | Neon/Supabase → Direct connection string |
| `NEXTAUTH_URL` | `https://resumedoctor.in` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console |
| `LINKEDIN_CLIENT_ID` | LinkedIn Developers |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn Developers |
| `GROQ_API_KEY` | console.groq.com |
| `ZEPTOMAIL_SEND_TOKEN` | ZeptoMail → Agent → SMTP/API → Send Mail Token |
| `NEXT_PUBLIC_APP_URL` | `https://resumedoctor.in` |
| `NEXT_PUBLIC_SENTRY_DSN` | sentry.io → Project → DSN |
| `SENTRY_AUTH_TOKEN` | sentry.io → Settings → Auth Tokens |
| `SENTRY_ORG` | Your Sentry org slug |
| `SENTRY_PROJECT` | Your Sentry project slug |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics (optional) |
| `VERCEL_BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Blob (optional, for avatar uploads) |

---

## 6. Post-Deploy Smoke Tests ✅ (checklist to run after go-live)

| # | Check | How |
|---|-------|-----|
| 1 | Homepage loads | `curl -I https://resumedoctor.in` → 200 |
| 2 | Health endpoint green | `curl https://resumedoctor.in/api/health` → `"status":"ok"` |
| 3 | Security headers present | securityheaders.com → scan `resumedoctor.in` |
| 4 | Sign up + email verification | Create account, check inbox |
| 5 | Google OAuth | Sign in with Google |
| 6 | Create & save resume | Dashboard → New Resume → Edit → save |
| 7 | PDF export | Export → confirm file downloads |
| 8 | ATS checker (Pro user) | Upgrade trial → check ATS panel |
| 9 | AI improve bullet | Edit experience → Sparkles button |
| 10 | Cover letter create | Cover Letters → New → generate with AI |
| 11 | Job board | /jobs → browse, save a job |
| 12 | Admin dashboard | /admin → stats load |
| 13 | Sentry captures errors | Trigger a 404 → verify Sentry receives event |
| 14 | `/dev/*` blocked | `curl https://resumedoctor.in/dev/preview` → redirects to `/` |

---

*Last updated: 2026-03-05*
