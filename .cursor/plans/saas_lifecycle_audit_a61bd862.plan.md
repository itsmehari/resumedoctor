---
name: SaaS Lifecycle Audit
overview: ResumeDoctor is a Next.js 14 + PostgreSQL (Prisma) resume SaaS. Core lifecycle work has shipped—first-party ProductEvent, authenticated /api/analytics/event, Stripe webhook path (package dep + idempotent Invoice updates), primary customer payments via SuperProfile webhook (SuperprofilePurchaseEvent, billingProvider superprofile), dashboard onboarding checklist (User.onboardingChecklist + server detection), churn feedback on delete and cancel-subscription, pro_trial_14 reminder + downgrade crons (Vercel), and admin analytics funnel/cohort rollups over ProductEvent. Remaining strategic gaps include reactivation campaigns, referrals, deeper warehouse/CAC-LTV modeling, and fuller self-serve for resume-pack purchases outside SuperProfile if desired.
todos:
  - id: p0-billing
    content: "Primary pay path: SuperProfile + POST /api/webhooks/superprofile → fulfillment; Stripe webhook + Invoice for configured legacy path; manual/admin UPI for legacy rows"
    status: completed
  - id: p0-events
    content: ProductEvent + recordProductEvent; POST /api/analytics/event; server mirrors (signup, trial, resume_created, first_export, payment_success, etc.)
    status: completed
  - id: p1-onboarding
    content: Dashboard OnboardingChecklist + PATCH profile / onboarding-status; onboarding_step_completed / onboarding_completed events
    status: completed
  - id: p1-churn
    content: ChurnFeedback on delete-account + POST /api/user/churn-feedback (cancel flow); optional detail; ProductEvent churn_completed
    status: completed
  - id: p1-trial-email
    content: Vercel cron trial-expiry-reminders + trial-expired-downgrade; Resend; proTrialReminder*SentAt on User
    status: completed
  - id: p2-dashboard
    content: Admin GET /api/admin/analytics — productEvents.funnelLast7Days + cohortSignupToPaid over payment_success
    status: completed
  - id: p3-reactivation
    content: Win-back / re-engagement email loops (inactive users, post-churn) — not in codebase
    status: pending
  - id: p3-referral
    content: Referral or viral rewards MVP — not in codebase
    status: pending
  - id: p3-bi-export
    content: Optional admin CSV export of ProductEvent + ChurnFeedback for external BI (Metabase/BigQuery)
    status: pending
isProject: false
---

# ResumeDoctor — SaaS Customer Lifecycle Audit & Roadmap

## Executive summary

The product remains **strong on activation and engagement** (resume builder, AI, ATS, templates, jobs, cover letters). **Measurement and revenue glue have materially improved in-repo**: `ProductEvent` is the first-party event store; critical paths mirror server-side events; `**User.billingProvider`** distinguishes `stripe`, `manual`, and `**superprofile`**; `**SuperprofilePurchaseEvent`**gives idempotent fulfillment after SuperProfile checkout;`**Invoice`**+`**POST /api/billing/webhook**`support Stripe when configured. **Customer-facing pricing** on`[/pricing](src/app/pricing/page.tsx)`centers **SuperProfile** published payment links (same email as ResumeDoctor for fulfillment—see`[superprofile-pricing-links.tsx](src/components/pricing/superprofile-pricing-links.tsx)`and`[docs/BUSINESS-ONLY-AUDIT-SHEET.md](docs/BUSINESS-ONLY-AUDIT-SHEET.md)`). **Onboarding** is a real checklist on the dashboard (`[OnboardingChecklist](src/components/dashboard/onboarding-checklist.tsx)`, `[onboarding.ts](src/lib/onboarding.ts)`). **Churn learning** exists via `[ChurnFeedback](prisma/schema.prisma)` and delete/cancel flows. **Gaps that still matter for a “full” SaaS lifecycle**: automated **reactivation** loops, **referral** mechanics, **anonymous trial → CRM capture, and warehouse-level CAC/LTV if you outgrow admin JSON rollups.

---

## 1. CURRENT_STATE_FLOW (structured)

**Text flow diagram**

