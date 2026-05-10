# ResumeDoctor – Deployment Requirements & Live Production Checklist (resumedoctor.in)

**Last Updated:** 2026-05-10  
**Target:** Vercel + Supabase/Neon (recommended) or AWS/GCP

---

## 1. Infrastructure Requirements

### 1.1 Hosting Platform Options

| Option | Pros | Cons | Cost (est.) |
|--------|------|------|-------------|
| **Vercel** | Zero-config Next.js, edge, preview deploys | Vendor lock-in, cold starts | Free → $20/mo |
| **AWS (Amplify + RDS)** | Full control, scalable | More setup | $50–200/mo |
| **Railway / Render** | Simple, Docker support | Less edge | $5–50/mo |

**Recommended:** Vercel (frontend + API) + Supabase (PostgreSQL + Auth optional) or Neon (PostgreSQL).

### 1.2 Required Services

| Service | Purpose | Provider Options |
|---------|---------|------------------|
| **App Hosting** | Next.js SSR + API | Vercel, Netlify, AWS Amplify |
| **Database** | PostgreSQL | Supabase, Neon, RDS, PlanetScale (if MySQL) |
| **File Storage** | PDFs, avatars, exports | S3, Cloudflare R2, Supabase Storage |
| **CDN** | Static assets, templates | Vercel Edge, Cloudflare |
| **Email** | Transactional (verify, reset) | ZeptoMail (in-app), SendGrid, SES |
| **Auth** | OAuth + sessions | NextAuth + DB, Supabase Auth, Clerk |
| **Payments** | QR/UPI (manual) | - |
| **AI** | LLM API | OpenAI, Anthropic |
| **Monitoring** | Errors, uptime | Sentry, Vercel Analytics |
| **Redis** (optional) | Caching, rate limit | Upstash, Redis Cloud |

---

## 2. Environment Variables (Production)

All values must be set in the hosting platform (Vercel → Settings → Environment Variables).

```bash
# ===========================================
# PRODUCTION – DO NOT COMMIT
# ===========================================

# App
NEXT_PUBLIC_APP_URL=https://resumedoctor.in

# Database (use connection pooler for serverless)
DATABASE_URL="postgresql://user:pass@host:5432/resumedoctor?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/resumedoctor"

# Auth
NEXTAUTH_URL=https://resumedoctor.in
NEXTAUTH_SECRET=<strong-random-32-byte-secret>

# OAuth (production credentials)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# AI
OPENAI_API_KEY=sk-...

# Redis (production)
REDIS_URL=rediss://...

# File Storage (S3/R2)
S3_BUCKET=resumedoctor-prod
S3_REGION=ap-south-1
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Email (ZeptoMail — required for verification, OTP, password reset)
ZEPTOMAIL_SEND_TOKEN=
# MUST set sender on a ZeptoMail-verified domain (see §2.1). Without EMAIL_FROM, sends are refused in production.
EMAIL_FROM="ResumeDoctor <noreply@resumedoctor.in>"
# Optional: replies route here (defaults in code to support@resumedoctor.in if unset)
EMAIL_REPLY_TO=support@resumedoctor.in

# Monitoring
SENTRY_DSN=
```

### 2.1 Production transactional email (ZeptoMail + Vercel) — WBS 13.10–13.16

Transactional mail goes through [`src/lib/email.ts`](../src/lib/email.ts) using **ZeptoMail** (`POST https://api.zeptomail.com/v1.1/email`, header `Authorization: Zoho-enczapikey <token>`). Copy **`ZEPTOMAIL_SEND_TOKEN`** from **ZeptoMail → Agent → SMTP/API → API → Send Mail Token**. In **production**, if `EMAIL_FROM` is missing, sends are **refused**.

Execute in order; gates block the next step until complete.

