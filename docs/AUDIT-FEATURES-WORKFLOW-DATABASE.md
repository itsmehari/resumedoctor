# ResumeDoctor – Features, Workflow & Database Audit

**Date:** March 2025  
**Scope:** Features inventory, user workflows, database connectivity, API overview, issues & recommendations

---

## 1. Features Inventory

| Feature | Location | Notes |
|---------|----------|-------|
| **Auth – signup** | `src/app/signup/page.tsx`, `src/app/api/auth/signup/route.ts` | Email + password; email verification via Resend |
| **Auth – login** | `src/app/login/page.tsx`, `src/app/api/auth/[...nextauth]/route.ts` | Credentials + optional Google/LinkedIn OAuth |
| **Auth – forgot password** | `src/app/forgot-password/`, `src/app/api/auth/forgot-password/` | Token-based reset via Resend |
| **Auth – reset password** | `src/app/reset-password/`, `src/app/api/auth/reset-password/` | Token + new password |
| **Auth – email verification** | `src/app/verify-email/`, `src/app/api/auth/verify-email/` | Token from URL, POST to verify |
| **Trial – OTP send** | `src/app/try/page.tsx`, `src/app/api/auth/trial/send-otp/` | 6-digit OTP, rate limits |
| **Trial – OTP verify** | `src/app/try/page.tsx`, `src/app/api/auth/trial/verify-otp/` | Creates trial User + JWT cookie |
| **Trial – session status** | `src/app/api/auth/trial/status/` | Returns expiry for 5-min timer |
| **Resume list & create** | `src/app/dashboard/`, `src/app/resumes/new/`, `src/app/api/resumes/` | GET list, POST create |
| **Resume edit** | `src/app/resumes/[id]/edit/`, `src/app/api/resumes/[id]/` | GET/PATCH/DELETE with versioning |
| **Resume builder** | `src/components/resume-builder/` | Sections, drag-and-drop |
| **Export – TXT** | `src/app/api/resumes/[id]/export/txt/` | Free tier, server-rendered |
| **Export – HTML/Print** | `src/app/api/resumes/[id]/export/html/` | Free tier, watermark for non-Pro |
| **Export – PDF** | `src/components/resume-builder/export-buttons.tsx` | Client-side via jsPDF; logged via POST `/export/log` |
| **Export – DOCX** | `src/app/api/resumes/[id]/export/docx/` | Pro tier only |
| **User profile** | `src/app/settings/`, `src/app/api/user/profile/` | GET/PATCH, supports trial |
| **Blog** | `src/app/blog/`, `content/blog/*.md` | File-based Markdown |
| **Structured data / AI** | `src/app/api/structured-data/` | Public JSON for AI tools |
| **Landing** | `src/app/page.tsx` | Hero, CTAs |
| **Pricing** | `src/app/pricing/` | Free vs Pro |
| **Templates** | `src/app/templates/`, `src/app/try/templates/` | Gallery + trial picker |

---

## 2. Workflow Mapping

### Signup → Login → Create → Edit → Export

```
/signup → POST /api/auth/signup (creates User, sends verification)
   ↓
/verify-email?token=... → POST /api/auth/verify-email
   ↓
/login → NextAuth session → /dashboard
   ↓
/resumes/new → POST /api/resumes → /resumes/[id]/edit
   ↓
/resumes/[id]/edit → GET/PATCH, Export (TXT/HTML free; PDF/DOCX Pro)
```

### Trial flow (5-min OTP)

```
/try → Email → POST /api/auth/trial/send-otp
   ↓
OTP input → POST /api/auth/trial/verify-otp → trial_session cookie
   ↓
/try/templates → POST /api/resumes → /resumes/[id]/edit
   ↓
5-min timer via GET /api/auth/trial/status
   ↓
Expiry modal → Sign up to save / Start new trial
```

### Protected routes (middleware)

- **Protected:** `/dashboard`, `/settings`, `/resumes/*`
- **Trial allowed:** `/resumes/*`, `/try/templates` (with trial cookie)
- **Redirects:** No auth → `/try` (resumes) or `/login` (others)

