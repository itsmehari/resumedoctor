---
name: resume link phase 2b — view counter and vanity slugs
overview: Two follow-up features that compound the resume-link USP but require Prisma schema changes, migrations, and additional UI/UX work. Captured here as a self-contained plan so they can be executed in a deliberate, scoped pass.
todos:
  - id: vc-schema
    content: Add Resume.viewCount Int @default(0) to prisma/schema.prisma
    status: pending
  - id: vc-migration
    content: Generate prisma migration; verify Vercel runs prisma migrate deploy on build
    status: pending
  - id: vc-record
    content: Increment viewCount in /api/resumes/by-slug/[slug] (and on the SSR /r/[slug] page) — bot-filter via UA heuristic
    status: pending
  - id: vc-dashboard
    content: Surface "Viewed N times" on the owner's resume dashboard / share popover
    status: pending
  - id: vc-tests
    content: Manual QA — share, view from another browser, see count tick up; verify counter doesn't increment for owner's own dashboard preview
    status: pending
  - id: vs-schema
    content: Decide vanity slug field strategy — extend publicSlug uniqueness, or add Resume.vanitySlug String? @unique alongside publicSlug
    status: pending
  - id: vs-validation
    content: Slug validation rules (3-30 chars, kebab-case, profanity blocklist, reserved word list)
    status: pending
  - id: vs-claim-api
    content: PATCH /api/resumes/[id]/vanity-slug — uniqueness check, profanity check, reserved-word check, atomic update
    status: pending
  - id: vs-share-ui
    content: Add "Customize URL" UI inside ShareResumeButton (input field, availability check, set/save)
    status: pending
  - id: vs-routing
    content: Update r/[slug]/page.tsx + by-slug API to look up by either publicSlug OR vanitySlug
    status: pending
  - id: vs-redirects
    content: When a vanity slug is set, optionally 301 the random publicSlug to the vanity slug for canonical SEO
    status: pending
  - id: vs-tests
    content: QA — claim a slug, verify it loads, verify legacy publicSlug still works (or 301s), verify uniqueness
    status: pending
isProject: false
---

## Why this is a separate pass

Both features are real value-adds that the user mentioned they want, and they compound the resume-link USP that we just shipped in Phase 2A. They are deliberately isolated here because they require:

1. **Prisma schema migration** — modifying [prisma/schema.prisma](../../prisma/schema.prisma) and running `prisma migrate` against production data. Needs explicit go-ahead.
2. **Production data implications** — every existing Resume row gets a new column; existing `publicSlug` URLs must keep working.
3. **Reservation + conflict logic** for vanity slugs (e.g., reserved words like `admin`, `api`, `try`, `r`, `your-name`).

Phase 2A (already shipped: SSR + OG image + `/resume-link` landing + ATS softening) was scoped to be additive and safe — no DB changes, no risk to existing user data.

## Item 1 — View counter

### Goal

Owners see "Viewed N times" on their dashboard / share popover, similar to LinkedIn's "Who viewed your profile" but anonymous and lightweight.

### Why it matters

- India recruiters and candidates both love social proof signals. "Recruiter from Cisco viewed your resume" (or just "12 views this week") is a direct dopamine + retention lever.
- Pure-marketing: a screenshot of "Your resume — 47 views, last viewed 2 hours ago" makes a great social-proof asset for the homepage.
- Compounds the share-link USP — once people send the link, they want to know if it was opened.

### Scope

- **Schema:** add `viewCount Int @default(0)` to [prisma/schema.prisma](../../prisma/schema.prisma) Resume model. Optional follow-up: `lastViewedAt DateTime?` for "Viewed 2 hours ago" display.
- **Increment logic:** in [src/app/api/resumes/by-slug/[slug]/route.ts](../../src/app/api/resumes/by-slug/[slug]/route.ts) (and / or in the SSR [src/app/r/[slug]/page.tsx](../../src/app/r/[slug]/page.tsx) page itself), `prisma.resume.update({ where: { publicSlug }, data: { viewCount: { increment: 1 }, lastViewedAt: new Date() } })`.
- **Bot filter:** simple UA heuristic — skip increment if UA matches `/bot|crawler|spider|preview|whatsapp|linkedin|slack|twitter|facebook|telegram|discord/i`. Bots are the ones generating the OG preview, not real viewers.
- **Owner-self filter (optional, harder):** if the request session belongs to the owner, skip increment. Defer if it complicates the SSR path.
- **Display:** in [src/components/resume-builder/share-resume-button.tsx](../../src/components/resume-builder/share-resume-button.tsx), fetch and show `Viewed N times · Last viewed Xh ago`.
- **Optional:** add a small "views" count to the resume dashboard list.

