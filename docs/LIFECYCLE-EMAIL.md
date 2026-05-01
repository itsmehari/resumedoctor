# Lifecycle email map (segments and sequences)

ResumeDoctor does not ship ESP automation in-repo; use this spec in your email tool (Resend, Customer.io, etc.) with the same copy themes as [`docs/MESSAGING-BRIEF.md`](./MESSAGING-BRIEF.md).

## Segments

| Segment | Definition | Goal |
|---------|------------|------|
| `signed_up_no_resume` | Account created, zero resumes | First resume created |
| `resume_no_export` | ≥1 resume, no export log | First export or ATS run |
| `otp_try_expired` | Try session ended, not signed up | Signup |
| `trial_active` | Short Try timer or India pass active | Activation during window |
| `trial_ending` | Pass day 10–14 or Pro renewal reminder (if you add renewals) | Upgrade / renew |
| `paid_pro` | Active Pro | Retention, tips, referrals |
| `dormant_14d` | No login 14 days | Re-engagement |

## Sequences (3–5 automated workflows)

1. **Welcome (post `sign_up`)** — Day 0: link to dashboard + “Create first resume”; Day 2: link to ATS pillar if no edit.
2. **Try abandon (`trial_start` no `sign_up` 24h)** — Remind OTP Try is short; CTA signup with same email story.
3. **Stuck after first resume (`resume_created` no `first_export` 3d)** — Explain TXT vs PDF; CTA `/pricing` with outcome subject line.
4. **India pass midpoint (day 7 of 14)** — Checklist: export PDF for two target roles; link ATS guide.
5. **Dormant (`dormant_14d`)** — One nudge: “Refresh for your next role” + link to blog checklist.

## Product events to sync (server / GA4)

Wire ESP on: `sign_up`, `trial_start`, `resume_created`, `first_export`, `payment_success`, `ats_check_completed` (client), `onboarding_completed` when available.

Last updated: product marketing plan implementation.
