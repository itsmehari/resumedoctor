# Activation funnel — events and GA4 setup

North-star path: **signup → first resume → ATS or export signal → paid Pro** (SuperProfile).

## Client events (GA4, consent-gated `trackEvent`)

| Step | Event name | Where fired |
|------|------------|-------------|
| OTP Try started | `trial_start` | [`src/app/try/page.tsx`](../src/app/try/page.tsx) after OTP verify |
| Signup | `sign_up` | [`src/app/signup/page.tsx`](../src/app/signup/page.tsx) |
| Resume created | `resume_created` | Template pickers (`/templates`, `/try/templates`) |
| ATS check | `ats_check_completed` | [`src/components/resume-builder/ats-score-panel.tsx`](../src/components/resume-builder/ats-score-panel.tsx) on successful API response |
| Export | `resume_export` | Export buttons (format in params) |
| Upgrade intent | `upgrade_click` | Pricing, settings, export gates |
| Pricing viewed | `pricing_view` | [`src/app/pricing/page.tsx`](../src/app/pricing/page.tsx) after region resolved |
| Checkout | `superprofile_checkout_click` / `_cancelled` | SuperProfile CTAs |

## Server events (`ProductEvent` / DB)

Recorded in API routes: `resume_created`, `first_export`, `payment_success`, etc. (see [`src/lib/analytics-event-names.ts`](../src/lib/analytics-event-names.ts) and usages under `src/app/api/`).

## Suggested GA4 funnel exploration

1. Create an **Exploration** or **Funnel** with steps: `sign_up` → `resume_created` → `ats_check_completed` OR `resume_export` → `superprofile_checkout_click` → `payment_success`.
2. Break down by `utm_campaign` using existing UTM merge in [`src/lib/analytics.ts`](../src/lib/analytics.ts).

Last updated: product marketing plan implementation.