| WBS ID | Task | Owner | Gate |
|--------|------|-------|------|
| **13.10** | **ZeptoMail:** **Associate Domains** for **resumedoctor.in** on your Agent. Copy DKIM TXT + bounce **CNAME** from ZeptoMail. | DevOps | DNS record names/values visible |
| **13.11** | **Registrar DNS:** Add records exactly as ZeptoMail shows. **ZeptoMail:** **Verify DNS records** until domain is **not** Pending. | DevOps | Domain verified / authenticated |
| **13.12** | **Vercel:** **Production:** `ZEPTOMAIL_SEND_TOKEN`, `EMAIL_FROM` (sender @ verified domain). Optional `EMAIL_REPLY_TO`. Remove **`BREVO_API_KEY`** / **`RESEND_API_KEY`** if obsolete. | DevOps | Variables saved |
| **13.13** | **Redeploy** (Deployments → Redeploy, or push to `main`). | DevOps | Deployment **Ready** |
| **13.14** | **Smoke test (admin):** `POST .../api/health/email` with admin session. Expect `{ "ok": true }`. | Backend/DevOps | 200 + inbox |
| **13.15** | **E2E:** Trial OTP (`/try`), signup — ZeptoMail activity + inbox. | QA | OK |
| **13.16** | **Optional:** Rotate flagged OAuth secrets; tidy unused tokens in ZeptoMail. | DevOps | — |

**Export failures (audits):** ZeptoMail → **Email Activity** / logs → filter by recipient or status. Not stored in-app.

### 2.2 SuperProfile (India checkout + webhook)

Set these in **Vercel → Environment Variables** (Production). Values are the **public customer checkout URLs** from each SuperProfile Payment Page (**Copy link** in the editor preview). They are **not** the same as the dashboard editor URL (`/create-payment-page/...`).

| Variable | Maps to `productKey` in webhook |
|----------|--------------------------------|
| `NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY` | `pro_monthly` |
| `NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL` | `pro_annual` |
| `NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14` | `pro_trial_14` |
| `NEXT_PUBLIC_SUPERPROFILE_URL_RESUME_PACK` | `resume_pack` |

Also set **`SUPERPROFILE_WEBHOOK_SECRET`** (long random string). The app accepts `Authorization: Bearer <secret>` or `X-Superprofile-Webhook-Secret: <secret>` on `POST /api/webhooks/superprofile`.

**Fulfillment endpoint (production — use this exact host):** `https://www.resumedoctor.in/api/webhooks/superprofile`

**Important:** `https://resumedoctor.in/...` (no `www`) responds with **308** to `www`. Many webhook clients **do not follow redirects for POST** or may drop the JSON body. Point Zapier / Make / SuperProfile automation at the **`www`** URL above — do **not** rely on `${NEXT_PUBLIC_APP_URL}` if that variable is set to the apex domain.

**Automation payload (JSON):** `idempotencyKey` (unique per payment), `email` (must match a ResumeDoctor user), `productKey` one of `pro_monthly` | `pro_annual` | `pro_trial_14` | `resume_pack`. For `resume_pack` only, include optional `credits` (1–100; default 5).

**Database:** Apply migration `prisma/migrations/20260411140000_superprofile_purchase_events` on production (`pnpm prisma migrate deploy` against prod `DATABASE_URL`).

**SuperProfile editor URLs (internal reference; IDs are account-specific):** Page Details editor: `https://superprofile.bio/create-payment-page/<PAGE_ID>?productType=1` — e.g. Pro Monthly `69db33e8da78960013e814b3`, Pro Annual `69dca13af2e2e30013365462`, 14-day trial `69e5cabddd64680013de4395`, Resume Pack `69e5caf05275a70013fc8928`.

---

## 3. Pre-Deployment Checklist

### 3.1 Code & Config

| # | Item | Status |
|---|------|--------|
| 1 | Remove `console.log` in critical paths | ☐ |
| 2 | Set `NODE_ENV=production` | ☐ |
| 3 | Disable debug / dev-only routes | ☐ |
| 4 | Verify API routes have auth checks | ☐ |
| 5 | Run `pnpm build` successfully | ☐ |
| 6 | Run `pnpm lint` with no errors | ☐ |
| 7 | All secrets in env vars, none in code | ☐ |
| 8 | CORS configured for production domain | ☐ |
| 9 | Rate limiting on public API routes | ☐ |
| 10 | CSRF protection on forms | ☐ |

