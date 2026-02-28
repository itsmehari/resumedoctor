# Resumly – Complete Work Breakdown Structure (WBS)

**Project:** Zety-style Resume/CV Builder SaaS  
**Version:** 1.0  
**Last Updated:** 2026-02-27

**Completion Status:** Phases 1–3, 5 complete. Phases 4, 6–13 pending.

---

## WBS Overview

| WBS ID | Phase                            | Duration   | Dependencies |
| ------ | -------------------------------- | ---------- | ------------ |
| 1      | Project Setup & Infrastructure   | Week 1–2   | —            |
| 2      | Authentication & User Management | Week 2–3   | 1            |
| 3      | Resume Builder Core              | Week 4–8   | 2            |
| 4      | Template Engine                  | Week 6–9   | 3            |
| 5      | Export Engine (TXT/PDF/Word)     | Week 8–10  | 3, 4         |
| 6      | AI-Assisted Content              | Week 9–11  | 3            |
| 7      | ATS Checker & Resume Score       | Week 10–12 | 3, 5         |
| 8      | Cover Letter Builder             | Week 11–13 | 3, 4         |
| 9      | Job Matching (MVP-Lite)          | Week 12–14 | 2, 3         |
| 10     | Subscription & Payments          | Week 5–7   | 2            |
| 11     | Admin Dashboard & Analytics      | Week 13–15 | 2, 10        |
| 12     | Content Engine & SEO             | Week 3–14  | —            |
| 13     | Deployment & DevOps              | Week 2–15  | 1            |

---

## 1. Project Setup & Infrastructure

| ID  | Task                                            | Owner    | Effort | Deliverable                                    |
| --- | ----------------------------------------------- | -------- | ------ | ---------------------------------------------- |
| 1.1 | Initialize Next.js app with TypeScript (done)   | Frontend | 2h     | `package.json`, `tsconfig.json`, app structure |
| 1.2 | Configure ESLint, Prettier (Husky partial)      | DevOps   | 2h     | `.eslintrc`, `.prettierrc`, pre-commit hooks   |
| 1.3 | Set up PostgreSQL schema & migrations (done)    | Backend  | 4h     | Prisma/Drizzle schema, migration scripts       |
| 1.4 | Configure environment variables (.env.example) (done) | DevOps | 1h   | `.env.example` with all keys documented        |
| 1.5 | Set up monorepo or app structure (if multi-app) (done) | DevOps | 2h | Folder structure, workspace config             |
| 1.6 | Configure CI/CD pipeline (GitHub Actions) (done) | DevOps  | 4h     | `.github/workflows/` for test, build, deploy   |
| 1.7 | Set up file storage (S3/R2/Supabase)            | Backend  | 4h     | Bucket config, upload utilities                |
| 1.8 | Configure CDN for template assets               | DevOps   | 2h     | Cloudflare/CloudFront setup                    |

---

## 2. Authentication & User Management

| ID  | Task                                                 | Owner    | Effort | Deliverable                             |
| --- | ---------------------------------------------------- | -------- | ------ | --------------------------------------- |
| 2.1 | Implement auth (NextAuth.js / Clerk / Supabase Auth) (done) | Backend | 8h | Login, signup, OAuth (Google, LinkedIn) |
| 2.2 | User profile schema & API (done)                     | Backend  | 4h     | Profile CRUD, avatar upload             |
| 2.3 | Email verification flow (done)                       | Backend  | 4h     | Verify email, resend logic              |
| 2.4 | Password reset flow (done)                           | Backend  | 2h     | Forgot password, reset token            |
| 2.5 | Protected routes & middleware (done)                 | Frontend | 4h     | Auth guards, redirect logic             |
| 2.6 | Session management & refresh (done)                  | Backend  | 2h     | JWT/session handling                    |
| 2.7 | User settings page (profile edit) (done)             | Frontend | 4h     | Settings UI                             |

---

## 3. Resume Builder Core

