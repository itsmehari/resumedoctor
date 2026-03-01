# Free Trial Workflow – End-to-End Plan

**Mini-project:** Email capture + OTP verification → 5-min trial → basic templates, no export

**Status:** Implemented  
**Last updated:** 2026-02-27

### Implementation Complete

All 6 phases implemented. See commits for details.

---

## Quick Reference

| Phase | Scope | Est. |
|-------|-------|------|
| **1** | Backend: OTP send/verify, TrialSession, Trial User, JWT | 4–6h |
| **2** | Backend: Resume API trial support, export block, middleware | 3–4h |
| **3** | Frontend: /try page, template picker, trial cookie | 4–5h |
| **4** | Frontend: 5-min timer, export lock, expiry overlay | 3–4h |
| **5** | 5 basic single-page templates (design + renderer) | 6–8h |
| **6** | Polish: cooldown, cleanup, error states | 2–3h |

**Total:** ~22–30h

---

## I. Overview

### Goal

Allow users to **try the resume builder for free** by:

1. Capturing their email
2. Sending a 6-digit OTP
3. Verifying OTP
4. Granting 5 minutes of access to build a resume
5. Limiting to 5 basic single-page templates
6. Blocking all export (PDF, Word, TXT, Print)

### Entry Points

- Homepage: "Create new CV" / "Try free"
- New dedicated: "Try it free" CTA → `/try` or `/try-free`

### Exit / Conversion

- When timer expires → modal/toast → "Sign up to save & export"
- Export buttons → "Upgrade to Pro" (existing pattern)
- At any point → "Save my resume" → signup flow (future enhancement)

---

## II. User Flow (Step-by-Step)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. LANDING                                                               │
│    User clicks "Try free" / "Create new CV"                              │
│    → Redirect to /try (or inline modal on homepage)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. EMAIL CAPTURE                                                        │
│    - Input: email (validated)                                            │
│    - Button: "Send OTP"                                                  │
│    - Rate limit: 3 OTP requests per email per 15 min                     │
│    - Success: "OTP sent to your email" → show OTP input                  │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. OTP VERIFICATION                                                     │
│    - Input: 6-digit OTP                                                 │
│    - Expiry: OTP valid 10 min                                            │
│    - Button: "Verify & Start"                                            │
│    - On success: Create trial session → redirect to template picker      │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. TEMPLATE PICKER                                                      │
│    - Show 5 basic single-page templates (thumbnails + names)             │
│    - User selects one → create resume with that templateId               │
│    - Redirect to /resumes/{id}/edit (trial mode)                         │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. RESUME BUILDER (TRIAL MODE)                                          │
│    - Full editor: sections, drag-drop, live preview                      │
│    - Visible: 5-min countdown timer in header                            │
│    - Export: All buttons show "Upgrade to export" (locked)               │
│    - Auto-save: Works (to persist edits during trial)                    │
│    - When timer hits 0: Overlay "Time's up! Sign up to save & export"    │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. POST-TRIAL                                                           │
│    - Option A: Sign up → migrate resume to real account                  │
│    - Option B: Start new trial (different email or same after cooldown)  │
│    - Option C: Leave                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## III. Technical Nitty-Gritties

### A. Data Model

#### 1. Trial Session (New)

| Field        | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| id           | String   | cuid                                              |
| email        | String   | User email (indexed)                             |
| otpHash      | String   | bcrypt hash of 6-digit OTP                       |
| otpExpiresAt | DateTime | OTP validity (10 min from send)                  |
| verifiedAt   | DateTime?| When OTP was verified                            |
| sessionExpiresAt | DateTime | 5 min from verification                    |
| resumeId     | String?  | Resume created in this trial                     |
| createdAt    | DateTime |                                                  |

**Purpose:** Track OTP send/verify and session validity. One active trial per email per day (or configurable).

#### 2. Trial User (Option: Reuse User model)

- Create `User` with:
  - `email` = captured email
  - `passwordHash` = null
  - `subscription` = `"trial"`
  - `emailVerified` = now (after OTP verified)
- Resumes link to this user via `userId`.
- When user signs up for real: either merge (update password, change subscription) or leave trial user orphaned (resume stays but user can't log in without password — we'd need "claim" flow later).

**Simpler approach:** Add `trialSessionId` to Resume, allow `userId` to be nullable, and use a separate "guest resume" access pattern. But Resume CRUD currently expects userId. So **reusing User with subscription="trial"** is the path of least resistance.

#### 3. OTP Rate Limiting

- Table: `OtpAttempt` (or use Redis)
  - `email`, `attemptedAt`, `type` (send | verify)
- Rules:
  - Max 3 OTP sends per email per 15 min
  - Max 5 failed verify attempts per email per 15 min
  - Lockout: 15 min after too many attempts

### B. Auth for Trial Users

