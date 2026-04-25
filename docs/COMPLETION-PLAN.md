# Zesty / ResumeDoctor – Completion Plan & Tracker

**Version:** 1.0  
**Created:** 2026-03-04  
**Purpose:** Track completion of in-progress WBS tasks and Full Template Engine.  
**Usage:** Tick `[ ]` → `[x]` as each item is implemented.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[x]` | Completed |
| WBS | Work Breakdown Structure ID |
| PRD | Product Requirements Document reference |

---

## Part A: In-Progress Tasks

### Phase 6 – AI-Assisted Content

| Done | WBS | PRD | Task | Effort | Deliverables |
|------|-----|-----|------|--------|--------------|
| [x] | 6.6 | Backend § AI | Response caching (Redis or DB) | 4h | Cache by `hash(text + action)` for 24h; `AiResponseCache` table or Redis |
| [x] | 6.7 | Backend § AI | Rate limiting per user tier | 2h | Free: 5/day, Pro: 50/day; `AiUsageLog` table or daily counter; 429 with `code: "RATE_LIMITED"` |
| [x] | 6.8 | Frontend § AI | Error handling & fallbacks | 2h | Toast/notification component; retry button; "Upgrade" when rate limited |
| [x] | 6.8 | Frontend § AI | Graceful degradation on AI failure | 1h | Manual edit suggestions fallback when AI fails |

---

### Phase 10 – Subscription & Payments

| Done | WBS | PRD | Task | Effort | Deliverables |
|------|-----|-----|------|--------|--------------|
| [x] | 10.6 | Backend § Payments | 14-day trial (₹1) activation flow | 4h | Self-serve verify page OR document manual flow; admin/manual activation |
| [x] | 10.7 | Backend § Payments | One-time Resume Pack product | 4h | E.g. 5 PDF exports for ₹99; Stripe/UPI; DB flag or one-time token |
| [x] | 10.8 | Frontend § Payments | Subscription management (upgrade, cancel) | 6h | Stripe Customer Portal link OR cancel request UI; store `stripeCustomerId` |

---

### Phase 11 – Admin Dashboard

| Done | WBS | PRD | Task | Effort | Deliverables |
|------|-----|-----|------|--------|--------------|
| [x] | 11.4 | Backend § Admin | Template usage stats in admin | 1h | Ensure template usage chart/table visible in admin analytics |
| [x] | 11.5 | Backend § Admin | Feature usage (AI, ATS, exports) | 2h | Add `FeatureUsageLog` or extend; track AI calls, ATS runs, exports |
| [x] | 11.8 | Backend § Admin | User search & impersonation | 4h | Search by email; "View as user" with expiring token; impersonation middleware |

---

## Part B: Full Template Engine (Phase 4)

### Template Engine Core

| Done | WBS | PRD | Task | Effort | Deliverables |
|------|-----|-----|------|--------|--------------|
| [x] | 4.1 | Backend § Templates | Template JSON schema (extend) | 1h | Add `sectionOrder`, `sidebarSections`, `layoutType` to `TemplateMetadata` |
| [x] | 4.3 | Frontend § Templates | Template renderer – JSON-driven layout | 12h | `resume-preview.tsx` computes layout from metadata; support single, two-column, header-split |
| [x] | 4.6 | Backend § Templates | Template versioning | 2h | `templateVersion` field; migration logic for legacy templates |
| [x] | 4.8 | Backend + Frontend | Template preview thumbnails | 4h | Build script or static PNGs; `thumbnailUrl` in metadata; use in selector UI |

---

### Template Thumbnails (4.8) – Sub-tasks

| Done | Step | Description | Output |
|------|------|-------------|--------|
| [x] | 4.8a | Create sample content fixture for each template | `DEMO_RESUME_CONTENT` in types/resume.ts; used in `/dev/preview/[templateId]` |
| [x] | 4.8b | Build script (Puppeteer/Playwright) to render & capture | `scripts/generate-thumbnails.mjs` |
| [x] | 4.8c | Save thumbnails to `/public/templates/thumbnails/` | Static assets (run `npm run thumbnails` with dev server) |
| [x] | 4.8d | Add `thumbnailUrl` to template metadata | `types/template.ts`; API returns `/templates/thumbnails/{id}.png` |
| [x] | 4.8e | Display thumbnails in template selector | `templates/page.tsx`, `try/templates/page.tsx` (img with fallback) |

---

### Template Renderer (4.3) – Sub-tasks

| Done | Step | Description | Output |
|------|------|-------------|--------|
| [x] | 4.3a | Extend `TemplateMetadata` with layout config | `types/template.ts` |
| [x] | 4.3b | Update `lib/templates.ts` with layout for all templates | Enfold has `sidebarSections`; `getSidebarSections()` in template-styles |
| [x] | 4.3c | Refactor `resume-preview.tsx` to use layout from metadata | Dynamic section order, sidebar split |
| [x] | 4.3d | Add layout variants: `single`, `two-column`, `header-split` | Layout components (two-column via grid) |
| [x] | 4.3e | Ensure export (PDF, DOCX) uses same layout logic | Export uses `resume-preview` / same layout |

---

## Part C: Quick Wins (Phase 1)

| Done | WBS | Task | Effort |
|------|-----|------|--------|
| [x] | 6.7 | AI rate limiting – DB table + checks | 2h |
| [x] | 6.8 | AI error handling – Toast + retry | 2h |
| [x] | 11.4 | Template usage stats in admin UI | 1h |
| [x] | 4.6 | Template versioning | 2h |

---

## Part D: Already Complete (WBS Update Only)

| Done | WBS | Task | Notes |
|------|-----|------|-------|
| [x] | 3.9 | Resume dashboard duplicate/delete UI | Implemented; update WBS status only |
| [x] | 4.2 | 30 Indian-style templates | In `lib/templates.ts` |
| [x] | 4.4 | Template selector UI | Dropdown + grid |
| [x] | 4.5 | Font & color customization | Customize dialog |
| [x] | 7.1–7.8 | ATS checker (full) | API + UI + cache + Pro gate |
| [x] | 8.1–8.7 | Cover letter builder (full) | Model, API, editor, AI customize, export |
| [x] | 10.9 | Geotargeted pricing (INR/USD) | `/api/pricing/region` |

---

## Implementation Order (Recommended)

### Phase 1 – Quick Wins (~1–2 days) ✓ DONE
- [x] 6.7 AI rate limiting
- [x] 6.8 AI error handling
- [x] 11.4 Template usage in admin
- [x] 4.6 Template versioning

### Phase 2 – Template Engine (~2–3 days) ✓ DONE
- [x] 4.1 Extend template schema
- [x] 4.3 Template renderer (JSON-driven)
- [x] 4.8 Template thumbnails

### Phase 3 – Subscription & Admin (~2–3 days) ✓ DONE
- [x] 10.8 Subscription management
- [x] 10.6 Trial activation flow
- [x] 11.8 User impersonation

### Phase 4 – Optional (~2 days)
- [ ] 6.6 AI response caching
- [x] 10.7 One-time Resume Pack
- [ ] 11.5 Feature usage tracking

---

## Effort Summary

| Category | Tasks | Est. Hours |
|----------|-------|------------|
| AI (6.6–6.8) | 4 | ~9h |
| Subscription (10.6–10.8) | 3 | ~14h |
| Admin (11.4, 11.5, 11.8) | 3 | ~7h |
| Template Engine (4.1, 4.3, 4.6, 4.8) | 4 | ~19h |
| **Total (core)** | 14 | ~49h |
| Optional (6.6, 10.7, 11.5) | 3 | ~10h |

---

## Key File References

| Area | Primary Files |
|------|---------------|
| AI | `prisma/schema.prisma`, `src/app/api/resumes/[id]/ai/*/route.ts`, `src/lib/ai-client.ts` |
| Template | `src/types/template.ts`, `src/lib/templates.ts`, `src/lib/template-styles.ts`, `src/components/resume-builder/resume-preview.tsx` |
| Thumbnails | `scripts/`, `public/templates/`, `src/app/templates/page.tsx` |
| Subscription | `src/app/settings/`, `src/app/pricing/`, `src/app/api/pricing/` |
| Admin | `src/app/admin/`, `src/app/api/admin/` |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-04 | Initial plan created |
| 2026-03-04 | Phase 1 complete: 6.7 AI rate limit, 6.8 Toast + retry, 11.4 Template stats, 4.6 Template versioning |
| 2026-03-04 | Phase 2 & 3: 4.1 Template schema (layoutType, sidebarSections), 4.3 JSON-driven renderer (two-column Enfold), 4.8 Thumbnails (script, metadata, selector UI), 10.6 Trial activation, 10.7 Resume Pack, 11.8 Impersonation |
| 2026-03-05 | 6.6 AI response caching (AiResponseCache DB table + SHA256 hash, 24h TTL) |
| 2026-03-05 | 6.8 Graceful degradation: manual writing tips fallback in SummaryEditor + ExperienceEditor on AI failure/503 |
| 2026-03-05 | 11.5 FeatureUsageLog DB table; tracking added to all AI routes, ATS route, PDF/DOCX/TXT export routes |
| 2026-03-05 | Admin analytics API extended: featureUsage.last30Days, aiLast30Days (total + byAction), atsLast30Days |
| 2026-03-05 | Phase 9 Job Matching MVP: Job + JobApplication schema, /api/jobs feed (paginated, filtered, keyword-scored), /api/jobs/[id]/apply (save/status tracking), /api/jobs/applications, /app/jobs UI (browse + my applications), seed script (12 Indian jobs), Jobs nav link in dashboard |
| 2026-03-05 | Phase 12 Content: 5 new blog articles (professional summary, skills section, career gaps, resume formats, Naukri/LinkedIn tips) = 10 total; JSON-LD HowTo + Article schema added to examples/[slug] pages; richer Article schema on blog posts |
| 2026-03-05 | Phase 13 DevOps: @sentry/nextjs installed; sentry.client/server/edge.config.ts; next.config.js wrapped with withSentryConfig; CI workflow updated for Sentry release + source map upload; db-backup.yml GitHub Action (daily pg_dump → S3/R2, 30-day retention); health check /api/health enhanced with status/version/timestamp; .env.example updated |
| 2026-03-17 | Todo 12 & 13 executed: 10 examples (HR Manager, Product Manager), 12 blog posts (checklist, tailor resume), ItemList/HowTo/BreadcrumbList JSON-LD, content-links.ts, blog↔examples internal linking; topic-based related articles (BLOG_TO_BLOG) |