```mermaid
flowchart TB
  subgraph acquisition [Acquisition]
    SEO[SEO home blog templates]
    Direct[Direct bookmarks]
    Ads[GA4 Meta LinkedIn UTM]
    SEO --> Land
    Direct --> Land
    Ads --> Land
  end

  Land[Public pages] --> TryPath[/try OTP anonymous trial]
  Land --> SignPath[/signup credentials or OAuth]
  Land --> LoginPath[/login]

  TryPath --> TrialBuilder[Trial builder limited]
  TrialBuilder --> Pricing[/pricing SuperProfile + copy]

  SignPath --> VerifyEmail[verify-email Resend]
  VerifyEmail --> LoginPath
  LoginPath --> Dash[/dashboard checklist + core]

  Dash --> Core[Builder AI ATS Export Jobs CL Settings]
  Core --> Pricing

  Pricing --> SP[SuperProfile checkout same email]
  SP --> Webhook[POST /api/webhooks/superprofile]
  Webhook --> ProState[User.subscription pro_* billingProvider superprofile]

  Pricing --> Legacy[Legacy manual UPI trial form admin]
  Legacy --> AdminApprove[Admin trial approval]
  AdminApprove --> ProState

  Core --> Delete[/delete-account + churn survey]
  Core --> Cancel[/cancel subscription feedback]
  TrialBuilder --> SessionExpiry[Trial session expires anonymous churn]
```

**Narrative (aligned to code)**

| Stage                  | What exists                                                                                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Entry**              | Marketing routes; consent-gated pixels; `[trackPageView](src/lib/analytics.ts)` on navigation.                                                                                                                                                                     |
| **Signup**             | `/signup` → `[POST /api/auth/signup](src/app/api/auth/signup/route.ts)` + `**recordProductEvent(sign_up)`; OAuth in `[auth.ts](src/lib/auth.ts)`.                                                                                                                  |
| **Trial / onboarding** | Anonymous OTP trial; dashboard `**OnboardingChecklist`** with merged server detection + manual steps; `[PATCH` profile](src/app/api/user/profile/route.ts) / `[onboarding-status](src/app/api/user/onboarding-status/route.ts)`; `**onboarding\_\*` ProductEvents. |
| **Core usage**         | Resumes, AI, ATS, exports (tier checks + `**first_export` event), jobs, cover letters; `[FeatureUsageLog](src/lib/feature-usage.ts)`.                                                                                                                              |
| **Payment / upgrade**  | **SuperProfile** as primary CTA on pricing; webhook fulfillment + `**payment_success` ProductEvent; Stripe webhook still updates `User` + `Invoice` when Stripe is configured; legacy admin/UPI paths for old rows.                                                |
| **Exit / churn**       | Delete with optional `**churnReason` / `churnDetail`** → `**ChurnFeedback\*\*`+ events; cancel flow →`[/api/user/churn-feedback](src/app/api/user/churn-feedback/route.ts)`.                                                                                       |

---

## 2. CURRENT_FEATURE_MATRIX (post-implementation)

| Capability                          | Status                          | Where                                                                                                                                  |
| ----------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Onboarding system**               | Implemented                     | Dashboard checklist, `User.onboardingChecklist`, `onboardingCompletedAt`                                                               |
| **Engagement (in-app)**             | Strong                          | Builder, AI, ATS, jobs, cover letters                                                                                                  |
| **Notifications**                   | Transactional + trial lifecycle | Resend verify/OTP/reset; **pro trial expiry reminders** (`[trial-expiry-reminders](src/app/api/cron/trial-expiry-reminders/route.ts)`) |
| **Email marketing / lifecycle**     | Partial                         | Trial reminders; no broad drip/win-back                                                                                                |
| **Payment system**                  | Hybrid                          | **SuperProfile** + webhook; Stripe optional; manual/admin legacy                                                                       |
| **Subscription tiers**              | Yes                             | `free`, `trial`, `pro_monthly`, `pro_annual`, `pro_trial_14` on `User`                                                                 |
| **Feature gating**                  | Yes                             | Pro/trial/limits in ATS, AI caps, DOCX, export credits                                                                                 |
| **Retention mechanisms**            | Product + trial emails          | No usage-drop alerts or win-back                                                                                                       |
| **Reactivation**                    | None                            | No campaign layer                                                                                                                      |
| **Admin analytics**                 | Extended                        | `[/api/admin/analytics](src/app/api/admin/analytics/route.ts)`: funnel last 7d on ProductEvent names + **cohort signup → paid**        |
| **Product analytics (first-party)** | Strong baseline                 | `ProductEvent`, `[recordProductEvent](src/lib/product-events.ts)`, `[analytics-event-names.ts](src/lib/analytics-event-names.ts)`      |
| **Referral / viral**                | Not found                       | —                                                                                                                                      |

---

## 3. Lifecycle mapping & gap analysis (updated)

Legend: **Y** = Yes, **P** = Partial, **N** = No

