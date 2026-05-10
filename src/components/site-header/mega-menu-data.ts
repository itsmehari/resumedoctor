/**
 * Megamenu information architecture — single source of truth.
 *
 * Pure TypeScript (no JSX, no React) so the structure can also be reused by
 * sitemaps, footer-as-megamenu mirrors, and tests. Edits to navigation
 * content should happen here only.
 *
 * Destinations were audited against `src/app/**`, `content/blog/**`, and the
 * `CATEGORIES` const in `src/app/templates/page.tsx`. See plan section 6
 * (Link health & destinations) for the verification table.
 */

export type MegaMenuLink = {
  label: string;
  href: string;
  /** One-line context shown beneath the label on richer items. Optional. */
  description?: string;
  /** External targets open in a new tab. */
  external?: boolean;
};

export type MegaMenuColumnVisibility =
  | "always"
  | "signed-in-only"
  | "signed-out-only";

export type MegaMenuColumn = {
  heading: string;
  links: MegaMenuLink[];
  /** Defaults to "always". */
  visibility?: MegaMenuColumnVisibility;
};

/**
 * Right-rail card variants. The panel component decides which subset of these
 * fields to render based on `kind`.
 */
export type MegaMenuFeaturedRail =
  | {
      kind: "pro-link";
      pillLabel: string;
      headline: string;
      benefits: string[];
      ctaLabel: string;
      ctaHref: string;
    }
  | {
      kind: "trial-wedge";
      pillLabel: string;
      headline: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      /** Hide the card entirely when the user has an active Pro plan. */
      hideWhenPro?: boolean;
    }
  | {
      kind: "template-tile";
      pillLabel?: string;
      headline: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    }
  | {
      kind: "blog-tile";
      pillLabel?: string;
      headline: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };

export type MegaMenuPanel = {
  columns: MegaMenuColumn[];
  featuredRail?: MegaMenuFeaturedRail;
};

export type MegaMenuTopItem =
  | { type: "panel"; label: string; panel: MegaMenuPanel }
  | { type: "link"; label: string; href: string };

// ────────────────────────────────────────────────────────────────────────────
// Product panel
// ────────────────────────────────────────────────────────────────────────────