| ID   | Task                                                            | Owner    | Effort | Deliverable                    |
| ---- | --------------------------------------------------------------- | -------- | ------ | ------------------------------ |
| 3.1  | Resume data model (sections, blocks, content) (done)            | Backend  | 6h     | DB schema, API types           |
| 3.2  | Resume CRUD API (create, read, update, delete) (done)           | Backend  | 8h     | REST/API routes                |
| 3.3  | Versioning system (resume versions) (done)                      | Backend  | 6h     | Version history, restore       |
| 3.4  | Auto-save (debounced save on edit) (done)                       | Frontend | 4h     | 2–3s debounce, optimistic UI   |
| 3.5  | Drag-and-drop section reordering (done)                         | Frontend | 6h     | DnD library, state sync        |
| 3.6  | Section types: Summary, Experience, Education, Skills, Projects (done) | Frontend | 8h | Section components, add/remove |
| 3.7  | Block-level editing (text, bullets, dates) (done)               | Frontend | 8h     | Rich text or structured inputs |
| 3.8  | Live preview panel (split view) (done)                          | Frontend | 6h     | Real-time preview component    |
| 3.9  | Resume list/dashboard (partial – list done, duplicate/delete UI pending)      | Frontend | 4h | List view, duplicate, delete   |
| 3.10 | Empty state & onboarding flow (done)                            | Frontend | 4h     | First-time UX                  |

---

## 4. Template Engine

| ID  | Task                                        | Owner           | Effort | Deliverable                             |
| --- | ------------------------------------------- | --------------- | ------ | --------------------------------------- |
| 4.1 | Template JSON schema definition             | Backend         | 4h     | Schema for sections, styling, fonts     |
| 4.2 | Design 5 Indian-style templates (MVP)       | Design          | 16h    | Professional, Fresher, Mid-career, etc. |
| 4.3 | Template renderer (JSON → React components) | Frontend        | 12h    | Dynamic section rendering               |
| 4.4 | Template selector UI                        | Frontend        | 4h     | Grid view, preview, apply               |
| 4.5 | Font & color customization per template     | Frontend        | 6h     | Theme variables, picker                 |
| 4.6 | Template versioning (template v1, v2)       | Backend         | 2h     | Template metadata                       |
| 4.7 | Scale to 10+ templates (Phase 2)            | Design+Frontend | 16h    | Additional templates                    |
| 4.8 | Template preview generation (thumbnails)    | Backend         | 4h     | Screenshot/thumbnail service            |

---

## 5. Export Engine (TXT/PDF/Word)

| ID  | Task                                       | Owner    | Effort | Deliverable                        |
| --- | ------------------------------------------ | -------- | ------ | ---------------------------------- |
| 5.1 | TXT export (plain text, free tier) (done)  | Backend  | 4h     | API + download                     |
| 5.2 | HTML export for preview (done)             | Frontend | 2h     | Print-friendly HTML                |
| 5.3 | PDF export (jsPDF + html2canvas) (done)    | Frontend | 12h    | Client-side PDF                    |
| 5.4 | DOCX export (docx lib) (done)              | Backend  | 8h     | Word document generation           |
| 5.5 | Export tier gating (free vs premium) (done)| Backend  | 2h     | Check subscription before PDF/Word |
| 5.6 | Watermark for free-tier previews (done)    | Frontend | 2h     | "Upgrade for PDF" overlay          |
| 5.7 | Export history / download tracking (done)  | Backend  | 2h     | Log exports for analytics          |

---

## 6. AI-Assisted Content

| ID  | Task                                       | Owner    | Effort | Deliverable                 |
| --- | ------------------------------------------ | -------- | ------ | --------------------------- |
| 6.1 | LLM API integration (OpenAI/Anthropic)     | Backend  | 4h     | Wrapper, env config         |
| 6.2 | "Rewrite bullet" prompt + API              | Backend  | 4h     | ATS-friendly rewrite        |
| 6.3 | "Suggest bullets for role" prompt + API    | Backend  | 4h     | Role-based suggestions      |
| 6.4 | "Improve summary" prompt + API             | Backend  | 2h     | Summary enhancement         |
| 6.5 | AI UI components (buttons, loading states) | Frontend | 4h     | Inline AI actions in editor |
| 6.6 | Response caching (Redis or DB)             | Backend  | 4h     | Reduce cost, latency        |
| 6.7 | Rate limiting per user tier                | Backend  | 2h     | Free: 5/day, Pro: 50/day    |
| 6.8 | Error handling & fallbacks                 | Frontend | 2h     | Graceful degradation        |