| Layer                      | EXISTS | Current implementation                              | GAP                                                        | Impact        |
| -------------------------- | ------ | --------------------------------------------------- | ---------------------------------------------------------- | ------------- |
| **1. Acquisition**         | P      | SEO/content, pixels, UTM in client events           | Server-side attributed signup warehouse; referral          | Medium        |
| **2. Activation**          | Y      | Signup, verify, OTP trial, checklist, ProductEvents | Tune “aha” definitions per PM; ensure all surfaces log     | Low–Medium    |
| **3. Engagement**          | Y      | Core + logs                                         | Adoption funnels for PM beyond admin JSON                  | Medium        |
| **4. Conversion**          | Y      | SuperProfile + webhook; Stripe optional             | Depends on **email match** discipline; legacy manual still | Medium (ops)  |
| **5. Revenue expansion**   | P      | Promo, resume pack via SuperProfile                 | Self-serve pack **outside** SuperProfile if required       | Low           |
| **6. Retention**           | P      | Sticky product + trial reminder cron                | Usage-drop alerts, reinforcement nudges                    | Medium        |
| **7. Churn**               | Y      | Structured feedback + `ChurnFeedback`               | Aggregate reporting UI; export to BI                       | Low           |
| **8. Reactivation**        | N      | —                                                   | Email/incentive loops                                      | High for LTV  |
| **9. Analytics (CAC/LTV)** | P      | GA4 + admin funnel/cohort                           | Full warehouse, paid attribution                           | High at scale |

**Residual risks**

- **SuperProfile ↔ account email** must match—documented in product copy; mismatch = support load.
- **Anonymous trial expiry**: still limited CRM capture unless signup.
- **Reactivation** still unowned in code.

---

## 4. PRIORITY MATRIX (what is left)

**Done (treat as baseline)** — automated subscription **signals** (webhook-driven), **ProductEvent** spine, **onboarding**, **churn capture**, **trial emails**, **admin funnel**.

**P3 — Growth / optimization**

- Reactivation and win-back (batch + Resend).
- Referral MVP (credits or extra AI).
- Admin **CSV export** of `ProductEvent` / `ChurnFeedback` if JSON is not enough.
- Usage-based upgrade nudges (e.g. AI cap thresholds) using existing logs.

---

## 5. IMPLEMENTATION ROADMAP (status)

### Phase 1 — Core funnel (largely complete)

- ~~Gateway + webhook → `User` + `Invoice~~`— **Stripe path** exists; **primary customer path** is **SuperProfile webhook** +`SuperprofilePurchaseEvent`.
- ~~`ProductEvent` + server mirrors~~ — **Done**.
- ~~Churn capture~~ — **Done** (delete + cancel).

### Phase 2 — Growth systems (largely complete)

- ~~Onboarding checklist + events~~ — **Done**.
- ~~Trial ending emails + downgrade cron~~ — **Done** (`[vercel.json](vercel.json)` schedules).
- ~~Admin funnel view~~ — **Done** (`funnelLast7Days`, `cohortSignupToPaid`).

### Phase 3 — Optimization (backlog)

- Referral codes; feature flags; MRR-style reporting from `Invoice` + subscription dates; reactivation.

---

## 6. TECH IMPLEMENTATION (as built)

| Feature                      | Backend                                                                                                                                          | Frontend                                                                                               | Schema / notes                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **SuperProfile fulfillment** | `[/api/webhooks/superprofile](src/app/api/webhooks/superprofile/route.ts)`, `[superprofile-fulfillment.ts](src/lib/superprofile-fulfillment.ts)` | SuperProfile links on `[pricing](src/app/pricing/page.tsx)`                                            | `SuperprofilePurchaseEvent`, `billingProvider: superprofile` |
| **Stripe webhooks**          | `[/api/billing/webhook](src/app/api/billing/webhook/route.ts)`                                                                                   | Deprecated in-app checkout message on `[/api/billing/checkout](src/app/api/billing/checkout/route.ts)` | `Invoice.externalRef`, `stripeCustomerId`                    |
| **Lifecycle events**         | `recordProductEvent` at signup, trial, resume create, export, profile, webhook                                                                   | `[/api/analytics/event](src/app/api/analytics/event/route.ts)`                                         | `ProductEvent` model                                         |
| **Onboarding**               | `getMergedOnboardingForUser`, profile PATCH, onboarding-status                                                                                   | `OnboardingChecklist`                                                                                  | `User.onboardingChecklist` JSON, `onboardingCompletedAt`     |
| **Churn**                    | delete-account body + churn-feedback route                                                                                                       | `DeleteAccountDialog`, `CancelSubscriptionDialog`                                                      | `ChurnFeedback` with `source`, optional `userEmail`          |
| **Emails**                   | Crons with `CRON_SECRET`                                                                                                                         | —                                                                                                      | `proTrialReminder3dSentAt`, `proTrialReminder1dSentAt`       |

---

## 7. EVENT TRACKING SPEC

**Canonical names** — see `[src/lib/analytics-event-names.ts](src/lib/analytics-event-names.ts)`. Server mirrors `**sign_up`**, `**trial_start`**, `**resume_created**`, `**first_export**`, `**payment_success**`, `**onboarding_step_completed**`, `**onboarding_completed**`, `\*\*churn_completed\*\*`, etc., where implemented.