---

## 3. Database Connectivity

### Prisma setup

- **Provider:** PostgreSQL
- **URLs:** `DATABASE_URL` (pooled), `DIRECT_URL` (for migrations)
- **Singleton:** `src/lib/prisma.ts` reuses client in dev to avoid connection exhaustion

### Models in use

| Route area | Models |
|------------|--------|
| Auth (signup, verify, reset) | User, VerificationToken, PasswordResetToken |
| Auth (trial) | TrialSession, OtpAttempt, User, Account |
| Auth (NextAuth) | User, Account, Session |
| Resumes | Resume, ResumeVersion |
| Export | Resume, ExportLog |
| Profile | User |

### Issues

1. **`DIRECT_URL`** – Neon/Supabase need `DIRECT_URL` for migrations; `.env.example` has it optional.
2. **Connection pooling** – Prisma handles it; ensure `DATABASE_URL` uses pooler for Vercel serverless.
3. **Logging** – Production Prisma logs `["error"]` only; add debug if migrations/deploy fail.

---

## 4. API Overview

| Route | Auth | Purpose |
|-------|------|---------|
| `/api/auth/[...nextauth]` | - | NextAuth |
| `/api/auth/signup` | None | Create user, verification email |
| `/api/auth/verify-email` | None | Verify token |
| `/api/auth/forgot-password` | None | Send reset email |
| `/api/auth/reset-password` | None | Set password from token |
| `/api/auth/trial/send-otp` | None | Send OTP |
| `/api/auth/trial/verify-otp` | None | Verify OTP, set cookie |
| `/api/auth/trial/status` | Trial | Get expiry |
| `/api/user/profile` | Session or trial | GET/PATCH |
| `/api/resumes` | Session or trial | List, create |
| `/api/resumes/[id]` | Session or trial | CRUD |
| `/api/resumes/[id]/export/txt` | Session only | TXT |
| `/api/resumes/[id]/export/html` | Session only | HTML |
| `/api/resumes/[id]/export/docx` | Session + Pro | DOCX |
| `/api/resumes/[id]/export/log` | Session only | Log PDF export |
| `/api/structured-data` | None | Public JSON |

---

## 5. Issues & Recommendations

### High priority

| # | Issue | Recommendation |
|---|-------|----------------|
| 1 | `DIRECT_URL` optional | Set `DIRECT_URL` for Neon/Supabase; update `.env.example` |
| 2 | Trial JWT fallback `"trial-secret-change-me"` | Require `TRIAL_SESSION_SECRET` in prod; fail if missing |
| 3 | Email verification not enforced | Add `emailVerified` check in credentials `authorize()` |
| 4 | Resend missing → silent fail | Add health check or startup validation when `RESEND_API_KEY` empty |
| 5 | Export log ignores trial | Support trial in log, or document that only Pro logs |

### Medium priority

| # | Issue | Recommendation |
|---|-------|----------------|
| 6 | Resume `content` not validated | Add Zod schema for content shape |
| 7 | Email not normalized (signup) | Use `trim().toLowerCase()` on email |
| 8 | Signup page shows "Zesty" | Update to "ResumeDoctor" |
| 9 | Generic 500 errors | Introduce error codes for better client handling |

### Lower priority

| # | Issue | Recommendation |
|---|-------|----------------|
| 10 | Dashboard assumes NextAuth only | Consider trial dashboard or reuse `/try/templates` |
| 11 | Rate limiting on OTP | Add rate limit on auth endpoints (or infra) |
| 12 | Prisma logging | Keep production minimal; add debug for deploys |

---

## 6. Next Steps

1. **Database** – Verify `DATABASE_URL` and `DIRECT_URL` in Vercel; run `npx prisma migrate deploy`.
2. **Auth** – Fix trial secret fallback and email verification gate.
3. **Env** – Add `DIRECT_URL` example; document required vs optional vars.
4. **UX** – Fix branding, email normalization, error handling.
5. **Export** – Decide export-log behavior for trial users.