**Problem:** NextAuth expects credentials or OAuth. Trial users have no password.

**Solution:** Custom JWT/session for trial:

1. **Option A – NextAuth Credentials with magic token**
   - After OTP verify: generate a one-time token, store in VerificationToken
   - Credentials provider: accept `email` + `trialToken`
   - If valid, sign in as that user (trial User)

2. **Option B – Separate trial session cookie**
   - After OTP verify: set HTTP-only cookie `trial_session` = signed JWT
   - JWT payload: `{ email, userId, exp }` (exp = sessionExpiresAt)
   - Middleware: if no NextAuth token but valid trial cookie → allow /resumes/:id/edit for that resume only
   - APIs: accept either session or trial JWT for resume access

3. **Option C – NextAuth with custom provider**
   - "Trial" provider: one-time code exchange
   - Similar to magic link but with our OTP

**Recommended:** Option B (trial cookie) keeps trial logic isolated. Middleware and APIs check: `session || validTrialJWT`.

### C. API Changes

| API / Route           | Current                         | Trial Mode Change                                      |
|-----------------------|---------------------------------|--------------------------------------------------------|
| POST /api/auth/trial/send-otp | N/A                    | New. Validate email, check rate limit, generate OTP, hash, save, send email |
| POST /api/auth/trial/verify-otp | N/A                 | New. Verify OTP, create TrialSession + User (trial), create resume stub? No. Create resume after template pick. Set trial cookie. |
| GET /api/resumes      | Requires session                | Accept trial JWT; return only trial user's resumes     |
| POST /api/resumes     | Requires session                | Accept trial JWT; create for trial user                |
| GET /api/resumes/:id  | Requires session + ownership    | Accept trial JWT; allow if resume belongs to trial user |
| PATCH /api/resumes/:id| Requires session + ownership    | Accept trial JWT; allow if resume belongs to trial user; reject if session expired |
| Export APIs           | Session + ownership             | Reject for trial subscription (403)                    |
| Middleware            | /resumes/* → login if no token  | Allow /resumes/:id/edit if valid trial cookie for that resume |

### D. Frontend Changes

| Page / Component     | Change                                                                 |
|----------------------|------------------------------------------------------------------------|
| Homepage             | "Try free" CTA → /try (or open /try in same tab)                       |
| /try                 | New page: email capture → OTP input → template picker                  |
| Template picker      | 5 templates, select → POST /api/resumes { templateId } → redirect edit |
| Edit page            | Detect trial mode; show 5-min countdown; lock export; timer expiry overlay |
| ExportButtons        | For trial: all export disabled, show "Sign up to export"               |
| useSubscription      | Add `isTrial`; trial ⇒ isPro=false, isTrial=true                       |
| useResume            | No change if API supports trial cookie                                 |

### E. Middleware

```ts
// Pseudocode
if (path is /resumes/:id/edit) {
  const token = await getToken();      // NextAuth
  const trialJwt = req.cookies.trial_session;
  if (token) return next();            // Logged-in user
  if (trialJwt && isValid(trialJwt) && getResumeOwner(id) === trialJwt.userId) {
    return next();                     // Trial user, same resume
  }
  if (!token && !trialJwt) redirect /try?redirect=/resumes/...;
  if (trialJwt expired) redirect /try?expired=1;
}
```

### F. Email: OTP Template

- Subject: "Your ResumeDoctor verification code"
- Body: "Your code is: **123456**. Valid for 10 minutes."
- Plain, minimal. Use Resend (existing).

### G. 5 Basic Templates

| ID            | Name         | Layout                          | Font(s)        | Design Notes                          |
|---------------|--------------|----------------------------------|----------------|---------------------------------------|
| trial-classic | Classic      | Header, sections stacked         | Georgia/serif  | Traditional, conservative             |
| trial-modern  | Modern       | Sidebar layout (optional)        | Inter          | Clean, minimal                        |
| trial-bold    | Bold         | Strong headings, accent color    | Poppins        | Accent bar, bold section titles       |
| trial-minimal | Minimalist   | Very sparse, lots of whitespace  | Lato           | Single accent, thin rules             |
| trial-professional | Professional | Standard 2-col header        | Merriweather   | Navy/slate, corporate feel            |

All single-page, A4, similar section set (Summary, Experience, Education, Skills). Different:

- Typography (font family, sizes)
- Section layout (full width vs 2-col)
- Accent colour (blue, green, slate, etc.)
- Spacing and borders

Template definitions can live in JSON + React components (extend existing `ResumePreview` or add `ResumePreviewTemplate` variants).

---

## IV. Phased Implementation

### Phase 1: Backend – OTP & Trial Session (Est. 4–6h)

| Task ID | Task                                    | Owner  | Deliverable                              |
|---------|-----------------------------------------|--------|------------------------------------------|
| 1.1     | Add Prisma models: TrialSession, OtpAttempt | Backend | schema.prisma updates, migration |
| 1.2     | API: POST /api/auth/trial/send-otp      | Backend | Rate limit, OTP gen, hash, save, send    |
| 1.3     | API: POST /api/auth/trial/verify-otp    | Backend | Verify, create User (trial) + TrialSession, return JWT |
| 1.4     | sendOtpEmail() in lib/email.ts          | Backend | Resend template for OTP                  |
| 1.5     | Trial JWT util: sign, verify, payload   | Backend | lib/trial-jwt.ts                         |

### Phase 2: Backend – Resume Access for Trial (Est. 3–4h)

| Task ID | Task                                          | Owner  | Deliverable                     |
|---------|-----------------------------------------------|--------|---------------------------------|
| 2.1     | Resume APIs: accept trial JWT, resolve trial user | Backend | GET/POST/PATCH /api/resumes* |
| 2.2     | Export APIs: reject trial (403)               | Backend | Export routes check subscription |
| 2.3     | Middleware: allow /resumes/:id/edit with trial cookie | Backend | middleware.ts updates      |
| 2.4     | useSubscription: add isTrial                  | Backend | From profile or trial JWT       |

### Phase 3: Frontend – Try Flow & Template Picker (Est. 4–5h)

| Task ID | Task                                | Owner    | Deliverable                          |
|---------|-------------------------------------|----------|--------------------------------------|
| 3.1     | /try page: email + OTP steps        | Frontend | Form, validation, API calls          |
| 3.2     | Template picker UI (5 templates)    | Frontend | Grid, select, POST create, redirect  |
| 3.3     | Set trial cookie after verify       | Frontend | Store JWT in cookie (httpOnly via API or secure) |
| 3.4     | Homepage: "Try free" CTA → /try     | Frontend | Link/button update                   |

### Phase 4: Frontend – Trial Mode in Builder (Est. 3–4h)

| Task ID | Task                                 | Owner    | Deliverable                         |
|---------|--------------------------------------|----------|-------------------------------------|
| 4.1     | 5-min countdown in edit header       | Frontend | Timer component, sessionExpiresAt   |
| 4.2     | Export lock for trial                | Frontend | ExportButtons: trial ⇒ all locked   |
| 4.3     | Timer expiry overlay                 | Frontend | Modal: "Time's up! Sign up to save" |
| 4.4     | Trial banner ("Trial – 5 min left")  | Frontend | Optional subtle header strip        |

### Phase 5: 5 Basic Templates (Est. 6–8h)

| Task ID | Task                                      | Owner  | Deliverable                               |
|---------|-------------------------------------------|--------|-------------------------------------------|
| 5.1     | Template schema: metadata + layout config | Backend | types/template.ts, template definitions   |
| 5.2     | Design 5 templates (layout, font, colour) | Design | JSON + CSS variables per template         |
| 5.3     | ResumePreview: support templateId         | Frontend | Conditional rendering per template        |
| 5.4     | Template thumbnails for picker            | Frontend | Static or generated previews              |
| 5.5     | Seed / API: list trial templates          | Backend | GET /api/templates?tier=trial             |

### Phase 6: Polish & Edge Cases (Est. 2–3h)

| Task ID | Task                                      | Owner  | Deliverable                    |
|---------|-------------------------------------------|--------|--------------------------------|
| 6.1     | Cooldown: 1 trial per email per 24h       | Backend | Check TrialSession history     |
| 6.2     | Cleanup: delete expired TrialSessions     | Backend | Cron or on-demand              |
| 6.3     | Error states: invalid OTP, expired session| Frontend | UX copy and recovery CTAs      |
| 6.4     | Analytics: trial started, completed, converted | Backend | Optional event logging    |

---

## V. Dependencies & Environment

| Dependency     | Purpose           | Status      |
|----------------|-------------------|-------------|
| Resend         | Send OTP email    | Existing    |
| bcryptjs       | OTP hashing       | Existing    |
| jose or jsonwebtoken | Trial JWT   | Add if needed |
| Database       | TrialSession, etc.| PostgreSQL  |

**New env vars:** None required if using existing Resend. Optional: `TRIAL_SESSION_SECRET` for JWT signing.

---

## VI. Open Questions

1. **Trial → Sign up:** Should we support "Save my resume" during trial that triggers signup and migrates the resume? (Phase 2+)
2. **Same email, new trial:** Allow same email to retry after 24h or longer?
3. **Template scope:** Only trial templates for trial users, or show all but restrict selection?
4. **Print (HTML):** Block completely or allow with watermark?

---

## VII. Success Metrics

- Trial starts (OTP verified)
- Trial completes (user spends ~5 min in editor)
- Conversion: trial user → signup
- Bounce: OTP sent but never verified

---

*This plan is the source of truth for the Free Trial mini-project. Implementation will follow these phases.*
