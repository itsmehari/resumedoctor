# ResumeDoctor – Pre-Launch Checklist (resumedoctor.in)

Items to complete **before going live**.

---

## 1. Transactional Email ✅

**Status:** Done. Resend integration in place.

| Item | Status |
|------|--------|
| Email verification | ✅ `src/lib/email.ts` + signup route |
| Password reset | ✅ forgot-password route |

**Setup:** Add `RESEND_API_KEY` to `.env.local`. Verify sender domain at resend.com for production. For testing, `onboarding@resend.dev` works without verification.

---

## 2. Other Pre-Launch Items

- [x] Remove or guard `console.log` in auth routes
- [x] Privacy policy page (`/privacy`)
- [x] Terms of service page (`/terms`)
- [ ] Data retention policy (covered in Privacy)
- [ ] "Download my data" / "Delete account" (compliance – Phase 2)

---

*Add more items as the product evolves.*
