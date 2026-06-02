export type HeroSlideCtaVariant = "accent" | "trial";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  headline: string;
  headlineHighlight?: string;
  subheadline: string;
  priceDetail: string;
  priceAmount?: string;
  proofLine: string;
  ctaLabel: string;
  ctaVariant: HeroSlideCtaVariant;
  secondaryLabel: string;
  secondaryHref: string;
};

/** All primary hero CTAs start at /try (email-gated preview). */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "outcome",
    eyebrow: "Built for Indian job applications",
    headline: "Recruiter-ready resume in minutes",
    headlineHighlight: "Recruiter-ready",
    subheadline:
      "Pick a template, add your details, and get a stronger draft you can actually send — on portals, email, and DMs.",
    priceAmount: "Free",
    priceDetail: "start · email OTP · instant preview",
    proofLine: "Templates · AI writing help · Resume link you can share",
    ctaLabel: "Start free review",
    ctaVariant: "accent",
    secondaryLabel: "See how it works",
    secondaryHref: "/features",
  },
  {
    id: "preview",
    eyebrow: "Free resume review (email-gated)",
    headline: "Get top fixes + a sample rewrite",
    headlineHighlight: "top fixes",
    subheadline:
      "We’ll show you what to improve first — structure, impact, and keyword coverage — then you decide if you want to unlock export.",
    priceAmount: "Free",
    priceDetail: "preview · before you pay anything",
    proofLine: "Fast preview first · Upgrade only when you export",
    ctaLabel: "Get my free preview",
    ctaVariant: "accent",
    secondaryLabel: "Browse templates",
    secondaryHref: "/templates",
  },
  {
    id: "unlock",
    eyebrow: "Unlock when you’re ready to apply",
    headline: "Export PDF/DOCX + full report for ₹49",
    headlineHighlight: "₹49",
    subheadline:
      "One-time unlock to download portal-ready files and see every fix in detail. No auto-renew from ResumeDoctor.",
    priceAmount: "₹49",
    priceDetail: "one-time unlock · export + full report",
    proofLine: "Pay only when you export · Use the same email at checkout",
    ctaLabel: "Start free (unlock later)",
    ctaVariant: "accent",
    secondaryLabel: "See pricing",
    secondaryHref: "/pricing",
  },
];

export const HERO_SLIDER_INTERVAL_MS = 6000;

/** Maps each hero slide index to a hero visual (see hero-visual.tsx). */
export const HERO_SLIDE_VISUAL_BY_INDEX = [0, 1, 3, 2, 1] as const;
