# ResumeDoctor – Product Requirements Document (Role-Based for Cursor Agents)

**Product:** Zety-style Resume/CV Builder SaaS  
**Version:** 1.0  
**Last Updated:** 2026-02-27

---

## How to Use This PRD

This document is structured for **Cursor AI agents** working in different roles. Each agent should:

1. **Identify their role** (Frontend, Backend, DevOps, Design, Content)
2. **Read their role section** for context, priorities, and tasks
3. **Reference WBS IDs** from `WBS-WORK-BREAKDOWN-STRUCTURE.md` for task details
4. **Check dependencies** before starting (some tasks block others)
5. **Follow acceptance criteria** for each deliverable

---

## Role Index

| Role | Primary Focus | WBS Reference |
|------|---------------|---------------|
| **Frontend Agent** | UI, React components, user flows | 3, 4, 5 (client), 6 (UI), 7 (UI), 8, 9, 10 (UI), 11 (UI) |
| **Backend Agent** | API, DB, auth, integrations | 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 |
| **DevOps Agent** | Setup, CI/CD, deployment, infra | 1, 13 |
| **Design Agent** | Templates, visuals, UX | 4 (templates), 8 (templates) |
| **Content Agent** | Blog, SEO, resume examples | 12 |
| **Full-Stack Agent** | End-to-end features | Any (when integrating) |

---

# FRONTEND AGENT

## Scope

Build all user-facing UI: resume builder, templates, export flows, AI actions, subscription, admin dashboard.

## Tech Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, Radix UI
- @dnd-kit for drag-and-drop
- TanStack Query for data fetching
- NextAuth for auth state

## Priorities (Order of Work)

1. **Auth UI** (WBS 2.5, 2.7) (done) – Login, signup, protected routes, settings
2. **Resume Builder Core** (WBS 3) (done) – Editor, preview, sections, auto-save
3. **Template Engine UI** (WBS 4.3–4.5) – Renderer, selector, customization
4. **Export UI** (WBS 5.2, 5.6) – Download buttons, tier gating, watermarks
5. **AI UI** (WBS 6.5, 6.8) – Inline AI buttons, loading, errors
6. **ATS Score UI** (WBS 7.5, 7.6) – Score display, suggestions list
7. **Cover Letter UI** (WBS 8.3, 8.7)
8. **Job Feed UI** (WBS 9.5, 9.8)
9. **Pricing & Checkout UI** (WBS 10.5, 10.8)
10. **Admin Dashboard** (WBS 11.6)

## Key Tasks & Acceptance Criteria

### Task: Resume Builder Layout (WBS 3.5, 3.8) (done)

| Criteria | Detail |
|----------|--------|
| Layout | Split view: left = editor, right = live preview |
| Responsive | Stack vertically on mobile; editor first |
| DnD | Sections reorderable via drag; persist order |
| Auto-save | Debounce 2–3s; show "Saving..." / "Saved" |
| Empty state | CTA to add first section |

### Task: Template Selector (WBS 4.4)

| Criteria | Detail |
|----------|--------|
| Grid | 2–3 columns on desktop, 1 on mobile |
| Preview | Thumbnail or small preview per template |
| Apply | Click applies template; preserves content where possible |
| Free vs Pro | Lock icon on Pro templates; show upgrade CTA |

### Task: Export Gating (WBS 5.6)

| Criteria | Detail |
|----------|--------|
| Free | TXT + web preview only; "Upgrade for PDF" on PDF button |
| Pro | PDF, Word, all formats enabled |
| Watermark | Optional "ResumeDoctor" or "Upgrade" on free PDF preview |

### Task: AI Inline Actions (WBS 6.5)

| Criteria | Detail |
|----------|--------|
| Placement | Per bullet/section: "Improve with AI" button |
| Loading | Spinner + disabled state during request |
| Error | Toast/message if API fails; retry option |
| Result | Replace or append based on action |

## File Conventions

- Components: `src/components/[feature]/`
- Pages: `src/app/[route]/page.tsx`
- Hooks: `src/hooks/`
- Use `kebab-case` for file names

## Dependencies

- Backend APIs must exist for: auth, resumes CRUD, templates, export, AI, ATS score
- Design Agent must provide template designs for WBS 4

---

# BACKEND AGENT

## Scope

API routes, database schema, business logic, integrations (auth, payments, AI, storage).

## Tech Stack

