# ResumeDoctor — one-page messaging brief

Internal reference for marketing, product copy, and lifecycle comms. Keep homepage, pricing, emails, and in-app strings aligned with this.

## Ideal customer profile (primary)

- **Who:** Job seekers in India using Naukri, LinkedIn, Indeed, campus drives, and referrals—freshers through mid-career.
- **Situation:** Needs a credible, ATS-readable resume quickly; may lack design skills or writer access.
- **Success:** Shortlist-ready file, confident apply on portals, fewer rejections from parsing issues.

## Top pains

1. Blank-page paralysis for bullets and summary — users know their work but cannot translate it into achievement-led lines.
2. Resume goes stale the moment it leaves their inbox — re-sending PDFs, version chaos ("resume-final-v2.pdf"), recruiters ignoring attachments.
3. Format friction on phones — recruiters open links on mobile; PDF attachments are awkward to scroll, zoom, and forward.
4. Export and template friction at the moment of applying — wrong layout for the portal, watermarks, no DOCX option.

## Outcomes we promise (not features)

1. **Create a resume fast** — pick a template, fill with AI-assisted bullets, draft in under 5 minutes.
2. **Keep it always current** — cloud-saved, edit anytime, every saved change is a new version you can roll back to.
3. **Manage variants in one place** — multiple resumes for different roles, companies, or career stages.
4. **Share it as one link** — `resumedoctor.in/r/<slug>` opens instantly on WhatsApp, LinkedIn DMs, recruiter email, email signature, or a QR on a printed card. Update once and every link you've ever shared stays current.
5. **Apply with confidence** — portal-ready PDF and DOCX on Pro for portals that still demand a file.

## Differentiation

- **Your resume as a link** — public, always-up-to-date URL. The shared link reflects every edit, no re-sends, no "is this the latest?". Verified in product: [src/app/r/[slug]/page.tsx](../src/app/r/[slug]/page.tsx) re-fetches on each visit. **This is our central differentiator.**
- **India-first** — portals (Naukri, LinkedIn India, Internshala, TimesJobs, Foundit), templates, and language tuned for the Indian recruiting context.
- **Try without card** — OTP-only preview at `/try`; paid Pro via SuperProfile with same-email fulfilment, optional ₹49 14-day full-Pro pass, monthly and annual plans (no auto-renew on us).
- **Whole stack in one place** — templates + editor + AI bullet generator + ATS score + PDF / DOCX export + shareable link. Single workflow, blank page to "Send".

## Proof (use honestly)

- On-site testimonials (home); product-truthful stats bar (templates, counts, no fake “#1” unless substantiated).
- Optional: case quotes with permission; never invent review counts.

## Voice

- Clear, encouraging, plain English; avoid hype and unverified superlatives.
- Prefer “apply,” “shortlist,” “recruiters,” “portals” over internal code names in customer-facing text.

## Primary CTAs

- **Public / top of funnel:** "Build my resume — Try" (`/try`) or "Get your resume link" (`/try`); secondary: templates, pricing.
- **Logged in, not Pro:** Lead to pricing with outcome language (PDF for applications, full template access), not "unlock feature."
- **Builder / dashboard:** Promote the **Share** action to publish the resume link; reinforce "update anytime — your link stays the same."

## Voice on ATS

ATS is a real product feature (ATS Score Checker, FAQ, blog), but the **general audience does not search for "ATS"**. Lead positioning with create / maintain / manage / share-as-a-link in user language. Only mention ATS in:

- Features grid card (kept).
- FAQ entries (kept).
- Blog posts targeting intent searches like "ATS-friendly resume" (kept).

Never lead the hero, page metadata, or social copy with ATS jargon.

## Tier naming (customer-facing)

- Align with product: **Try** = OTP preview session; **Basic** = signed-in free tier (if used in UI); **Pro** = paid via SuperProfile; **14-day pass** = India one-time full Pro window—never label it “Try” in the same breath as OTP Try.

Last updated: 2026-05-10 — repositioned around four user-language pillars (create / maintain / manage / share-as-a-link). ATS demoted from primary surfaces.
