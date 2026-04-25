# Todo 13 – Article JSON-LD & Internal Links – Plan ✅ DONE

**Goal:** Ensure every blog and example page has the right structured data (Article, HowTo, ItemList, BreadcrumbList) and that the site has a strong internal-link mesh for SEO and UX.

---

## 1. Structured data (JSON-LD)

| Page | Schema | Status |
|------|--------|--------|
| Home | WebSite, Organization, SoftwareApplication, FAQPage, HowTo | ✅ |
| Blog index | (optional ItemList or CollectionPage) | Optional |
| Blog post | **Article** | ✅ |
| Blog post | **BreadcrumbList** (Home › Blog › [Title]) | Add |
| Examples index | **ItemList** (all example items) | Add (Todo 12) |
| Example detail | **HowTo** (“How to write [Role] resume”) | Add (Todo 12) |
| Example detail | **BreadcrumbList** (Home › Examples › [Title]) | Add |

---

## 2. BreadcrumbList

- **Blog post:** `Home` → `Blog` → `[Article title]`.
- **Example detail:** `Home` → `Resume Examples` → `[Example title]`.
- **Blog index / Examples index:** Optional (can add for consistency).

Implement in `src/components/seo/json-ld.tsx`: `BreadcrumbJsonLd({ items: { name, url }[] })`, use in blog [slug] and examples [slug].

---

## 3. Internal linking strategy

| From | To | Implementation |
|------|----|----------------|
| Home | Blog, Examples | ✅ (nav, footer, “Read our resume guides”, career cards, feature cards) |
| Blog index | Examples | Add “Resume examples by role” block with link to `/examples` + cards |
| Blog post | Related posts, Examples | Add “Related articles” + “Resume examples for you” (content-links) |
| Examples index | Blog | Add “From our blog” with 4 articles |
| Example detail | Blog | Add “Related blog posts” (content-links) |
| Footer | Blog, Examples, ATS Guide, CV Freshers | ✅ |
| Header | Blog | ✅ |

---

## 4. Related-content logic

- **Blog → examples:** Map each blog slug to 1–4 example slugs (e.g. fresher article → fresher example; ATS article → several).
- **Example → blog:** Map each example slug to 2–3 blog slugs (e.g. software-engineer → ATS guide, skills guide, professional summary).

Single source of truth: `src/lib/content-links.ts` with:
- `getRelatedExamplesForBlog(blogSlug: string): { slug, title }[]`
- `getRelatedPostsForBlog(blogSlug: string): { slug, title }[]` (exclude current)
- `getRelatedPostsForExample(exampleSlug: string): { slug, title }[]`

---

## 5. Deliverables

| Item | Deliverable |
|------|-------------|
| Plan | This document |
| BreadcrumbJsonLd | Component in `json-ld.tsx`, used in blog [slug] and examples [slug] |
| content-links | `src/lib/content-links.ts` with mapping and getters |
| Blog index | “Resume examples” block |
| Blog [slug] | “Related articles” + “Resume examples for you” |
| Examples index | “From our blog” block |
| Examples [slug] | “Related blog posts” block |

---

**Done when:** BreadcrumbList on blog and example detail pages, and full internal-link mesh (blog ↔ examples, related content) is live.
