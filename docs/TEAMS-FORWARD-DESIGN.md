# Teams / organizations — forward design (not implemented)

Lightweight plan for **multi-user workspaces** without full RBAC. Personal accounts remain the default; orgs are optional add-ons.

**Status:** Design only — no Prisma models or routes yet. Implement when product requires shared resumes or org billing.

---

## Goals

- Let a company share resumes/cover letters under one billing account.
- Keep authorization **simple:** membership check + org entitlement (same pattern as user `subscription`).
- Avoid permission matrices (`can.export`, `can.invite`, …) in v1.

---

## Proposed data model

```prisma
// Illustrative — not in schema yet

model Organization {
  id             String   @id @default(cuid())
  name           String
  slug           String   @unique
  subscription   String   @default("basic") // org-level plan
  subscriptionExpiresAt DateTime?
  stripeCustomerId String? @unique
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  members        OrganizationMembership[]
  resumes        Resume[]  // optional: orgId on Resume
}

model OrganizationMembership {
  id        String   @id @default(cuid())
  orgId     String
  userId    String
  role      String   // "owner" | "member"
  createdAt DateTime @default(now())

  org       Organization @relation(...)
  user      User         @relation(...)

  @@unique([orgId, userId])
}
```

### Ownership migration (when built)

| Resource | Today | With teams |
|----------|-------|------------|
| Resume | `userId` | `userId` (personal) **or** `orgId` (shared) |
| Cover letter | `userId` | same |
| Invoice | `userId` | `orgId` for org checkout |
| Export / AI quotas | per `userId` | per `orgId` for org workspace |

**Rule:** every query includes `(userId = me AND orgId IS NULL) OR (orgId = X AND membership exists)`.

---

## Authorization (two checks only)

1. **Membership:** user is `owner` or `member` of `orgId`.
2. **Entitlement:** `getOrgEntitlements(org)` mirrors `getUserEntitlements` (reuse subscription helpers).

No per-action permission table in v1. Owners alone may: invite/remove members, change org billing, delete org.

---

## Auth integration

- Session stays per-user (NextAuth unchanged).
- Active workspace: cookie or profile field `activeWorkspace: "personal" | org:<id>`.
- `getEffectiveAuth()` could return `{ userId, orgId?, isTrial, ... }` when workspace is org — **extend later**; do not break current personal-only paths.

---

## UX sketch

- Settings → **Workspaces**: Personal (default) + org switcher.
- Dashboard lists resumes for active workspace.
- Pricing: org seat packs or flat org Pro (product decision).

---

## What we will not do in v1

- Fine-grained RBAC (editor vs viewer vs billing admin).
- SSO / SAML (enterprise later).
- Cross-org sharing links.

---

## Implementation order (suggested)

1. Prisma models + invite-by-email flow.
2. `orgId` on `Resume` (nullable) + API ownership helper `assertResumeAccess(userId, resume)`.
3. Org Stripe customer + webhook updates `Organization.subscription`.
4. Admin: list orgs, support tools.

Until then, all production code assumes **personal `userId` ownership** only.
