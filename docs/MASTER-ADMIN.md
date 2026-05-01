# Master admin (owner cockpit)

Internal reference for the `/admin` surface: access control, APIs, metrics, events, rollout, and regression checks.

## Access control

- **Role:** `User.role === "admin"` (see Prisma `User`).

### Promote your account to admin (one command)

From the repo root, point `.env.local` at the **same `DATABASE_URL` as production** (Neon/Supabase connection string), then:

```bash
PROMOTE_ADMIN_EMAIL=you@example.com npm run promote-admin
```

**PowerShell (Windows):**

```powershell
$env:PROMOTE_ADMIN_EMAIL="you@example.com"; npm run promote-admin
```

(`npm run promote-admin` loads `.env.local` via Node’s `--env-file` for `DATABASE_URL`.)

If `PROMOTE_ADMIN_EMAIL` is unset, the script exits with an error. Do not commit emails or passwords; this only updates `role` in the database.

- **Optional allowlist:** `MASTER_ADMIN_EMAILS` in env — comma-separated emails. If set, only those emails may use `/admin` and `/api/admin/*` (see `src/lib/master-admin-config.ts`, `src/middleware.ts`, `src/lib/admin-auth.ts`).
- **Super admin (destructive ops):** `SUPER_ADMIN_EMAILS` — comma-separated emails. If set, only those addresses may call sensitive routes: CSV export (`/api/admin/export`), impersonation, user `PATCH`, session revoke, promo create/update/delete, trial approve/reject, job `PATCH`. If unset, every user who passes `MASTER_ADMIN_EMAILS` + `role === "admin"` is treated as super admin for those actions.
- **2FA for admin (optional):** Set `REQUIRE_ADMIN_2FA=true` to block admin sign-in until the account has 2FA enabled in Settings. If 2FA is enabled, `/admin/login` continues through the shared `/login/2fa` flow.
- **IP allowlist (optional):** `ADMIN_IP_ALLOWLIST` — comma-separated client IPs checked in `src/middleware.ts` for authenticated admin page traffic (uses `x-forwarded-for` / `x-real-ip`). If unset, no IP filter.
- **2FA (general):** End users may enable 2FA in Settings; if enabled, credential sign-in goes through the normal 2FA step for any account including admins when `REQUIRE_ADMIN_2FA` is not forcing early rejection.
- **OAuth:** Accounts with `role === "admin"` cannot sign in with Google/LinkedIn (`src/lib/auth.ts`); use email + password at `/admin/login`.
- **Crawl / SEO:** `src/app/admin/layout.tsx` sets `robots: noindex,nofollow`. `src/app/robots.ts` disallows `/admin`.

## Admin API inventory (readiness)

| Route | Method | Purpose | Notes |
|--------|--------|---------|--------|
| `/api/admin/stats` | GET | Headline counts, recent signups | Production-ready |
| `/api/admin/analytics` | GET | Plans, templates, features, funnel, extended KPIs | Production-ready |
| `/api/admin/users` | GET | Paginated user list | Production-ready |
| `/api/admin/users/[id]` | GET, PATCH | User detail (includes invoices + SuperProfile events); admin edits | PATCH super-admin only; audited |
| `/api/admin/users/[id]/activity` | GET | Merged timeline | Production-ready |
| `/api/admin/export` | GET | CSV: `type=users` \| `exports` \| `purchases` \| `audit_log` \| `churn` | Audited; requires super admin when `SUPER_ADMIN_EMAILS` is set |
| `/api/admin/purchases` | GET | Paginated ledger: `Invoice` + `SuperprofilePurchaseEvent` (`source`, `status`, `plan`, `q`, `from`, `to`) | Read: any master admin |
| `/api/admin/export-logs` | GET | (existing) | Unchanged |
| `/api/admin/trial-sessions` | GET | Trial sessions | Unchanged |
| `/api/admin/trial-activations` | GET | Pending + recent history (last 50 approved/rejected) | |
| `/api/admin/trial-activations/[id]/approve` | POST | Approve ₹1 trial | Audited |
| `/api/admin/trial-activations/[id]/reject` | POST | Reject pending request (optional `reason`) | Audited |
| `/api/admin/security-audit` | GET | Paginated `SecurityAuditLog` (`action` filter) | |
| `/api/admin/users/[id]/revoke-sessions` | POST | Delete all NextAuth `Session` rows for user | Audited; blocked for target `admin` |
| `/api/admin/promos` | GET, POST | List / create promo codes | Create/delete audited |
| `/api/admin/promos/[id]` | PATCH, DELETE | Update / delete promo | Audited |
| `/api/admin/jobs` | GET | List jobs (includes inactive), paginated | |
| `/api/admin/jobs/[id]` | PATCH | `active`, `title`, `company` | Audited |
| `/api/admin/system-metrics` | GET | OTP + IP rate-limit counters (read-only) | |
| `/api/admin/impersonate` | POST | Start impersonation | Super admin; audited; cookie TTL 30m |
| `/api/admin/impersonate/end` | POST | End impersonation | Super admin; audited |

Audit rows use `SecurityAuditLog` with `action` values such as `admin_user_update`, `admin_impersonate_start`, `admin_impersonate_end`, `admin_export_csv`, `admin_trial_activation_approve`, `admin_trial_activation_reject`, `admin_revoke_sessions`, `admin_promo_create`, `admin_promo_update`, `admin_promo_delete`, `admin_job_update`. `meta` often includes `adminUserId`.

**Admin UI pages:** `/admin/purchases`, `/admin/audit-log`, `/admin/promos`, `/admin/jobs`, `/admin/system-health` (see sidebar in `src/components/admin/admin-app-shell.tsx`).

## Metric dictionary (30+)

