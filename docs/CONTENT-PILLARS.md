# Content pillars and cluster map (SEO)

Use this to prioritize new posts and internal links. Clusters already partially wired in [`src/lib/content-links.ts`](../src/lib/content-links.ts).

## Pillar 1 — ATS-friendly resume (commercial + informational)

- **Pillar URL:** [`/blog/ats-friendly-resume-complete-guide`](/blog/ats-friendly-resume-complete-guide)
- **Intent:** How ATS reads resumes; structure, keywords, mistakes.
- **Cluster (supporting):** `skills-section-guide`, `how-to-tailor-resume-for-job-description`, `resume-checklist-before-you-apply`, `how-to-write-professional-summary`
- **Examples tie-in:** Software engineer, data analyst, product manager example pages → link to pillar in intros where relevant.
- **BOFU:** Link to [`/pricing`](/pricing) near “ready to export” moments in pillar updates.

## Pillar 2 — Resume formats for India (informational → conversion)

- **Pillar URL:** [`/blog/resume-formats-india-guide`](/blog/resume-formats-india-guide)
- **Intent:** Length, sections, fresher vs experienced norms in India.
- **Cluster:** `how-to-write-cv-for-freshers`, `resume-length-one-page-or-two`, `handling-career-gaps-on-resume`
- **BOFU:** [`/try`](/try) for hands-on; [`/templates`](/templates) for layout choice.

## Publishing cadence (suggested)

| Week | Action |
|------|--------|
| Ongoing | One supporting article or example refresh per week when possible |
| Monthly | Refresh pillar intros, FAQs, and internal links to pricing/try |

## Internal links (site sections)

- Blog index includes a **Start here** strip (see [`src/app/blog/page.tsx`](../src/app/blog/page.tsx)).
- Examples index links to blog + optional pricing CTA (see examples page).

Last updated: product marketing plan implementation.