### Risks

- **Race conditions** — Prisma `increment: 1` is atomic, no risk.
- **Hot-row contention** — if a single resume gets viral traffic, fine for now; Postgres handles it.
- **Edge runtime** — keep the /r SSR on `nodejs` runtime (it already is) so Prisma works.

## Item 2 — Vanity slugs ("claim your name")

### Goal

Let users have a memorable, brand-able URL like `resumedoctor.in/r/hari-krishnan` instead of `resumedoctor.in/r/abc123xyz`.

### Why it matters

- Memorable URLs go on business cards, email signatures, LinkedIn headlines.
- A custom slug is psychologically a "claim" — increases engagement and retention.
- Massively more shareable verbally ("just go to resumedoctor.in/r/my-name").

### Schema decision (pick one before coding)

**Option A — Extend `publicSlug`:** allow user to update `publicSlug` itself. Simplest schema, but breaks all existing shared links if a user changes it.

**Option B — Add `vanitySlug` alongside `publicSlug`:** keep the random `publicSlug` permanent, add `vanitySlug String? @unique`. Both URLs resolve. Vanity is the canonical (preferred for SEO).

**Recommendation: Option B.** Old links keep working forever, new vanity URLs become the primary share path.

```prisma
model Resume {
  // ... existing fields
  publicSlug   String?  @unique  // unchanged, server-generated, permanent
  vanitySlug   String?  @unique  // new, user-claimed, optional
}
```

### Validation rules

- 3–30 characters
- Lowercase letters, digits, hyphens only (kebab-case)
- Must start with a letter
- Must not match a reserved word: `admin`, `api`, `r`, `try`, `signup`, `login`, `pricing`, `templates`, `blog`, `examples`, `lp`, `resume-link`, `your-name`, `example`, `dashboard`, `account`, `settings`
- Profanity blocklist (small static list to start; can use leo-profanity later)
- Globally unique across `vanitySlug` AND not colliding with `publicSlug`

### API

`PATCH /api/resumes/[id]/vanity-slug`

```ts
body: { vanitySlug: string }
// 200: { success: true, url: "https://resumedoctor.in/r/<slug>" }
// 409: { error: "That URL is already taken" }
// 422: { error: "Invalid format" | "Reserved word" | "Profanity" }
```

Authorisation: only the resume owner can claim its vanity slug.

### UI

In [src/components/resume-builder/share-resume-button.tsx](../../src/components/resume-builder/share-resume-button.tsx):

- After share is generated, show a "Customize URL" link.
- Inline editor with debounced availability check (500ms).
- Save button writes `vanitySlug`, returns the new canonical URL, copies to clipboard.

### Routing

In [src/app/api/resumes/by-slug/[slug]/route.ts](../../src/app/api/resumes/by-slug/[slug]/route.ts) and the SSR [src/app/r/[slug]/page.tsx](../../src/app/r/[slug]/page.tsx):

```ts
const resume = await prisma.resume.findFirst({
  where: {
    OR: [{ vanitySlug: slug }, { publicSlug: slug }],
  },
});
```

### Optional canonical SEO

If a vanity slug is set, the random `publicSlug` URL can return a 301 to the vanity URL. Improves canonicalisation but requires a redirect detection step. Defer if it complicates the build.

### Risks / things to think about

- **Squatting** — users claiming common names they don't own (e.g., `narendra-modi`). Add a takedown / appeal path in T&Cs.
- **Profanity** — start with a static blocklist; user-reportable abuse later.
- **Rate-limit** vanity-slug claim to prevent enumeration of taken slugs.
- **Privacy** — if `noindex` is on the public page (it is, per Phase 2A), Google doesn't surface vanity URLs in search. Re-discuss whether to allow indexing for vanity slugs only (user opted in, claimed identity → maybe yes).

## Out of scope here

- A dedicated "username/profile" page distinct from the resume page (e.g., `/u/hari-krishnan` listing all their public resumes). Different feature.
- LinkedIn-style "who viewed your resume" with attribution. We're going for anonymous counts only.

## Estimated effort

- View counter: ~2–4 hours including UI and QA.
- Vanity slugs: ~1–2 days including validation, claim UI, availability check, routing, profanity / reservation lists, and tests.
