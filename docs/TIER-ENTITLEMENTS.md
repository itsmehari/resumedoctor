# Tier entitlements (internal)

Support, PM, and engineering reference. Customer-facing names: see [MESSAGING-BRIEF.md](./MESSAGING-BRIEF.md).

**Authoritative Pro check (code):** [`hasFullProAccess`](../src/lib/subscription-entitlements.ts) — `pro_monthly`, `pro_annual`, or active `pro_trial_14` (`subscriptionExpiresAt` in the future).  
**Resume pack:** PDF/DOCX for resumes only — [`getResumeForExport`](../src/lib/export-api-helpers.ts) with `requirePro` plus [`consumePackCreditIfNeeded`](../src/lib/export-api-helpers.ts). Not applied to cover letters.

## Subscription strings (`User.subscription`)

| Value | Meaning |
|-------|---------|
| `basic`, `free` | Basic tier (`free` normalized to basic in APIs) |
| `trial` | Legacy / admin “trial user” mode — APIs treat like Try where `getResumeAuth().isTrial` |
| `pro_monthly`, `pro_annual` | Full Pro |
| `pro_trial_14` | 14-day pass — Pro until `subscriptionExpiresAt` |

OTP **Try** sessions use a JWT cookie; [`getResumeAuth`](../src/lib/trial-auth.ts) sets `isTrial: true` for OTP **or** `subscription === "trial"`.

## Feature × tier (implementation)

| Feature | Try (OTP / trial user) | Basic | 14-day pass / Pro |
|---------|-------------------------|-------|---------------------|
| Templates | Trial allowlist [`getAllowedTemplateIds`](../src/lib/template-access.ts) | First 10 base IDs | All templates |
| Resume TXT export | Blocked (Try UI); API [`export/txt`](../src/app/api/resumes/[id]/export/txt/route.ts) | Allowed | Allowed |
| Resume PDF/DOCX | Blocked [`getResumeForExport`](../src/lib/export-api-helpers.ts) | Pro or resume pack | Full Pro |
| Cover letter DOCX | Blocked when trial; else Pro only [`cover-letters/.../docx`](../src/app/api/cover-letters/[id]/export/docx/route.ts) | Pro only | Full Pro |
| Cover letter TXT | Session route [`export/txt`](../src/app/api/cover-letters/[id]/export/txt/route.ts) (signed-in) | Allowed | Allowed |
| Client PDF (resume / cover) | Gated in UI (`ExportButtons`, cover letter page) | Pro / pack (resume only) | Full Pro |
| AI (shared daily pool) | Counted after sign-up [`checkAiRateLimit`](../src/lib/ai-rate-limit.ts) | 5/day UTC | 50/day UTC |
| ATS score API | Blocked [`ats/route`](../src/app/api/resumes/[id]/ats/route.ts) | One teaser per resume | Unlimited |
| ATS eligibility (UI) | [`ats/eligibility`](../src/app/api/resumes/[id]/ats/eligibility/route.ts) | Teaser state | Unlimited |
| Keyword / JD match | [`job-match/route`](../src/app/api/resumes/[id]/job-match/route.ts) — requires NextAuth | Allowed | Allowed |
| AI usage snapshot | [`feature-limits`](../src/app/api/user/feature-limits/route.ts) | Same | Same |

## Related UI entry points

- Resume builder: [`edit/page.tsx`](../src/app/resumes/[id]/edit/page.tsx), [`export-buttons.tsx`](../src/components/resume-builder/export-buttons.tsx), [`ats-score-panel.tsx`](../src/components/resume-builder/ats-score-panel.tsx), [`job-paste-panel.tsx`](../src/components/resume-builder/job-paste-panel.tsx)
- Pricing matrix: [`pricing/page.tsx`](../src/app/pricing/page.tsx) (`COMPARE_PLAN_ROWS`)
- Profile / subscription hook: [`user/profile`](../src/app/api/user/profile/route.ts), [`use-subscription.ts`](../src/hooks/use-subscription.ts)
