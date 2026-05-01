# Landing pages (BOFU) runbook

Internal reference: owners, KPIs, UTMs, and trust checks before spend. Keep in sync with [`MESSAGING-BRIEF.md`](./MESSAGING-BRIEF.md) and [`PPC-AND-BOFU-LANDING.md`](./PPC-AND-BOFU-LANDING.md).

## Live routes and intent

| Route | Primary audience | H1 intent | Primary KPI | Owner | Next review |
|-------|------------------|-----------|-------------|-------|-------------|
| [`/lp/resume-builder-india`](../src/app/lp/resume-builder-india/page.tsx) | India portal applicants | Generic India builder + portals | CTR to `/try` | Product / marketing | Quarterly |
| [`/lp/fresher-campus-resume-india`](../src/app/lp/fresher-campus-resume-india/page.tsx) | Freshers, campus drives | First resume / placement | CTR to `/try` | Product / marketing | Quarterly |
| [`/lp/tailor-resume-job-description`](../src/app/lp/tailor-resume-job-description/page.tsx) | Mid-career tailoring JD | Match resume to JD + ATS angle | CTR to `/try` | Product / marketing | Quarterly |
| [`/lp/resume-export-pdf-docx-india`](../src/app/lp/resume-export-pdf-docx-india/page.tsx) | Export-motivated | Portal-ready PDF/DOCX | CTR to `/pricing` then try | Product / marketing | Quarterly |

Replace **Owner** with a named person when you assign one. **Next review** should move with pricing, SuperProfile, or tier changes—at minimum once per quarter.

## UTM convention (per LP)

Use lowercase `utm_source`, `utm_medium`, `utm_campaign`; keep `utm_content` for creative variant if needed.

Suggested pattern:

- `utm_source` — ad platform (`google`, `meta`, `linkedin`) or `email`, `partner`
- `utm_medium` — `cpc`, `paid_social`, `display`, `newsletter`
- `utm_campaign` — short campaign slug, e.g. `in_resume_q2`, `fresher_campus_may`
- LP-specific base (optional in campaign name): `lp_india`, `lp_fresher`, `lp_tailor`, `lp_export`

**Examples**

- India builder LP from Google Ads:  
  `?utm_source=google&utm_medium=cpc&utm_campaign=in_resume_q2&utm_content=lp_resume_builder_india`
- Fresher LP from Meta:  
  `?utm_source=meta&utm_medium=paid_social&utm_campaign=fresher_campus_may&utm_content=lp_fresher_campus`

Always land on the **canonical LP path** (no extra path segments). Document each live campaign’s full default URL in your ads manager.

## Trust audit checklist (before turning on paid traffic)

- [ ] **Try vs Pro vs 14-day pass** — Copy matches [`MESSAGING-BRIEF.md`](./MESSAGING-BRIEF.md); no “Try” label on the paid pass.
- [ ] **ATS / JD match** — Describes guidance or score, not a guarantee of interview or hire.
- [ ] **Exports** — PDF/DOCX and watermarks match what [`/pricing`](../src/app/pricing/page.tsx) says today.
- [ ] **AI** — No invented rankings or “#1”; no overstated automation claims.
- [ ] **Links** — Primary CTA and `/pricing` work; legal links unchanged if you mention billing.

## Features marketing page (`/features`)

- **Decision:** Shipped as a concise, stable URL for retargeting, partner intros, and nav—not a duplicate of the whole homepage.
- **Primary KPI:** Clicks to `/try` or `/pricing` from this page (add analytics when ready).
- **Owner / review:** Same owner column as LPs; refresh when homepage or pricing changes materially.

## Engineering checklist when adding an LP

1. New folder under `src/app/lp/<slug>/page.tsx`.
2. `metadata.alternates.canonical` = `${siteUrl}/lp/<slug>`.
3. Register URL in [`src/app/sitemap.ts`](../src/app/sitemap.ts).
4. Add a row to the table above.

Last updated: marketing plan implementation.