### 3.2 Database

| # | Item | Status |
|---|------|--------|
| 1 | Migrations run on prod DB | ☐ |
| 2 | Connection pooling enabled | ☐ |
| 3 | Backup schedule configured | ☐ |
| 4 | Indexes on frequently queried columns | ☐ |
| 5 | No sensitive data in logs | ☐ |

### 3.3 Security

| # | Item | Status |
|---|------|--------|
| 1 | HTTPS enforced | ☐ |
| 2 | Security headers (CSP, HSTS, X-Frame) | ☐ |
| 3 | Input validation on all API routes | ☐ |
| 4 | File upload type/size restrictions | ☐ |
| 5 | Admin routes protected by role | ☐ |

### 3.4 Third-Party

| # | Item | Status |
|---|------|--------|
| 1 | OAuth redirect URIs updated for prod | ☐ |
| 2 | OpenAI usage limits set | ☐ |
| 3 | Email domain verified (DKIM, SPF) | ☐ |
| 4 | Sentry project for prod | ☐ |
| 5 | **Transactional email** – verification & password reset via ZeptoMail (see `docs/LAUNCH-TODO.md`) | ☐ |

### 3.5 Domain & DNS

| # | Item | Status |
|---|------|--------|
| 1 | Domain purchased (resumedoctor.in) | ☐ |
| 2 | DNS A/CNAME records pointed | ☐ |
| 3 | SSL certificate active | ☐ |
| 4 | www → apex or apex → www redirect | ☐ |

---

## 4. Deployment Steps (Vercel)

### 4.1 Initial Setup

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Set env vars (or via Dashboard)
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... repeat for all

# 4. Deploy
vercel --prod
```

### 4.2 GitHub Integration (Recommended)

1. Connect repo to Vercel
2. Set **Production Branch** (e.g. `main`)
3. Add env vars in Vercel Dashboard (Production, Preview, Development)
4. Enable **Automatic Deployments** on push
5. Configure **Preview Deployments** for PRs

### 4.3 Database (Supabase/Neon)

1. Create project
2. Copy connection string (use **Transaction** pooler for serverless)
3. Run migrations: `pnpm prisma migrate deploy`
4. (Optional) Seed initial data

---

## 5. Post-Deployment Verification

| # | Check | Command / Action |
|---|-------|------------------|
| 1 | Homepage loads | `curl -I https://resumedoctor.in` |
| 2 | Auth flow works | Sign up, sign in, sign out |
| 3 | Resume create/save | Create resume, edit, save |
| 4 | PDF export | Export resume as PDF |
| 5 | Error tracking | Trigger error, verify Sentry |
| 6 | Uptime monitor | Configure Pingdom/UptimeRobot |
| 7 | Transactional email | §2.1 gates **13.14–13.15** (health email + trial OTP / verify) |

---

## 6. Rollback Procedure

1. **Vercel:** Dashboard → Deployments → ... → Promote to Production (previous deploy)
2. **DB:** Restore from backup if migration was faulty
3. **Env:** Revert env var changes if needed
4. **Document:** Log incident and root cause

---

## 7. Scaling Considerations (Future)

| Component | Scale Trigger | Action |
|-----------|---------------|--------|
| DB | >10k users, slow queries | Read replicas, query optimization |
| API | High latency | Edge functions, caching |
| PDF export | Queue backlog | Background workers (BullMQ) |
| File storage | Large files | CDN, multipart upload |
| AI | Cost spike | Caching, rate limits, model swap |

---

## 8. Compliance & Data (India)

| # | Requirement | Action |
|---|-------------|--------|
| 1 | Data localisation | Store DB in ap-south-1 (Mumbai) |
| 2 | Privacy policy | Publish and link in footer |
| 3 | Terms of service | Publish and require consent |
| 4 | Data retention | Define and document retention policy |
| 5 | User data export | Implement "Download my data" |
| 6 | Account deletion | Implement "Delete account" |

---

*See [PRD-ROLE-BASED.md](./PRD-ROLE-BASED.md) for agent task assignments.*
