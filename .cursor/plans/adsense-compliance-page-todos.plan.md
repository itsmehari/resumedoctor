# AdSense / Google Publisher compliance — policy items that apply to ResumeDoctor + page-level to-dos

**Sources:** [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en), [Google Publisher Policies](https://support.google.com/adsense/answer/9335564?hl=en).  
**Codebase note (May 2026):** No `adsense` / `adsbygoogle` / `googlesyndication` usage found. You already load **Google Analytics 4** via `gtag` ([`src/components/analytics-provider.tsx`](src/components/analytics-provider.tsx)) and have a **consent** flow ([`ConsentBanner`](src/components/consent-banner.tsx), [`ConsentProvider`](src/contexts/consent-context.tsx)). Most items below assume you **will add** AdSense (or other Google-served display ads). If you never add them, several ad-specific items become N/A but **Publisher content rules** still matter if you later monetize with Google.

---

## A. Which policy buckets apply to this product?

| Policy area | Why it applies to ResumeDoctor |
|-------------|-------------------------------|
| **Invalid clicks / inflated impressions** (48182) | Applies once any Google ad unit exists; protect against accidental self-clicks from team/staging. |
| **Encouraging clicks; ad vs content distinction** (48182) | Applies sitewide: no “click ads to support us,” no arrows on units, clear “Advertisement” / “Sponsored” labels, ads must not mimic resume UI (tabs, “Download,” nav). |
| **Traffic sources** (48182) | Applies if you buy traffic to LPs (`src/app/lp/*`): landing pages must match ad promise ([Landing Page Quality](https://support.google.com/google-ads/answer/2404197)). No paid-to-click / unsolicited email promotion of ad-heavy pages. |
| **Ad placement** (48182) | Critical for **email-adjacent page**, **auth/tool screens**, **admin**, **UGC public resumes**, **possible “thin” LPs**. |
| **Site behavior / deceptive navigation** (48182) | High risk next to **CTAs** (“Export PDF,” “Upgrade,” “Apply”) — ads must not look like primary actions. |
| **Illegal / IP / dangerous / sexual / child safety content** (Publisher) | Applies to **blog**, **marketing copy**, and especially **user-generated resume text** on **`/r/[slug]`**. |
| **Misrepresentative & deceptive practices; manipulated media** (Publisher) | Marketing must not imply **Google endorsement**; no fake urgency tied to ads. |
| **Enabling dishonest behavior** (Publisher) | **Material for a resume SaaS:** policies prohibit helping users mislead others (e.g. fake credentials). You need **ToS + enforcement posture** and **abuse handling** for public resumes—not just an ad placement issue. |
| **Inventory value — no/low publisher content; navigation/alert screens** (Publisher) | Applies to **dashboard**, **settings**, **editors**, **verify/reset flows** — generally poor candidates for display ads. |
| **Replicated content without value** (Publisher) | Risk on **public resume pages** if the page is only the resume with no editorial framing. |
| **Privacy disclosures; EU User Consent; identifying users** (Publisher) | [`/privacy`](src/app/privacy/page.tsx) must mention **ad cookies/beacons**, link to [How Google uses data…](https://www.google.com/policies/privacy/partners/), align consent with **EU User Consent Policy** before personalized ads. |
| **Employment-related personalized ads** (Publisher) | Your site is **job-seeker / career** oriented; Google documents **U.S./Canada** restrictions on targeting for employment ads (mostly advertiser/targeting side, but you must not misuse audience signals). |
| **COPPA** (Publisher) | If any property is **directed at children under 13**, interest-based ads rules tighten; confirm positioning is adult job seekers. |
| **Spam policies for Search; Abusive experiences; Better Ads Standards; Malware** (Publisher) | Sitewide quality and UX; align with Coalition for Better Ads if you add intrusive formats. |
| **Authorized inventory (`ads.txt`)** (Publisher) | When AdSense is live on **resumedoctor.in**, publish correct **ads.txt** at site root. |

---

## B. Global / cross-cutting implementation to-dos (not tied to one URL)

1. **Ad slot architecture:** Centralize ad components (e.g. only on allowed layouts) so forbidden surfaces (`admin`, `login`, `verify-email`, etc.) never mount script.  
2. **Consent gating:** Extend existing consent so **AdSense / personalized ads** load only after required consents (esp. EEA/UK), consistent with [EU User Consent Policy](http://www.google.com/about/company/user-consent-policy.html).  
3. **`ads.txt`:** Add at `https://www.resumedoctor.in/ads.txt` with authorized seller lines from AdSense.  
4. **Labeling:** Use only allowed adjacent labels (“Advertisements,” “Sponsored links”); never “Favorite sites” style labels (48182).  
5. **Layout separation:** Ensure ad units are not in **floating boxes** (48182), not in **pop-ups/unders**, not **framing** third-party sites without permission (48182).  
6. **Navigation audit:** No ad placements where users expect **menu, primary nav, or download** (48182 + Publisher “ads interfering”).  
7. **Privacy policy:** New sections for third-party **ad serving**, cookies/beacons, link to Google’s partner policy; retention for ad-related logs if any.  
8. **UGC / public resumes:** Abuse reporting or takedown path for resumes that violate Publisher **dishonest / dangerous** content rules; consider **no ads** on `/r/*` until moderation story is clear.  
9. **Staging / QA:** Policy against **invalid clicks** — block ad serving on non-prod hosts or use test units only.  
10. **Email campaigns:** Do not embed AdSense **in emails** (48182); web pages whose **primary focus is email** should not carry units (see introduction email page group).

---

## C. Page groups — extensive to-dos (“what we would change”)

Legend: **Ads OK** = candidate for display ads *if* content is substantial and layout safe. **Ads off** = do not serve AdSense (policy or quality). **N/A** = no ad-related UI change unless you violate layout elsewhere.

### C1. Root layout & shell

| Location | Policy hooks | To-dos |
|----------|----------------|--------|
| [`src/app/layout.tsx`](src/app/layout.tsx) | Better Ads / site behavior | Do **not** add global ad script here without route gating (would hit **admin/auth**). Prefer **per-layout** or **per-route** ad injection. |
| [`src/app/providers.tsx`](src/app/providers.tsx) | Privacy / consent | Wire **ad load** to same consent state as analytics; document in privacy. |

### C2. Marketing & static editorial (generally **Ads OK** with care)

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/page.tsx`](src/app/page.tsx) (home) | Encouraging clicks; inventory value; Better Ads | Add **sidebar or in-content** slots only with **clear separation** from primary CTAs (“Try,” “Pricing”). No “support site by clicking ads.” |
| [`src/app/about/page.tsx`](src/app/about/page.tsx) | Same | Same; ensure **more editorial text than ad area** (Publisher “more ads than content”). |
| [`src/app/features/page.tsx`](src/app/features/page.tsx) | Same | Same. |
| [`src/app/pricing/page.tsx`](src/app/pricing/page.tsx) | Deceptive nav; encouraging clicks | **High caution:** pricing tables and purchase CTAs — **no** ad placement adjacent to “Subscribe” / “Upgrade” that could be mistaken for payment actions. |
| [`src/app/templates/page.tsx`](src/app/templates/page.tsx) | Ads interfering | Avoid units **on** template cards; place in margin/footer with spacing. |
| [`src/app/examples/page.tsx`](src/app/examples/page.tsx), [`src/app/examples/[slug]/page.tsx`](src/app/examples/[slug]/page.tsx) | Replicated content | Ensure pages add **curatorial commentary**, not only copied resume text, if ads appear ([replicated content policy](https://support.google.com/publisherpolicies/answer/11190248)). |
| [`src/app/interview-prep/page.tsx`](src/app/interview-prep/page.tsx) | Content quality | If long-form, **Ads OK** mid-article style; if thin, **defer ads** until content depth meets inventory rules. |
| [`src/app/resume-link/page.tsx`](src/app/resume-link/page.tsx) | Clarity | Review whether this is **tool** vs **article**; tool-heavy → **Ads off** or minimal. |

### C3. Landing pages `src/app/lp/*`

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`lp/tailor-resume-job-description`](src/app/lp/tailor-resume-job-description/page.tsx), [`lp/marketing-landing`](src/app/lp/marketing-landing/page.tsx), [`lp/fresher-campus-resume-india`](src/app/lp/fresher-campus-resume-india/page.tsx), [`lp/resume-export-pdf-docx-india`](src/app/lp/resume-export-pdf-docx-india/page.tsx), [`lp/resume-builder-india`](src/app/lp/resume-builder-india/page.tsx) | Traffic sources / LP quality; thin content | For **paid traffic**: headline and body must **match ad creative**. Add **unique substantive copy** so pages are not “doorway” thin. Place ads **below fold** or sidebar, never competing with **one primary CTA** in deceptive ways. |

### C4. Blog

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/blog/page.tsx`](src/app/blog/page.tsx), [`src/app/blog/[slug]/page.tsx`](src/app/blog/[slug]/page.tsx) | Full Publisher content policies | **Editorial review** for illegal, dangerous, sexually explicit, unreliable health/political claims, etc. Ads **between paragraphs** usually OK; avoid sticky overlay. If posts quote large third-party chunks, add **original analysis** (replicated content). |

### C5. Try flow

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/try/page.tsx`](src/app/try/page.tsx), [`src/app/try/templates/page.tsx`](src/app/try/templates/page.tsx) | Navigation / low-value | Likely **tool + funnel** — prefer **Ads off** during try, or single **footer** unit with strong separation so ads are not confused with “Continue” / template pick. |

### C6. Authentication & account recovery (**prefer Ads off**)

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/login/page.tsx`](src/app/login/page.tsx), [`src/app/login/2fa/page.tsx`](src/app/login/2fa/page.tsx), [`src/app/signup/page.tsx`](src/app/signup/page.tsx), [`src/app/forgot-password/page.tsx`](src/app/forgot-password/page.tsx), [`src/app/reset-password/page.tsx`](src/app/reset-password/page.tsx), [`src/app/verify-email/page.tsx`](src/app/verify-email/page.tsx) | 48182 email/private focus; Publisher “alerts, navigation” | **Do not** insert AdSense: these are **behavioral / alert** surfaces. Ensure no future **A/B** accidentally injects ads via shared layout. |

### C7. Email-primary or email-preview web pages (**Ads off**)

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/introduction-resumedoctor-email/page.tsx`](src/app/introduction-resumedoctor-email/page.tsx) | 48182: “Placed inside emails, or on pages where **email messages are the primary focus**” | Treat as **no-ad zone** (page is an **email HTML preview**). If a parent layout ever adds ads, **exclude this route** explicitly. |
| [`src/app/settings/change-email/verify/page.tsx`](src/app/settings/change-email/verify/page.tsx) | Same / transactional | **Ads off**. |

### C8. Logged-in app: dashboard, resumes, cover letters, jobs, settings (**Ads off or extremely limited**)

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx) | Low-value / navigation | **Ads off** — dashboard is primarily **navigation + widgets**, not article content. |
| [`src/app/resumes/new/page.tsx`](src/app/resumes/new/page.tsx), [`src/app/resumes/[id]/edit/page.tsx`](src/app/resumes/[id]/edit/page.tsx) | Deceptive nav; “without publisher-content” | **Ads off** inside editor chrome. Risk of ads next to **section add buttons**, **export**, **AI** actions. |
| [`src/app/cover-letters/page.tsx`](src/app/cover-letters/page.tsx), [`cover-letters/new`](src/app/cover-letters/new/page.tsx), [`cover-letters/[id]/edit`](src/app/cover-letters/[id]/edit/page.tsx) | Same | **Ads off** in editor; optional **single** unit on **list page** only if list UI is clearly non-confusing (usually still **off**). |
| [`src/app/jobs/page.tsx`](src/app/jobs/page.tsx) | Employment + personalized ads sensitivity | If ads on: avoid layouts implying **job rows are ads**. Disclose employment context in privacy if using audience features later. |
| [`src/app/settings/page.tsx`](src/app/settings/page.tsx) | Navigation / behavioral | **Ads off**. |

### C9. Public shared resume (**high policy load**)

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/r/[slug]/page.tsx`](src/app/r/[slug]/page.tsx) | UGC; enabling dishonest behavior; replicated content; mis-branding Google | **Default recommendation: Ads off** until: (1) **abuse** pipeline for fraudulent resumes; (2) page includes enough **publisher framing** (guidelines, “report,” branding) so it is not **only** mirrored UGC; (3) no layout that suggests **Google** hosts the resume. If you enable ads: **no** units overlapping **resume body**; clear sitewide header; **report** link. |

### C10. Legal

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/privacy/page.tsx`](src/app/privacy/page.tsx) | Privacy disclosures (Publisher) | Add: Google **advertising** cookies/beacons; link to partner policy; how to opt out / consent; **AdSense** if enabled. |
| [`src/app/terms/page.tsx`](src/app/terms/page.tsx) | Enabling dishonest behavior | Strengthen **user representations** (truthfulness of resume facts); **removal** rights for policy violations — supports Publisher posture for UGC. |

### C11. Pricing post-checkout

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/pricing/verify-trial/page.tsx`](src/app/pricing/verify-trial/page.tsx) | Alert / transactional | **Ads off**. |

### C12. Admin (**Ads off** — mandatory)

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| All under [`src/app/admin/`](src/app/admin/) | Security; accidental clicks; irrelevant ads | **Never** load AdSense on admin routes; confirm **separate layout** or route guard in ad component. |

### C13. Dev / preview

| Page | Policy hooks | To-dos |
|------|----------------|--------|
| [`src/app/dev/preview/[templateId]/page.tsx`](src/app/dev/preview/[templateId]/page.tsx) | “Under construction”; invalid traffic | **Ads off**; exclude from indexing if not already. |

---

## D. Execution order (when you implement)

1. Route **allowlist/denylist** for ad component + consent wiring.  
2. Update **privacy** + optional **cookie settings** UI for ad tech.  
3. **`ads.txt`** on production domain.  
4. Add units only on **C2/C3/C4** candidates first; keep **C6–C10** off unless Legal/Product reopens `/r/*` after UGC review.  
5. Manual **UX pass**: “could this be mistaken for Download / Apply / Google?” on every live template.

---

## E. Out of scope for “page changes” but required for program participation

- AdSense **account-level** accurate site URL, payments, **honest declarations**.  
- Ongoing **policy change** monitoring ([48182](https://support.google.com/adsense/answer/48182) + [Publisher Policies](https://support.google.com/adsense/answer/9335564)).  
- **Sanctions / geography** restrictions per Google’s terms.

This document is a **planning checklist**, not a statement that the live site currently complies or violates policies.
