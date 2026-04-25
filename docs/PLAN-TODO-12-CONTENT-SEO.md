# Todo 12 – Blog & Examples Content (WBS 12) – Plan ✅ DONE

**Goal:** Complete the Content Engine & SEO work so ResumeDoctor has expert-grade blog content, 10 resume example pages with schema, and a clear internal-linking mesh between blog and examples.

**Scope (WBS 12):**
- 12.1 Blog structure — ✅ (MD in `content/blog/`)
- 12.2 10 foundational articles — ✅ 10 posts; add 2 high-value posts
- 12.3 Resume examples schema — ✅ (`content/examples/index.json`)
- 12.4 5–10 resume example pages — ✅ 8 live; add 2 to reach 10
- 12.5 Sitemap — ✅ (`src/app/sitemap.ts`)
- 12.6 Meta / OG — ✅ (per-page)
- 12.7 Structured data — Article ✅; add **HowTo** + **ItemList** for examples
- 12.8 Internal linking — Implement blog ↔ examples cross-links and related content

---

## 1. Content

### 1.1 Resume examples (12.4)
- **Current:** 8 examples (Software Engineer, Fresher, Data Analyst, Marketing, BPO, Accountant, Teacher, Sales).
- **Add 2:** HR Manager, Product Manager — so we hit 10 and cover more high-intent roles.

### 1.2 Blog articles (12.2)
- **Current:** 10 posts (ATS guide, freshers, summary, skills, career gaps, formats, Naukri/LinkedIn, cover letter, length, Chennai tips).
- **Add 2:**
  - **Resume checklist before you apply** — last-minute checks (typos, keywords, length, contact).
  - **How to tailor your resume to a job description** — JD alignment, keywords, “Apply all” CTA to builder.

---

## 2. Structured data (12.7)

- **Blog:** Article JSON-LD already on each post.
- **Examples index (`/examples`):** Add **ItemList** JSON-LD (list of all example pages with name, url, description).
- **Example detail (`/examples/[slug]`):** Add **HowTo** JSON-LD (“How to write a [Role] resume”) with steps from tips.

---

## 3. Internal linking (12.8)

- **Blog index:** Add a “Resume examples by role” block (link to `/examples` + 3–4 example cards).
- **Blog post:** Add “Related articles” (2–3 by topic) and “Resume examples for you” (topic → example slugs).
- **Examples index:** Add “From our blog” with 4 recent or key articles.
- **Example detail:** Add “Related blog posts” (role/industry → 2–3 blog slugs).
- **Footer:** Already has Blog, Resume Examples, ATS Guide, CV for Freshers — keep as is.

---

## 4. Mapping (related content)

- **Blog slug → example slugs:** e.g. `how-to-write-cv-for-freshers` → `fresher-resume-example`; `ats-friendly-resume-complete-guide` → multiple; `skills-section-guide` → tech/analytics examples.
- **Example slug → blog slugs:** e.g. `fresher-resume-example` → `how-to-write-cv-for-freshers`, `resume-formats-india-guide`; `software-engineer-resume` → `ats-friendly-resume-complete-guide`, `skills-section-guide`, `how-to-write-professional-summary`.

Implement via a small `src/lib/content-links.ts`: `getRelatedExamplesForBlog(slug)`, `getRelatedPostsForExample(slug)`.

---

## 5. Deliverables

| Item | Deliverable |
|------|-------------|
| Plan | This document |
| Examples | 2 new entries in `content/examples/index.json` |
| Blog | 2 new MD files in `content/blog/` |
| Schema | ItemList (examples index), HowTo (example detail) in `json-ld.tsx` |
| Links lib | `src/lib/content-links.ts` |
| UI | Blog index: examples block; Blog [slug]: related + examples; Examples index: blog block; Examples [slug]: related blog |

---

**Done when:** 10 examples live with HowTo/ItemList, 12 blog posts, and full cross-linking between blog and examples.
