# Prioritized backlog — WBS reality sync + shipping plan

**Purpose:** Single ordered list that (1) aligns [`WBS-WORK-BREAKDOWN-STRUCTURE.md`](./WBS-WORK-BREAKDOWN-STRUCTURE.md) with what the codebase actually contains as of **2026-05**, and (2) sequences **job tailoring / JD match** work alongside other product gaps.

**Companion:** Full task IDs remain in the WBS; this file does not replace it.

---

## 1. WBS vs codebase (reality check)

High-level status in the WBS (“Phases 4, 6–13 pending”) is **overstated**. Much of 6–12 exists in some form; treat rows below as **directionally accurate**, not a full audit.

| WBS phase | Doc posture | Codebase reality (verify periodically) |
|-----------|-------------|----------------------------------------|
| **1** Setup | Mostly done | CI, Prisma, env patterns exist. **1.7–1.8** file CDN/bucket polish may remain. |
| **2** Auth | Done | NextAuth, OAuth, verify email, 2FA paths present. |
| **3** Builder | Mostly done | CRUD, sections, DnD, preview, duplicate API (`/api/resumes/[id]/duplicate`). **3.9** dashboard duplicate/delete **UX** — confirm parity with API. |
| **4** Template engine | Listed open | **Templates** shipped (`/templates`, `/api/templates`, renderer); scale/design tasks **4.7–4.8** (more templates, thumbnails) may continue. |
| **5** Export | Done | TXT/HTML/PDF/DOCX, gating, logs. |
| **6** AI | Listed open | **Implemented:** improve bullet, summary, suggest bullets, **`POST .../ai/tailor-for-job`** (paste JD), rate limits, caching. **Gaps:** Redis-scale caching (6.6) optional; broader fallbacks (6.8). |
| **7** ATS | Listed open | **`computeAtsScore`**, `/api/resumes/[id]/ats`, cache, UI panel, Pro/Basic teaser. **Gap:** JD-specific keyword match **outside** AI tailor (deterministic score + gaps) not a first-class combined UX with ATS bar. |
| **8** Cover letter | Listed open | Models, CRUD, editor, customize API, exports. **Polish** templates (8.5) and dashboard linking (8.7) as needed. |
| **9** Job matching | Listed open | **`Job`**, **`JobApplication`**, `/jobs`, APIs, **matchScore** on listings. **Gaps:** ingestion/source strategy (9.7), richer filters, applied workflow polish. |
| **10** Payments | Mostly done | Stripe, webhooks, pricing. **10.6–10.9** trial variants / geo / self-serve subscription UI — confirm vs product. |
| **11** Admin | Partial | Admin routes, users, stats, trial, impersonate, export logs. **Gaps:** full MRR charts, template usage (11.4), CSV reports (11.7) as desired. |
| **12** Content / SEO | Advanced | Blog, examples library (JSON + pages), sitemap, JSON-LD, internal links. Ongoing articles and refreshes. |
| **13** DevOps | Partial | Vercel, crons, health, Sentry patterns; **staging/backups/runbooks** as org maturity. |

**Already ships “job description → resume help” (important for prioritization):**

- API: [`src/app/api/resumes/[id]/ai/tailor-for-job/route.ts`](../src/app/api/resumes/[id]/ai/tailor-for-job/route.ts)
- UI: [`src/components/resume-builder/job-paste-panel.tsx`](../src/components/resume-builder/job-paste-panel.tsx) on [`src/app/resumes/[id]/edit/page.tsx`](../src/app/resumes/[id]/edit/page.tsx)

So “job match” work below is **extend / harden / integrate**, not greenfield.

---

## 2. Ordered implementation plan (both tracks)

### Track A — Job description match & tailoring (ship / deepen first)

| Order | Item | Outcome |
|------:|------|--------|
| A1 | **Deterministic JD match score** (keyword/skill overlap resume ↔ JD) | Fast, explainable **%** without LLM; complements AI tailor; feeds ATS/marketing story. |
| A2 | **Unified panel UX** | Single “Tailor to job” area: paste JD → show **rule-based match** + **AI suggestions** (existing API); optional merge into one flow. |
| A3 | **Persist last JD + score** (optional table or JSON on `Resume`) | User returns and sees last run; fewer repeat LLM calls. |
| A4 | **Wire Jobs feed → tailor** | From `/jobs` card: “Open resume + pre-fill JD” or deep link to editor with JD query param. |
| A5 | **Analytics** | Events: `jd_match_run`, `tailor_for_job_success`, funnel to Pro. |
| A6 | **Docs / examples cross-link** | Blog posts on tailoring ↔ in-app empty state copy. |

### Track B — WBS-aligned follow-through (after or parallel with low-risk items)

| Order | Item | WBS refs |
|------:|------|----------|
| B1 | **Dashboard:** duplicate/delete UX audit vs **`/api/resumes/[id]/duplicate`** | 3.9 |
| B2 | **Subscription self-serve:** upgrade/cancel/manage surfaces | 10.8 |
| B3 | **ATS:** optional JD-aware suggestions using A1 overlap (same engine as match %) | 7.3 |
| B4 | **Jobs:** applied tracking + filters polish | 9.5–9.8 |
| B5 | **Admin:** MRR/template usage/export CSV if product needs ops clarity | 11.3–11.7 |
| B6 | **DevOps:** staging env + backup/runbook | 13.8–13.10 |
| B7 | **Template scale / thumbnails** | 4.7–4.8 |

---

## 3. Suggested sequencing (next 4–6 weeks)

1. **Week 1–2:** A1 + A2 (visible win on resume editor without new billing logic).
2. **Week 2–3:** A3 + A5 (retention + measurement).
3. **Week 3:** A4 + B1 (jobs ↔ builder + dashboard hygiene).
4. **Ongoing:** B2/B6 as business priority; **12** content refresh in parallel.

---

## 4. Maintenance

When major features ship, update **§1** in this file and optionally adjust the **completion** line at the top of [`WBS-WORK-BREAKDOWN-STRUCTURE.md`](./WBS-WORK-BREAKDOWN-STRUCTURE.md) so agents do not re-plan completed scope.
