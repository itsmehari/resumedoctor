# ResumeDoctor — Brand identity (internal)

Authoritative reference for copy, UI, and marketing. Phase 1: documentation only. See also [MESSAGING-BRIEF.md](./MESSAGING-BRIEF.md) and [DESIGN-PLAN-HOMEPAGE.md](./DESIGN-PLAN-HOMEPAGE.md).

## Essence

**Resume is input. Employability is output.**

ResumeDoctor helps Indian job seekers create credible resumes fast, keep them current, manage variants, share one live link, and export when portals still need a file.

## Positioning

| Dimension | Statement |
|-----------|-----------|
| Category | India-first web resume & CV builder (SaaS) |
| Audience | Freshers through mid-career; Naukri, LinkedIn, campus, referrals |
| Primary promise | Create → maintain → manage → **share as a link** |
| Secondary | ATS-aware templates, JD match in editor, PDF/DOCX on Pro |
| Not | Generic US-only resume advice; link-hosting without builder |

## Voice

- Clear, encouraging, plain English
- Use: apply, shortlist, recruiters, portals
- Avoid: unverified superlatives, internal code names, leading with “ATS” on hero/meta/social (see MESSAGING-BRIEF)
- Tier names: **OTP Try**, **Basic** (signed-in free where shown), **Pro**, **14-day pass** (never confuse pass with Try)

## Visual (canonical)

| Token | Value | Source |
|-------|--------|--------|
| Primary | `primary-600` / `#0d65d9` family | `tailwind.config.ts` |
| Accent | `accent` / amber CTA on dark heroes | `tailwind.config.ts`, `globals.css` |
| Fonts | Inter (body), Poppins (display) | `src/app/layout.tsx` |
| Logo | Wordmark “ResumeDoctor” in header | `src/components/site-header` |
| Favicon | `/favicon.png` | `public/` |
| Default OG | `/og-image.png` | `public/`, `src/lib/seo.ts` |

## Channels

| Channel | Notes |
|---------|--------|
| Web | `resumedoctor.in` — builder, `/r/` links, pricing via SuperProfile |
| Email | ZeptoMail; same-email rule for SuperProfile fulfilment |
| Social | Facebook, Instagram, LinkedIn company, X — URLs in `src/lib/organization-social.ts` |
| AI discovery | `/llms.txt`, `/api/structured-data`, JSON-LD on key pages |

## Governance

- Product claims must match shipped behaviour (export tiers, trial, link behaviour).
- Testimonials: only with permission; no invented counts.
- Partner one-pager: use § Positioning + § Voice + link to `/features` and `/pricing`.

Last updated: 2026-05-20
