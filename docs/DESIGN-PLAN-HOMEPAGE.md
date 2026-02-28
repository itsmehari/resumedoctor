# ResumeDoctor Homepage – Design Plan

> Elegant, professional design inspired by Zety. India-first resume builder with refined typography, colour palette, and copy.

---

## I. Design Principles

- **Clarity & hierarchy** — Information flows naturally; every element has purpose
- **Trust & credibility** — Social proof, ratings, and professional aesthetics
- **Vibrant contrast** — Rich blue hero with golden CTA for strong call-to-action
- **Purposeful whitespace** — Spacious, uncluttered, sophisticated feel
- **Responsive elegance** — Works beautifully on desktop, tablet, and mobile

---

## II. Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Primary** | Poppins | 400, 500, 600, 700 | Headlines, body, navigation |
| **Headlines** | Poppins | 700 (Bold) | H1, H2 |
| **Sub-headlines** | Poppins | 500 (Medium) | Pre-headline, card titles |
| **Body** | Poppins | 400 (Regular) | Descriptions, paragraphs |
| **Navigation** | Poppins | 500 | Nav links, buttons |

**Rationale:** Poppins is geometric yet warm, highly legible, and pairs well with the professional tone. Use weight contrast for visual hierarchy.

---

## III. Colour Palette

### Primary (Trust Blue)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-500` | #1a73e8 | Hero background, links, accents |
| `primary-600` | #0d65d9 | Darker blue, nav hover |
| `primary-700` | #0a54b8 | Buttons, pressed states |
| `primary-50` | #eef4fc | Light backgrounds |

### Accent (Golden CTA)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | #FFB900 | Primary CTA buttons |
| `accent-hover` | #e6a700 | CTA hover state |
| `accent-dark` | #664d00 | Text on accent (for contrast) |

### Success (Trust)
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | #22c55e | Stars, "Recommended" badges |
| `success-light` | #dcfce7 | Badge backgrounds |

### Neutrals
| Token | Usage |
|-------|-------|
| `white` | Hero text, card backgrounds |
| `slate-900` | Primary text on light backgrounds |
| `slate-600` | Secondary text, descriptions |
| `slate-400` | Muted text, placeholders |
| `slate-100` | Section backgrounds |
| `slate-200` | Borders, dividers |

---

## IV. Section Breakdown

### 1. Header (Sticky)
- **Logo:** "ResumeDoctor" in `primary-600`, Poppins Bold
- **Nav links:** Tools, Templates, Pricing, Blog (optional) — Poppins Medium, slate-600
- **Account CTA:** "My Account" / Auth — solid `primary-700`, white text, rounded corners

### 2. Hero (Full-Width Blue)
- **Background:** Rich blue gradient (`primary-500` → `primary-700`)
- **Pre-headline:** Uppercase catchphrase + device icons — "CRAFT YOUR FUTURE, EFFORTLESSLY" or "WORKS ON ANY DEVICE"
- **Headline:** Large white Poppins Bold — "Free Resume Templates for 2026" / "Build a Resume That Lands Your Dream Job"
- **Sub-description:** White, 95% opacity — Clear value proposition in 2 lines
- **Primary CTA:** Goldenrod (`accent`) — "Create Your Resume"
- **Secondary CTA:** White bg, blue text — "Import Existing Resume" / "Explore Templates"
- **Trust indicator:** "Rated ⭐⭐⭐⭐⭐ by thousands" — success-green stars
- **Right side:** CV mockup or subtle decorative shape (golden amorphous blob)

### 3. Trust Bar
- **Copy:** "Trusted by job seekers across India"
- **Logos:** Naukri, LinkedIn, Indeed, TimesJobs, Shine — grayscale, subtle

### 4. Template Preview
- **Heading:** "Choose Your Template"
- **Filter bar:** All Filters, Industry, Experience, Style — elegant dropdowns with icons
- **Template cards:** 3-column grid, each with:
  - Template preview thumbnail
  - "Popular" or "Recommended" badge (optional)
  - Accent colour strip

### 5. Features
- **Heading:** "Why ResumeDoctor?"
- **Cards:** 3 columns, numbered steps (1, 2, 3)
  - Professional templates
  - Expert content & AI
  - Export & apply
- **Style:** White cards, subtle shadow, rounded corners, primary icon accents

### 6. CTA Strip
- **Background:** `primary-600`
- **Copy:** "Ready to land your next role?"
- **Button:** White, primary text — "Create Your Resume"

---

## V. Copy (Elegant Wording)

| Element | Copy |
|---------|------|
| **Catchphrase** | Craft Your Future, Effortlessly. |
| **Headline** | Build a Resume That Lands Your Dream Job. |
| **Sub-description** | Get hired faster with HR-approved templates. Choose your style, add ready-made content, and finish in minutes. |
| **Primary CTA** | Create Your Resume |
| **Secondary CTA** | Explore Our Templates |
| **Trust line** | Rated ⭐⭐⭐⭐⭐ by thousands of job seekers |
| **Trust bar** | Trusted by professionals across India |
| **Features heading** | Why Choose ResumeDoctor? |
| **CTA strip** | Ready to land your next role? |

---

## VI. Component Specs

### Buttons
- **Primary:** `accent` bg, `accent-dark` or black text, `rounded-xl`, `py-4 px-8`, `font-semibold`
- **Secondary:** White bg, `primary-600` text, `border-2 border-white`, same padding
- **Nav CTA:** `primary-700` bg, white text, `rounded-lg`, `py-2 px-4`

### Cards
- **Background:** White
- **Border:** `slate-200` 1px
- **Radius:** `rounded-2xl`
- **Shadow:** `shadow-sm` default, `shadow-md` hover
- **Padding:** `p-6`

### Spacing
- **Section padding:** `py-16` or `py-20`
- **Container max-width:** `max-w-6xl` (1152px)
- **Gap between elements:** `gap-12` or `gap-16`

---

## VII. Responsive Breakpoints

- **Mobile:** Single column, stacked CTAs, full-width hero
- **Tablet:** 2-column features, template grid 2-col
- **Desktop:** 2-col hero (copy + mockup), 3-col features, 3-col templates

---

*Last updated: Feb 2026 | ResumeDoctor Design System v1*