const productPanel: MegaMenuPanel = {
  columns: [
    {
      heading: "Build",
      links: [
        {
          label: "Resume builder",
          href: "/resumes/new",
          description: "Start a new resume in under 5 minutes",
        },
        {
          label: "Try with OTP",
          href: "/try",
          description: "Build before signing up — verify with email later",
        },
        {
          label: "Cover letters",
          href: "/cover-letters",
          description: "Tailored cover letters for every application",
        },
        {
          label: "AI capabilities",
          href: "/features#capabilities",
          description: "Tailor to JD, ATS check, summary writing",
        },
        {
          label: "Examples",
          href: "/examples",
          description: "Real resumes from successful applicants",
        },
      ],
    },
    {
      heading: "Share",
      links: [
        {
          label: "Resume link",
          href: "/resume-link",
          description: "One URL, always up to date",
        },
        {
          label: "Pro Link upgrade",
          href: "/pricing#pro-link",
          description: "Custom URL, view analytics, no footer",
        },
      ],
    },
    {
      heading: "App",
      visibility: "signed-in-only",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Cover letters", href: "/cover-letters" },
        { label: "Jobs", href: "/jobs" },
        { label: "Interview prep", href: "/interview-prep" },
        { label: "Settings", href: "/settings" },
      ],
    },
  ],
  featuredRail: {
    kind: "pro-link",
    pillLabel: "Pro Link",
    headline: "Your resume, your URL.",
    benefits: ["Custom URL", "View analytics", "No footer"],
    ctaLabel: "Get Pro Link — ₹99/mo",
    ctaHref: "/pricing#pro-link",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Templates panel
// ────────────────────────────────────────────────────────────────────────────

const templatesPanel: MegaMenuPanel = {
  columns: [
    {
      heading: "By style",
      links: [
        { label: "Modern", href: "/templates?category=modern" },
        { label: "Classic", href: "/templates?category=classic" },
        { label: "Creative", href: "/templates?category=creative" },
        { label: "Minimal", href: "/templates?category=minimal" },
        { label: "Executive", href: "/templates?category=executive" },
        { label: "ATS-friendly", href: "/templates?category=ats" },
      ],
    },
    {
      heading: "By stage",
      links: [
        { label: "Fresher", href: "/templates" },
        { label: "Experienced", href: "/templates" },
        { label: "Career changer", href: "/templates" },
        { label: "Academic", href: "/templates" },
      ],
    },
    {
      heading: "By industry",
      links: [
        { label: "IT and software", href: "/templates" },
        { label: "Banking and finance", href: "/templates" },
        { label: "Marketing", href: "/templates" },
        { label: "Healthcare", href: "/templates" },
        { label: "Engineering", href: "/templates" },
        { label: "Government and PSU", href: "/templates" },
      ],
    },
  ],
  featuredRail: {
    kind: "template-tile",
    pillLabel: "Most popular",
    headline: "Professional",
    body: "The all-rounder. Recruiter-friendly, ATS-tested, India-ready.",
    ctaLabel: "See all 30 templates →",
    ctaHref: "/templates",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Solutions panel
// ────────────────────────────────────────────────────────────────────────────

const solutionsPanel: MegaMenuPanel = {
  columns: [
    {
      heading: "By career stage",
      links: [
        { label: "Fresher", href: "/try" },
        { label: "Experienced", href: "/try" },
        { label: "Career changer", href: "/try" },
        { label: "Academic", href: "/try" },
      ],
    },
    {
      heading: "By use case",
      links: [
        {
          label: "Apply on Naukri",
          href: "/lp/resume-builder-india",
          description: "India-first resume builder",
        },
        {
          label: "Tailor to job description",
          href: "/lp/tailor-resume-job-description",
          description: "Match keywords without rewriting",
        },
        {
          label: "Campus drives",
          href: "/lp/fresher-campus-resume-india",
          description: "Built for Indian fresher placements",
        },
        {
          label: "Export PDF and DOCX",
          href: "/lp/resume-export-pdf-docx-india",
          description: "Recruiter-ready exports in seconds",
        },
      ],
    },
    {
      heading: "By geography",
      links: [
        {
          label: "India-first features",
          href: "/features",
          description: "INR pricing, Naukri-friendly, fresher-ready",
        },
        {
          label: "Chennai job seekers",
          href: "/blog/resume-tips-chennai-job-seekers",
          description: "Resume tips tuned for Chennai roles",
        },
      ],
    },
  ],
  featuredRail: {
    kind: "trial-wedge",
    pillLabel: "Try Pro",
    headline: "14 days of Pro for ₹49",
    body: "Unlock every template, AI tools, exports. Cancel anytime.",
    ctaLabel: "Start 14-day Pro pass",
    ctaHref: "/pricing#trial",
    hideWhenPro: true,
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Resources panel
// ────────────────────────────────────────────────────────────────────────────

const resourcesPanel: MegaMenuPanel = {
  columns: [
    {
      heading: "Guides",
      links: [
        {
          label: "ATS-friendly resume guide",
          href: "/blog/ats-friendly-resume-complete-guide",
        },
        {
          label: "CV for freshers",
          href: "/blog/how-to-write-cv-for-freshers",
        },
        {
          label: "Cover letter examples",
          href: "/blog/cover-letter-examples-india",
        },
        {
          label: "Resume formats (India)",
          href: "/blog/resume-formats-india-guide",
        },
        {
          label: "Professional summary",
          href: "/blog/how-to-write-professional-summary",
        },
      ],
    },
    {
      heading: "Free tools",
      links: [
        {
          label: "Resume checklist",
          href: "/blog/resume-checklist-before-you-apply",
          description: "30-point pre-apply review",
        },
        {
          label: "ATS score check",
          href: "/features#ats-support",
          description: "See what passes ATS gates",
        },
        {
          label: "Cover letter writer",
          href: "/cover-letters/new",
          description: "Preview the AI cover letter writer",
        },
      ],
    },
    {
      heading: "For the curious",
      links: [
        { label: "About", href: "/about" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Blog", href: "/blog" },
      ],
    },
  ],
  featuredRail: {
    kind: "blog-tile",
    pillLabel: "Latest from the blog",
    headline: "ATS-friendly resume — complete guide",
    body: "How to write a resume that passes Naukri, Workday, and Greenhouse ATS scans.",
    ctaLabel: "Read the guide →",
    ctaHref: "/blog/ats-friendly-resume-complete-guide",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Top-level items (left-to-right order)
// ────────────────────────────────────────────────────────────────────────────

export const MEGA_MENU_ITEMS: MegaMenuTopItem[] = [
  { type: "panel", label: "Product", panel: productPanel },
  { type: "panel", label: "Templates", panel: templatesPanel },
  { type: "panel", label: "Solutions", panel: solutionsPanel },
  { type: "panel", label: "Resources", panel: resourcesPanel },
  { type: "link", label: "Pricing", href: "/pricing" },
];