- Next.js API routes or standalone Node
- Prisma + PostgreSQL
- NextAuth
- Stripe
- OpenAI API
- S3-compatible storage (R2/S3)

## Priorities (Order of Work)

1. **Auth** (WBS 2) (done) – NextAuth config, providers, session
2. **Resume CRUD** (WBS 3.1–3.3) (done) – Schema, API, versioning
3. **Templates** (WBS 4.1) – JSON schema, template metadata
4. **Export** (WBS 5) – TXT, PDF, DOCX endpoints
5. **AI** (WBS 6) – OpenAI wrapper, prompts, caching
6. **ATS** (WBS 7) – Scoring logic, suggestions API
7. **Cover Letter** (WBS 8)
8. **Job Matching** (WBS 9)
9. **Payments** (WBS 10)
10. **Admin APIs** (WBS 11)

## Key Tasks & Acceptance Criteria

### Task: Resume Schema (WBS 3.1) (done)

| Criteria | Detail |
|----------|--------|
| Tables | `User`, `Resume`, `ResumeVersion`, `ResumeSection` |
| Sections | JSONB or relation; support: summary, experience, education, skills, projects |
| Versions | Each save creates version; max N versions per resume (e.g. 10) |

### Task: Export API (WBS 5.1, 5.3, 5.4)

| Criteria | Detail |
|----------|--------|
| TXT | Return plain text; no auth required for free tier |
| PDF | Server-side or client; check subscription before allowing |
| DOCX | Use docxtemplater or similar; return binary |
| Gating | Middleware to verify `user.subscription === 'pro'` for PDF/Word |

### Task: AI Rewrite API (WBS 6.1–6.4)

| Criteria | Detail |
|----------|--------|
| Input | `{ text, action: 'rewrite' | 'suggest' | 'improve', context? }` |
| Output | `{ result: string }` |
| Rate limit | Free: 5/day, Pro: 50/day (use Redis or DB counter) |
| Caching | Cache by hash(text + action) for 24h |

### Task: Stripe Webhooks (WBS 10.4)

| Criteria | Detail |
|----------|--------|
| Events | `checkout.session.completed`, `customer.subscription.deleted` |
| Idempotency | Use Stripe event ID to avoid double-processing |
| Actions | On success: set `user.subscription`; on cancel: downgrade |
| Security | Verify signature with `STRIPE_WEBHOOK_SECRET` |

## API Conventions

- REST: `GET/POST/PUT/DELETE /api/[resource]`
- Auth: Use `getServerSession()` in API routes
- Validation: Zod schemas for request bodies
- Errors: Consistent `{ error: string, code?: string }` shape

## Dependencies

- DB migrations from DevOps (WBS 1.3)
- Stripe account, OpenAI API key
- File storage bucket for exports

---

# DEVOPS AGENT

## Scope

Project setup, CI/CD, environment config, deployment, monitoring.

## Tech Stack

- pnpm, Node 20
- Prisma for DB
- GitHub Actions
- Vercel (or chosen host)
- Sentry (or similar)

## Priorities (Order of Work)

1. **Project Init** (WBS 1.1–1.5) (done) – Repo structure, tooling, env
2. **DB Setup** (WBS 1.3) (done) – Prisma schema, migrations
3. **CI/CD** (WBS 1.6) (done) – Lint, test, build on push
4. **Deployment** (WBS 13) – Vercel, env vars, domain
5. **Monitoring** (WBS 13.6–13.8)

## Key Tasks & Acceptance Criteria

### Task: CI Pipeline (WBS 1.6) (done)

| Criteria | Detail |
|----------|--------|
| Triggers | On push to main, PR to main |
| Steps | `pnpm install`, `pnpm lint`, `pnpm build` |
| Env | Use `DATABASE_URL` from secrets for build (if needed) |
| Status | Block merge if build fails |

### Task: Production Env (WBS 13.1–13.4)

| Criteria | Detail |
|----------|--------|
| Vercel | Project linked, env vars set for Production |
| DB | Production PostgreSQL (Supabase/Neon) |
| Domain | Custom domain, SSL |
| Secrets | No secrets in code; all in platform |

### Task: Error Tracking (WBS 13.6)

| Criteria | Detail |
|----------|--------|
| Sentry | Next.js SDK, `SENTRY_DSN` in prod |
| Source maps | Upload for production builds |
| Alerts | Email/Slack on new errors (optional) |

## File Conventions

- CI: `.github/workflows/ci.yml`
- Env: `.env.example` (no secrets)

