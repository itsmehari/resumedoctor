# ResumeDoctor – Comprehensive SEO, GEO & AEO Audit Report

**Website:** ResumeDoctor (resumedoctor.in)  
**Framework:** Next.js 14 (App Router)  
**Audit Date:** March 1, 2026  
**Auditor:** Expert SEO & Webmaster Review  

---

## Executive Summary

| Category | Score | Status |
|----------|-------|--------|
| **Traditional SEO** | 32/100 | Needs immediate action |
| **GEO (Generative Engine Optimization)** | 18/100 | Critical gaps |
| **AEO (Answer Engine Optimization)** | 15/100 | Critical gaps |
| **Marketing Pages** | Partial | Present but underoptimized |

ResumeDoctor has basic structural foundations (semantic HTML, decent headings) but lacks core technical SEO, structured data, social metadata, and content optimized for generative/AI search. Most pages share root-level metadata; marketing pages exist but are not fully optimized for discovery or conversion.

---

## Table of Contents

1. [Page Inventory & Classification](#1-page-inventory--classification)
2. [Traditional SEO Audit](#2-traditional-seo-audit)
3. [Per-Page SEO Analysis](#3-per-page-seo-analysis)
4. [GEO (Generative Engine Optimization) Audit](#4-geo-generative-engine-optimization-audit)
5. [AEO (Answer Engine Optimization) Audit](#5-aeo-answer-engine-optimization-audit)
6. [Marketing Pages Review](#6-marketing-pages-review)
7. [Technical SEO Checklist](#7-technical-seo-checklist)
8. [Prioritized Recommendations](#8-prioritized-recommendations)

---

## 1. Page Inventory & Classification

### Public Pages (Indexable)

| Route | Type | Marketing | Metadata | Auth |
|-------|------|-----------|----------|------|
| `/` | Static | **Yes** (Landing) | Root only | No |
| `/pricing` | Client | **Yes** | None (client) | No |
| `/templates` | Static | **Yes** | None | No |
| `/try` | Client | **Yes** (Trial CTA) | None | No |
| `/try/templates` | Client | **Yes** | None | Trial cookie |
| `/terms` | Static | No (Legal) | Yes | No |
| `/privacy` | Static | No (Legal) | Yes | No |
| `/login` | Client | Conversion | None | No |
| `/signup` | Client | Conversion | None | No |
| `/forgot-password` | Client | No | None | No |
| `/reset-password` | Dynamic | No | None | No |
| `/verify-email` | Dynamic | No | None | No |

### Protected/App Pages (Low SEO priority)

| Route | Type | Indexable |
|-------|------|-----------|
| `/dashboard` | Client | No (user-specific) |
| `/settings` | Client | No |
| `/resumes/new` | Redirect | No |
| `/resumes/[id]/edit` | Dynamic | No |

---

## 2. Traditional SEO Audit

### 2.1 Meta Tags & Titles

| Criterion | Status | Notes |
|-----------|--------|-------|
| Unique `<title>` per page | Partial | Root: 56 chars ✓. Terms, Privacy have custom titles ✓. All others use root (or none). |
| Title length (50–60 chars) | Partial | Root: 56 chars ✓. Others missing or generic. |
| Meta description per page | Partial | Root: ~70 chars (short). Terms/Privacy: generic, <100 chars. Others: none. |
| Description length (150–160 chars) | Fail | Descriptions too short for SERP. |
| Meta keywords | Present | Root only; low impact for Google (ignored) but used by some engines. |
| Canonical URLs | **Missing** | No canonical tags anywhere. |

### 2.2 Open Graph (Social Sharing)

| Tag | Status |
|-----|--------|
| `og:title` | Partial (root only) |
| `og:description` | Partial (root only) |
| `og:type` | Yes (website) |
| `og:image` | **Missing** |
| `og:url` | **Missing** |
| `og:site_name` | **Missing** |
| `og:locale` | **Missing** |

### 2.3 Twitter Cards

| Tag | Status |
|-----|--------|
| `twitter:card` | **Missing** |
| `twitter:title` | **Missing** |
| `twitter:description` | **Missing** |
| `twitter:image` | **Missing** |

### 2.4 Structured Data (JSON-LD / Schema.org)

| Schema | Status |
|--------|--------|
| `SoftwareApplication` | **Not implemented** |
| `Organization` | **Not implemented** |
| `WebSite` | **Not implemented** |
| `BreadcrumbList` | **Not implemented** |
| `Article` (blog) | N/A (no blog) |
| `FAQPage` | **Not implemented** |
| `Product` / `Offer` (pricing) | **Not implemented** |

### 2.5 Technical Foundations

| Item | Status |
|------|--------|
| `lang` on `<html>` | Yes (`lang="en"`) |
| Semantic HTML (header, main, section, footer) | Yes – good structure |
| H1 per page | Yes – single H1 on each |
| H2/H3 hierarchy | Good on home, terms, privacy |
| Mobile-friendly | Yes (Tailwind responsive) |
| Favicon | **Missing** (no favicon in `/public`) |
| Sitemap | **Missing** (no sitemap.xml) |
| robots.txt | **Missing** |

---

## 3. Per-Page SEO Analysis

### 3.1 Home (`/`)

| Element | Current | Recommendation |
|---------|---------|----------------|
| Title | ResumeDoctor – Professional Resume & CV Builder \| India | Keep; 56 chars ✓ |
| Description | Create ATS-friendly resumes and CVs in minutes… | Expand to 150–160 chars with CTA |
| H1 | Build a Resume That Lands Your Dream Job | Strong, keyword-rich ✓ |
| Content | Hero, trust bar, templates, features, CTA | Add FAQ block for AEO |
| Schema | None | Add `WebSite`, `SoftwareApplication`, `Organization` |
| OG/Twitter | Minimal / None | Add `og:image` (1200×630), `og:url`, Twitter cards |
| Canonical | None | Add `https://resumedoctor.in/` |

**SEO Score: 5/10**

---

### 3.2 Pricing (`/pricing`)

| Element | Current | Recommendation |
|---------|---------|----------------|
| Title | Root (generic) | "Pricing – ResumeDoctor \| Free & Pro Plans" |
| Description | None | "Compare Free and Pro plans. ₹0 forever or ₹199/mo for PDF & Word export." |
| Metadata | None (client component) | Use layout.tsx or generateMetadata |
| H1 | Simple, transparent pricing | ✓ |
| Schema | None | Add `Product` / `Offer` for Free & Pro |
| Content | Tiers, QR checkout | Add FAQ: "Is there a free plan?", "How do I pay?" |
| OG | None | Page-specific OG for sharing |

**SEO Score: 3/10**

---

### 3.3 Templates (`/templates`)

| Element | Current | Recommendation |
|---------|---------|----------------|
| Title | Root (generic) | "Resume Templates – ResumeDoctor \| ATS-Friendly Designs" |
| Description | None | "Choose from professional, ATS-friendly resume templates." |
| Content | "Coming soon" placeholder | Add short copy; consider `noindex` until live |
| H1 | Resume Templates | ✓ |

**SEO Score: 2/10** (Placeholder page – consider `noindex` until ready)

---

### 3.4 Try Free (`/try`)

| Element | Current | Recommendation |
|---------|---------|----------------|
| Title | Root (generic) | "Try ResumeDoctor Free – No Signup, 5 Min Trial" |
| Description | None | "Build a resume in 5 minutes. No signup. No credit card." |
| H1 | Try ResumeDoctor Free | ✓ |
| Content | Email/OTP flow | Minimal crawlable content; ensure meta is strong |

**SEO Score: 3/10**

---

### 3.5 Terms of Service (`/terms`)

| Element | Current | Recommendation |
|---------|---------|----------------|
| Title | Terms of Service – ResumeDoctor | ✓ |
| Description | Generic | Expand to 150 chars: "Read the terms of service for ResumeDoctor resume builder." |
| Content | Structured sections | ✓ Good for legal clarity |
| Schema | None | Consider `WebPage` for legal pages |

**SEO Score: 6/10**

---

### 3.6 Privacy Policy (`/privacy`)

| Element | Current | Recommendation |
|---------|---------|----------------|
| Title | Privacy Policy – ResumeDoctor | ✓ |
| Description | Generic | Expand to 150 chars |
| Content | Structured | ✓ |
| Schema | None | `WebPage` optional |

**SEO Score: 6/10**

---

### 3.7 Login / Signup / Forgot Password

| Element | Current | Recommendation |
|---------|---------|----------------|
| Metadata | None | Add unique titles (e.g. "Sign In – ResumeDoctor") |
| Indexability | Indexed | Consider `noindex` for auth flows (low SEO value) |
| Canonical | None | Add where applicable |

**SEO Score: 2/10** (Low priority; consider `noindex`)

---

## 4. GEO (Generative Engine Optimization) Audit

GEO optimizes for AI-powered search (ChatGPT, Perplexity, Gemini, Bing Chat, etc.) that summarizes and cites sources.

### 4.1 Content Signals for GEO

| Signal | Status | Notes |
|--------|--------|-------|
| **Authoritative, citable content** | Weak | No blog, no long-form guides |
| **Clear answers to common questions** | Weak | No FAQ schema; no Q&A blocks |
| **Structured, scannable content** | Partial | Good H2/H3 on home, terms, privacy |
| **Entity-rich content** | Weak | Limited mentions of product, features, India |
| **E-E-A-T (Experience, Expertise, Authoritativeness, Trust)** | Weak | No author info, no blog, minimal trust signals |
| **Citation-worthy statistics** | Missing | No "Rated by X users" or concrete numbers |
| **Definitional content** | Missing | No "What is ATS?", "What is a CV?" style content |

### 4.2 GEO Checklist

| Recommendation | Status |
|----------------|--------|
| Add FAQ section with schema | Not implemented |
| Add HowTo schema for "How to create a resume" | Not implemented |
| Publish blog with expert content | Not implemented |
| Add "About" / company story | Minimal |
| Add testimonials / reviews (with schema) | Not implemented |
| Add clear, quoted statistics | Placeholder text only |
| Optimize for long-tail questions | No content targeting "How do I…", "What is…" |

### 4.3 GEO Score: **18/100**

**Key Gap:** No content engine. AI search prefers authoritative, in-depth content; ResumeDoctor relies on a single landing page and a few app flows.

---

## 5. AEO (Answer Engine Optimization) Audit

AEO targets featured snippets, voice search, and direct answers in SERPs.

### 5.1 Featured Snippet Readiness

| Snippet Type | Content | Status |
|--------------|---------|--------|
| Paragraph | No clear, concise definitions | Missing |
| List | Feature bullets exist; no schema | Partial |
| Table | No comparison tables (e.g. Free vs Pro) | Missing |
| FAQ | No FAQ block or schema | Missing |
| HowTo | No step-by-step guides | Missing |

### 5.2 Voice Search Optimization

| Criterion | Status |
|-----------|--------|
| Conversational queries | No content targeting "How can I…", "Where do I…" |
| Question-based headings | Minimal (e.g. "Why Choose ResumeDoctor?" ✓) |
| Featured snippet potential | Low – no structured Q&A |
| Local intent ("resume builder India") | Partial – "India" in title |

### 5.3 AEO Checklist

| Item | Status |
|------|--------|
| FAQ schema | Not implemented |
| HowTo schema | Not implemented |
| Definition lists | Not implemented |
| Comparison tables | Not implemented |
| Clear, direct answers in first 50 words | Partial on home |
| Question headings (H2/H3) | Minimal |

### 5.4 AEO Score: **15/100**

**Key Gap:** No structured Q&A or HowTo content; little optimized for featured snippets or voice.

---

## 6. Marketing Pages Review

### 6.1 Marketing Pages Present

| Page | Purpose | Conversion Path |
|------|---------|-----------------|
| **Home** | Primary landing | CTA → /try, /resumes/new |
| **Pricing** | Free vs Pro comparison | CTA → QR/checkout, upgrade |
| **Templates** | Template showcase | CTA → /templates (coming soon) |
| **Try** | Free trial entry | Email → OTP → /try/templates |

### 6.2 Marketing Page Gaps

| Gap | Impact |
|-----|--------|
| No dedicated "Features" page | Missed long-tail "resume builder features" |
| No "About" / "Why ResumeDoctor" | Weak E-E-A-T for GEO |
| No testimonials / social proof page | Lower trust, weaker conversion |
| No blog | No SEO long-tail, no GEO citations |
| Footer lacks Pricing, Templates, Try | Poor internal linking for discovery |
| No UTM / tracking structure noted | Harder to attribute traffic |

### 6.3 Footer & Internal Linking

- **Footer:** Privacy, Terms only. Missing: Pricing, Templates, Try, Blog (when exists).
- **Header:** Varies by page; home has Try, Create; pricing has Dashboard, Back.
- **Cross-links:** Limited between marketing pages.

---

## 7. Technical SEO Checklist

| Item | Status |
|------|--------|
| Sitemap (`/sitemap.xml`) | ❌ Missing |
| robots.txt | ❌ Missing |
| Favicon | ❌ Missing |
| og:image (1200×630) | ❌ Missing |
| Canonical URLs | ❌ Missing |
| `hreflang` (if multi-locale) | N/A (en only) |
| Page speed (LCP, FID, CLS) | Not audited – assume OK (Next.js) |
| HTTPS | Assumed (production) |
| Mobile responsiveness | ✓ Yes |
| No broken links | Not audited |
| `checkout-qr.png` fallback | Referenced; may 404 if not in `/public` |

---

## 8. Prioritized Recommendations

### P0 – Immediate (Week 1)

1. **Add `sitemap.ts`** – Generate `/sitemap.xml` with all public URLs (home, pricing, templates, try, terms, privacy).
2. **Add `robots.ts`** – Allow crawling; link to sitemap.
3. **Add favicon** – Place in `/public` (favicon.ico, apple-touch-icon).
4. **Add default `og:image`** – 1200×630 image in `/public`, referenced in root layout metadata.
5. **Add canonical URLs** – Use `metadataBase` + `alternates.canonical` per page.

### P1 – Short-term (Weeks 2–3)

6. **Page-level metadata** – Unique title + description for: Home, Pricing, Templates, Try, Login, Signup.
7. **Open Graph completion** – `og:image`, `og:url`, `og:site_name`, `og:locale`.
8. **Twitter cards** – `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
9. **JSON-LD: `SoftwareApplication`** – On home; include name, description, applicationCategory, offers.
10. **JSON-LD: `Organization`** – On home; include name, url, logo.

### P2 – GEO/AEO (Weeks 4–6)

11. **FAQ section on home** – 5–7 questions (e.g. "What is ResumeDoctor?", "Is there a free plan?") with `FAQPage` schema.
12. **FAQ on pricing** – "How do I pay?", "What's included in Pro?" with schema.
13. **HowTo schema** – "How to create a resume in 5 minutes" (can be on home or a simple guide page).
14. **Product/Offer schema** – On pricing for Free and Pro tiers.
15. **Footer links** – Add Pricing, Templates, Try to footer.

### P3 – Content & Growth (Ongoing)

16. **Blog** – Implement blog (WBS 12.1); publish 10 foundational articles.
17. **Resume examples** – 5–10 example pages with schema.
18. **About page** – Company story, team, mission for E-E-A-T.
19. **Testimonials** – With `Review` schema if feasible.
20. **`noindex` for auth pages** – Login, signup, forgot-password, reset-password, verify-email (optional).

---

## Appendix A: Sample Metadata for Key Pages

```ts
// Home
{ title: "ResumeDoctor – Professional Resume & CV Builder | India", description: "Create ATS-friendly resumes in minutes. India-first. Free to start. Export to PDF & Word. Trusted by job seekers across Naukri, LinkedIn, Indeed." }

// Pricing
{ title: "Pricing – ResumeDoctor | Free & Pro Plans", description: "Free forever or ₹199/mo for PDF & Word export. Pay via UPI. No hidden fees." }

// Templates
{ title: "Resume Templates – ResumeDoctor | ATS-Friendly Designs", description: "Choose from professional resume templates. Modern, clean, ATS-optimized for the Indian job market." }

// Try
{ title: "Try ResumeDoctor Free – No Signup, 5 Min Trial", description: "Build a professional resume in 5 minutes. No signup. No credit card. Try free with just your email." }
```

---

## Appendix B: Sample JSON-LD (SoftwareApplication)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ResumeDoctor",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Create ATS-friendly resumes and CVs in minutes. India-first resume builder with premium templates and export to PDF.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "url": "https://resumedoctor.in"
}
```

---

## Appendix C: Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/sitemap.ts` | Create – dynamic sitemap |
| `src/app/robots.ts` | Create – robots.txt |
| `src/app/layout.tsx` | Modify – metadataBase, og:image, twitter |
| `public/favicon.ico` | Add |
| `public/og-image.png` | Add (1200×630) |
| `src/app/page.tsx` | Modify – add FAQ section, JSON-LD |
| `src/app/pricing/page.tsx` | Modify – layout with metadata, or layout.tsx |
| `src/app/pricing/layout.tsx` | Create – metadata for pricing |
| `src/app/templates/page.tsx` | Modify – add metadata export |
| `src/app/try/page.tsx` | Modify – add layout with metadata |
| `src/components/footer.tsx` | Modify – add Pricing, Templates, Try links |

---

**Report generated for ResumeDoctor (resumedoctor.in). Align with WBS 12.5, 12.6, 12.7 for implementation.**