---

## 7. ATS Checker & Resume Score

| ID  | Task                                            | Owner    | Effort | Deliverable                     |
| --- | ----------------------------------------------- | -------- | ------ | ------------------------------- |
| 7.1 | PDF/text extraction utility                     | Backend  | 4h     | Parse resume content            |
| 7.2 | Rule-based checks (length, structure, keywords) | Backend  | 8h     | Score algorithm                 |
| 7.3 | Keyword density analysis                        | Backend  | 4h     | Skill/role keyword matching     |
| 7.4 | Score API (0–100 + suggestions)                 | Backend  | 4h     | REST endpoint                   |
| 7.5 | ATS score UI (progress bar, checklist)          | Frontend | 6h     | Visual feedback                 |
| 7.6 | Suggestions list (actionable items)             | Frontend | 4h     | "Add skills", "Shorten summary" |
| 7.7 | Gate ATS checker to Pro tier                    | Backend  | 1h     | Subscription check              |
| 7.8 | Cache score per resume version                  | Backend  | 2h     | Avoid re-compute                |

---

## 8. Cover Letter Builder

| ID  | Task                                           | Owner    | Effort | Deliverable                      |
| --- | ---------------------------------------------- | -------- | ------ | -------------------------------- |
| 8.1 | Cover letter data model                        | Backend  | 2h     | Linked to resume                 |
| 8.2 | Cover letter CRUD API                          | Backend  | 4h     | Create, edit, delete             |
| 8.3 | Cover letter editor UI                         | Frontend | 8h     | Text editor, company/role fields |
| 8.4 | AI "customize for job" (use resume + job desc) | Backend  | 6h     | Prompt + API                     |
| 8.5 | Cover letter templates (2–3)                   | Design   | 4h     | Match resume templates           |
| 8.6 | PDF/Word export for cover letters              | Backend  | 4h     | Reuse export engine              |
| 8.7 | Link cover letter to resume in dashboard       | Frontend | 2h     | Association UI                   |

---

## 9. Job Matching (MVP-Lite)

| ID  | Task                                          | Owner    | Effort | Deliverable            |
| --- | --------------------------------------------- | -------- | ------ | ---------------------- |
| 9.1 | Job data model (source, title, company, desc) | Backend  | 4h     | Schema                 |
| 9.2 | Job feed API (paginated)                      | Backend  | 4h     | List jobs, filters     |
| 9.3 | Keyword extraction from resume                | Backend  | 4h     | Skills, role, location |
| 9.4 | Simple matching (keyword overlap)             | Backend  | 6h     | Score jobs for user    |
| 9.5 | Job feed UI (list, card view)                 | Frontend | 6h     | Browse jobs            |
| 9.6 | "Applied" tracking (user marks applied)       | Backend  | 4h     | Track status           |
| 9.7 | Job source: manual curation or API partner    | Backend  | 8h     | Ingest jobs            |
| 9.8 | Location & role filters                       | Frontend | 4h     | Filter UI              |

---

## 10. Subscription & Payments

| ID   | Task                                        | Owner            | Effort | Deliverable              |
| ---- | ------------------------------------------- | ---------------- | ------ | ------------------------ |
| 10.1 | Stripe integration (done)                   | Backend          | 8h     | Payment gateway setup    |
| 10.2 | Plan schema (done)                          | Backend          | 2h     | DB + constants           |
| 10.3 | Checkout flow (done)                        | Backend+Frontend | 8h     | Create session, redirect |
| 10.4 | Webhook handling (done)                     | Backend          | 6h     | Update user subscription |
| 10.5 | Pricing page UI (done)                      | Frontend         | 4h     | Tiers, CTA, QR option    |
| 10.6 | Free trial (14-day, ₹1)                     | Backend          | 4h     | Trial logic, conversion  |
| 10.7 | One-time Resume Pack product                | Backend          | 4h     | Non-recurring purchase   |
| 10.8 | Subscription management (upgrade, cancel)   | Frontend         | 6h     | User dashboard           |
| 10.9 | Geotargeted pricing (INR vs USD)            | Backend          | 4h     | Price by country         |

---

## 11. Admin Dashboard & Analytics