**Admin funnel bucket** — last-7-day counts for: `sign_up`, `resume_created`, `trial_start`, `checkout_started`, `first_export`, `payment_success`, `onboarding_completed`, `onboarding_step_completed`.

---

## 8. DATABASE (implemented shapes)

Refer to `[prisma/schema.prisma](prisma/schema.prisma)` for truth. Highlights:

- `**ProductEvent` — `userId?`, `name`, `props`, indexes on `(name, createdAt)`, `(userId, createdAt)`.
- `**ChurnFeedback`** — `userId?`, `userEmail?`, `reason`, `detail?`, `**source\*\` (`delete_account`|`cancel_subscription`), indexed.
- `**User` — `billingProvider`, `stripeCustomerId`, onboarding JSON + timestamps, pro-trial reminder sent timestamps.
- `**Invoice`** — amounts, `plan`, `**externalRef\*\` unique for idempotency.
- `**SuperprofilePurchaseEvent` — `idempotencyKey` unique, `productKey`, `email`, `userId`.

---

## 9. DASHBOARD DESIGN (metrics)

**Admin** — `[GET /api/admin/analytics](src/app/api/admin/analytics/route.ts)` returns `productEvents.funnelLast7Days` and `productEvents.cohortSignupToPaid` (weekly signup cohorts vs distinct `payment_success` by `userId`).

**Extensions (optional)** — CSV export; BigQuery/GA4 linking; session/heartbeat for true “returned” retention.

---

## 10. QUICK WINS (remaining)

1. **CSV export** (admin-guarded) for `ProductEvent` and `ChurnFeedback`.
2. **Standardize** any remaining ad-hoc event strings onto `AnalyticsEvents` constants.
3. **Reactivation**: one Resend template + weekly job for users inactive 14d with `subscription = free`.
4. **Docs**: keep `[BUSINESS-ONLY-AUDIT-SHEET.md](docs/BUSINESS-ONLY-AUDIT-SHEET.md)` aligned with SuperProfile as source of truth for customer pay.

---

## 11. Deliverables checklist

| Deliverable        | Location |
| ------------------ | -------- |
| Current state flow | §1       |
| Gap analysis       | §3       |
| Priority matrix    | §4       |
| Roadmap status     | §5       |
| Event spec         | §7       |
| Schema summary     | §8       |
| Quick wins         | §10      |

---

## Key files (anchor future work)

- **Events**: `[src/lib/product-events.ts](src/lib/product-events.ts)`, `[src/lib/analytics-event-names.ts](src/lib/analytics-event-names.ts)`, `[src/app/api/analytics/event/route.ts](src/app/api/analytics/event/route.ts)`
- **SuperProfile**: `[src/app/api/webhooks/superprofile/route.ts](src/app/api/webhooks/superprofile/route.ts)`, `[src/lib/superprofile-fulfillment.ts](src/lib/superprofile-fulfillment.ts)`, `[src/components/pricing/superprofile-pricing-links.tsx](src/components/pricing/superprofile-pricing-links.tsx)`
- **Stripe (legacy / optional)**: `[src/lib/billing/stripe.ts](src/lib/billing/stripe.ts)`, `[src/app/api/billing/webhook/route.ts](src/app/api/billing/webhook/route.ts)`
- **Onboarding**: `[src/lib/onboarding.ts](src/lib/onboarding.ts)`, `[src/components/dashboard/onboarding-checklist.tsx](src/components/dashboard/onboarding-checklist.tsx)`, `[src/app/api/user/onboarding-status/route.ts](src/app/api/user/onboarding-status/route.ts)`
- **Churn**: `[src/app/api/user/delete-account/route.ts](src/app/api/user/delete-account/route.ts)`, `[src/components/settings/delete-account-dialog.tsx](src/components/settings/delete-account-dialog.tsx)`, `[src/app/api/user/churn-feedback/route.ts](src/app/api/user/churn-feedback/route.ts)`, `[src/components/settings/cancel-subscription-dialog.tsx](src/components/settings/cancel-subscription-dialog.tsx)`
- **Crons**: `[vercel.json](vercel.json)`, `[src/app/api/cron/trial-expiry-reminders/route.ts](src/app/api/cron/trial-expiry-reminders/route.ts)`, `[src/app/api/cron/trial-expired-downgrade/route.ts](src/app/api/cron/trial-expired-downgrade/route.ts)`
- **Admin analytics**: `[src/app/api/admin/analytics/route.ts](src/app/api/admin/analytics/route.ts)`
- **Business context**: `[docs/BUSINESS-ONLY-AUDIT-SHEET.md](docs/BUSINESS-ONLY-AUDIT-SHEET.md)`

---

_Last aligned to repo state: 2026-04-27 — Next.js app under `e:\OneDrive\Resume-Doctor\_root`._
