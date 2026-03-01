# NEW SEO – Phased Implementation Plan

**Goal:** Be cited. Be trusted. Be chosen.  
**Framework:** GEO → AEO → AIO → SXO  

---

## Phase 1: Credibility & Trust (Week 1) ✅

**Focus:** Evidence-based trust, E-E-A-T, Review schema

| Task | File(s) | Status |
|------|---------|--------|
| Add AggregateRating + Review schema | `src/components/seo/json-ld.tsx` | ✅ |
| Create About page with E-E-A-T | `src/app/about/page.tsx` | ✅ |
| Add structured trust bar with schema | `src/components/trust-bar.tsx` | ✅ |
| Replace vague claims with evidence-backed copy | Home, Pricing | ✅ |
| Add Organization sameAs (social proof) | `json-ld.tsx` | ✅ |

---

## Phase 2: Content Foundation (Week 2) ✅

**Focus:** Expertise content, content clusters, blog

| Task | File(s) | Status |
|------|---------|--------|
| Create blog route structure | `src/app/blog/` | ✅ |
| Add first foundational article (ATS Guide) | `content/blog/` | ✅ |
| Article schema (JSON-LD) per post | `src/app/blog/[slug]/` | ✅ |
| Blog index + sitemap inclusion | `sitemap.ts` | ✅ |
| Internal links blog ↔ app | Footer, Home | ✅ |

---

## Phase 3: AIO – AI Integration (Week 3) ✅

**Focus:** Structured data for AI tools & workflows

| Task | File(s) | Status |
|------|---------|--------|
| `/api/structured-data` – machine-readable site info | `src/app/api/structured-data/route.ts` | ✅ |
| Well-documented JSON responses for RAG/embedding | API route | ✅ |
| `/.well-known/ai-plugin.json` or similar (optional) | `public/well-known/` | ✅ |

---

## Phase 4: SXO – Search Experience (Week 4) ✅

**Focus:** UX, trust, conversion alignment

| Task | File(s) | Status |
|------|---------|--------|
| Trust badges component with schema | `src/components/trust-badges.tsx` | ✅ |
| Clear conversion paths (primary CTA per section) | Home, Pricing | ✅ |
| Social proof section (testimonials placeholder) | Home | ✅ |
| Add noindex for low-value auth pages | login, signup layouts | 🔲 |

---

## Deployment

| Step | Command / Action |
|------|------------------|
| Build | `npm run build` |
| Deploy (Cloudflare) | `npm run deploy` (or push to Git → Cloudflare auto-deploy) |
| Verify | `https://resumedoctor.in/sitemap.xml`, `/robots.txt`, `/api/structured-data` |

**To update live site:** Push to `main`; if Cloudflare Workers is connected to GitHub, it will build and deploy automatically. Or run `npm run deploy` locally (requires Wrangler auth).

---

## Success Metrics

- **GEO:** Content cited in ChatGPT/Perplexity for "resume builder India"
- **AEO:** FAQ/HowTo appear in AI summaries
- **AIO:** API consumable by AI tools
- **SXO:** Higher conversion, lower bounce, clear trust signals