| ID   | Task                                   | Owner    | Effort | Deliverable         |
| ---- | -------------------------------------- | -------- | ------ | ------------------- |
| 11.1 | Admin auth & role check                | Backend  | 4h     | Admin-only routes   |
| 11.2 | User count, active users, churn        | Backend  | 4h     | Analytics API       |
| 11.3 | Subscription metrics (MRR, conversion) | Backend  | 4h     | Billing analytics   |
| 11.4 | Template usage stats                   | Backend  | 2h     | Most used templates |
| 11.5 | Feature usage (AI, ATS, exports)       | Backend  | 4h     | Event tracking      |
| 11.6 | Admin dashboard UI                     | Frontend | 8h     | Charts, tables      |
| 11.7 | Export reports (CSV)                   | Backend  | 2h     | Download reports    |
| 11.8 | User search & impersonation (support)  | Backend  | 4h     | Admin tools         |

---

## 12. Content Engine & SEO

| ID   | Task                                           | Owner            | Effort | Deliverable               |
| ---- | ---------------------------------------------- | ---------------- | ------ | ------------------------- |
| 12.1 | Blog CMS (MDX / Headless CMS)                  | Backend          | 6h     | Blog structure            |
| 12.2 | 10 foundational articles (content plan)        | Content          | 20h    | SEO-optimized posts       |
| 12.3 | Resume examples library schema                 | Backend          | 2h     | Example entries           |
| 12.4 | 5–10 resume example pages                      | Content+Frontend | 12h    | Example pages + schema    |
| 12.5 | Sitemap generation                             | Backend          | 2h     | Auto sitemap              |
| 12.6 | Meta tags, OG, Twitter cards                   | Frontend         | 4h     | Per-page SEO              |
| 12.7 | Structured data (SoftwareApplication, Article) | Frontend         | 2h     | JSON-LD                   |
| 12.8 | Internal linking strategy                      | Content          | 4h     | Cross-link blog, examples |

---

## 13. Deployment & DevOps

| ID    | Task                                       | Owner  | Effort | Deliverable           |
| ----- | ------------------------------------------ | ------ | ------ | --------------------- |
| 13.1  | Production environment config              | DevOps | 4h     | Vercel/AWS/GCP setup  |
| 13.2  | Database provisioning (managed PostgreSQL) | DevOps | 2h     | Supabase/Neon/RDS     |
| 13.3  | Environment secrets (prod)                 | DevOps | 2h     | Secure secret storage |
| 13.4  | Domain & SSL                               | DevOps | 2h     | Custom domain, HTTPS  |
| 13.5  | CDN for static assets                      | DevOps | 2h     | Edge caching          |
| 13.6  | Logging & error tracking (Sentry)          | DevOps | 4h     | Error monitoring      |
| 13.7  | Uptime monitoring                          | DevOps | 2h     | Health checks         |
| 13.8  | Backup strategy (DB, files)                | DevOps | 4h     | Automated backups     |
| 13.9  | Staging environment                        | DevOps | 4h     | Preview deploys       |
| 13.10 | Rollback procedure documentation           | DevOps | 2h     | Runbook               |

---

## Dependency Graph (Critical Path)

```
1 (Setup) → 2 (Auth) → 3 (Builder) → 4 (Templates) → 5 (Export)
                      ↘ 10 (Payments) ↗
                      6 (AI) → 7 (ATS)
                      8 (Cover Letter)
                      9 (Job Match)
2 → 11 (Admin)
1 → 13 (Deployment)
12 (Content) — parallel
```

---

## Summary by Role

| Role         | Primary WBS IDs                                          | Approx. Hours |
| ------------ | -------------------------------------------------------- | ------------- |
| **Frontend** | 3, 4, 5 (client), 6 (UI), 7 (UI), 8, 9, 10 (UI), 11 (UI) | ~120h         |
| **Backend**  | 2, 3, 4, 5, 6, 7, 8, 9, 10, 11                           | ~100h         |
| **DevOps**   | 1, 13                                                    | ~35h          |
| **Design**   | 4 (templates), 8 (templates)                             | ~24h          |
| **Content**  | 12                                                       | ~42h          |

---

_Use this WBS with Cursor agents by assigning tasks via PRD role-specific sections._
