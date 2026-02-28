# ResumeDoctor – Deployment Requirements & Live Production Checklist (resumedoctor.in)

**Last Updated:** 2026-02-27  
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
| **Email** | Transactional (verify, reset) | Resend, SendGrid, SES |
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

# Email
RESEND_API_KEY=re_...

# Monitoring
SENTRY_DSN=
```

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
| 5 | **Transactional email** – verification & password reset sent via Resend/SendGrid (see `docs/LAUNCH-TODO.md`) | ☐ |

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