## Dependencies

- Repo exists; team has access
- Vercel/GitHub integration
- DB provider account

---

# DESIGN AGENT

## Scope

Resume templates (layout, typography, styling), cover letter templates, visual consistency.

## Deliverables

- 5 Indian-style CV templates (MVP)
- 2–3 cover letter templates
- Template JSON schemas (with Backend)
- Thumbnails for template selector

## Template Design Specs

| Template | Style | Target User |
|----------|-------|-------------|
| Professional | Clean, serif headings | Mid-senior |
| Fresher | Modern, compact | Students, new grads |
| Executive | Bold, minimal | Senior/leadership |
| Creative | Slight color accent | Design, marketing |
| ATS-Minimal | Ultra-simple, no graphics | ATS-heavy roles |

## JSON Schema (Coordinate with Backend)

```json
{
  "id": "professional-v1",
  "name": "Professional",
  "sections": ["summary", "experience", "education", "skills", "projects"],
  "fonts": { "heading": "Inter", "body": "Inter" },
  "colors": { "primary": "#1a1a1a", "accent": "#2563eb" },
  "spacing": { "sectionGap": 16, "blockGap": 8 }
}
```

## Dependencies

- Resume section structure from Backend (WBS 3.1)
- Frontend needs designs before building selector (WBS 4.4)

---

# CONTENT AGENT

## Scope

Blog articles, resume examples, SEO metadata, structured data.

## Priorities

1. **Content plan** – 10 article titles + outlines
2. **Blog setup** – MDX or CMS integration
3. **Resume examples** – 5–10 example pages
4. **SEO** – Meta tags, JSON-LD, sitemap

## Article Plan (First 10)

| # | Title | Focus |
|---|-------|-------|
| 1 | How to Write a CV for Freshers in 2026 | Fresher format |
| 2 | ATS-Friendly Resume: Complete Guide | ATS tips |
| 3 | Resume Tips for Chennai Job Seekers | Local SEO |
| 4 | Best Resume Templates for Engineers | Template roundup |
| 5 | Cover Letter Examples for India | Cover letters |
| 6 | Resume Length: One Page or Two? | Format rules |
| 7 | How to List Projects on Your CV | Project section |
| 8 | Resume for Career Change | Mid-career |
| 9 | Internship Resume Examples | Students |
| 10 | LinkedIn vs Resume: What to Include | Differentiation |

## SEO Requirements

- Unique meta title (50–60 chars) and description (150–160 chars) per page
- OG and Twitter card tags
- JSON-LD: `SoftwareApplication` for app, `Article` for blog
- Internal links between blog and app
- Sitemap at `/sitemap.xml`

## Dependencies

- Blog route structure from Frontend
- Resume example schema from Backend (WBS 12.3)

---

# FULL-STACK AGENT (Integration)

## When to Use

When a feature spans Frontend + Backend (e.g. end-to-end "Create Resume" or "Export PDF").

## Approach

1. Implement Backend API first
2. Implement Frontend UI that consumes it
3. Test flow manually
4. Add error handling and edge cases
5. Update WBS status

## Cross-Role Tasks

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Auth flow | Login/signup UI | NextAuth config | Session must sync |
| Resume save | Auto-save, optimistic UI | CRUD API, versioning | Debounce, conflict handling |
| Export | Download button, gating | Generate PDF/DOCX | Streaming or async |
| AI rewrite | Button, loading | OpenAI call, cache | Rate limit, errors |

---

## Quick Reference: WBS → Role Mapping

| WBS ID | Phase | Primary Owner |
|--------|-------|---------------|
| 1 | Setup | DevOps |
| 2 | Auth | Backend (logic), Frontend (UI) |
| 3 | Builder | Backend + Frontend |
| 4 | Templates | Design + Frontend + Backend |
| 5 | Export | Backend + Frontend |
| 6 | AI | Backend + Frontend |
| 7 | ATS | Backend + Frontend |
| 8 | Cover Letter | Backend + Frontend + Design |
| 9 | Job Match | Backend + Frontend |
| 10 | Payments | Backend + Frontend |
| 11 | Admin | Backend + Frontend |
| 12 | Content | Content + Frontend |
| 13 | Deployment | DevOps |

---

*For task details, see [WBS-WORK-BREAKDOWN-STRUCTURE.md](./WBS-WORK-BREAKDOWN-STRUCTURE.md).*