Definitions use **IST-friendly “calendar”** interpretation unless you standardize on UTC in a later pass. **Refresh:** on-demand (each dashboard load) unless noted.

| # | Metric | Formula / source | Table(s) |
|---|--------|------------------|----------|
| 1 | Total users | `count(*)` User | User |
| 2 | Total resumes | `count(*)` Resume | Resume |
| 3 | Total exports | `count(*)` ExportLog | ExportLog |
| 4 | Users on trial plan | `subscription = trial` | User |
| 5 | Pro monthly + annual | `subscription in (pro_monthly, pro_annual)` | User |
| 6 | Basic / legacy free | `subscription in (basic, free)` | User |
| 7 | Pro ₹1 trial seats | `subscription = pro_trial_14` | User |
| 8 | Plan breakdown | `group by subscription` | User |
| 9 | Conversion rate (proxy) | `pro monthly+annual / total users * 100` | User |
| 10 | Template usage | `group by templateId` count resumes | Resume |
| 11 | Exports by format | `group by format` | ExportLog |
| 12 | Feature usage 30d | `group by feature` where `createdAt >= T-30d` | FeatureUsageLog |
| 13 | AI usage 30d total | count AiUsageLog T-30d | AiUsageLog |
| 14 | AI by action 30d | `group by action` T-30d | AiUsageLog |
| 15 | ATS runs 30d | count AtsScoreCache T-30d | AtsScoreCache |
| 16 | Funnel events 7d | Selected `ProductEvent.name` counts T-7d | ProductEvent |
| 17 | Cohort signup → paid | Weekly signups vs distinct `payment_success` | User, ProductEvent |
| 18 | Cover letters (all time) | `count(*)` CoverLetter | CoverLetter |
| 19 | Job applications (all time) | `count(*)` JobApplication | JobApplication |
| 20 | Churn feedback 30d | `count(*)` ChurnFeedback T-30d | ChurnFeedback |
| 21 | SuperProfile purchase events | `count(*)` SuperprofilePurchaseEvent | SuperprofilePurchaseEvent |
| 22 | Paid invoices count | `count where status=paid` | Invoice |
| 23 | Paid amount (INR) | `sum(amount)` paise → ÷100 INR | Invoice |
| 24 | Email verified users | `emailVerified != null` | User |
| 25 | Email unverified users | `emailVerified == null` | User |
| 26 | Pending trial activations | `TrialActivationRequest status=pending` | TrialActivationRequest |
| 27 | DAU (approx.) | Distinct `ProductEvent.userId` T-24h | ProductEvent |
| 28 | Onboarding completed 30d | `ProductEvent name=onboarding_completed` T-30d | ProductEvent |
| 29 | Product event volume 7d | `group by name` T-7d | ProductEvent |
| 30 | Recent signups | Last 5 users by `createdAt` | User |
| 31 | Per-user activity timeline | Merge ProductEvent, FeatureUsageLog, ExportLog, AiUsageLog | Multiple |
| 32 | Trial sessions volume | Via `/api/admin/trial-sessions` | TrialSession |
| 33 | Export log drill-down | `/admin/export-logs` + API | ExportLog |

## Product event names (governed)

Canonical names live in `src/lib/analytics-event-names.ts` (`AnalyticsEvents`, `DOCUMENTED_PRODUCT_EVENT_NAMES`, `isDocumentedProductEventName`).

**Server touchpoints (emitters):**

- `src/app/api/auth/signup/route.ts` — `sign_up`
- `src/app/api/auth/trial/verify-otp/route.ts` — `trial_start`
- `src/app/api/resumes/route.ts` — `resume_created`
- `src/lib/export-api-helpers.ts` — `first_export`
- `src/app/api/billing/webhook/route.ts` — `payment_success`
- `src/lib/superprofile-fulfillment.ts` — `payment_success`
- `src/app/api/user/profile/route.ts` — `onboarding_step_completed`
- `src/app/api/user/onboarding-status/route.ts` — `onboarding_completed`
- `src/app/api/analytics/event/route.ts` — client-forwarded names (must stay aligned with `AnalyticsEvents`)

**Client / GA alignment:** `src/lib/analytics.ts` `FUNNEL_EVENTS` values should match stored `ProductEvent.name` where mirrored.

## Phased rollout (engineering)

- **Phase 1 (shipped):** Owner allowlist env, OAuth blocked for admin role (password sign-in), audit log for sensitive admin actions, `noindex` + `robots` for `/admin`, extended `/api/admin/analytics` + dashboard UI, per-user activity API + UI, documented metrics and events (this file).
- **Admin cockpit expansion:** Trial reject + history on GET list; security audit viewer; revoke user sessions; promo CRUD; jobs list + active toggle; system health (OTP / IP rate-limit counters).
- **Phase 2 (optional):** Daily rollup tables for heavy aggregates; stricter UTC boundaries; alerting on funnel drops.
- **Phase 3 (optional):** Retention policies for `ProductEvent` / logs; anomaly detection.

## Non-admin regression (smoke)

After changing admin/auth/middleware:

1. `/` home loads; `/pricing`, `/try` load.
2. `/signup` → `/login` credentials flow for a **non-admin** user; `/dashboard` loads.
3. Trial cookie path: `/try` → `/try/templates` still works for anonymous trial where applicable.
4. Non-admin session: `GET /api/admin/stats` → **403**.
5. Admin session (allowlisted if env set): `/admin` loads; stats + analytics JSON succeed.
6. Smoke new pages: `/admin/audit-log`, `/admin/promos`, `/admin/jobs`, `/admin/system-health` return 200 for admin.
7. Middleware matcher in `src/middleware.ts` remains scoped (no accidental global `/:path*`).
