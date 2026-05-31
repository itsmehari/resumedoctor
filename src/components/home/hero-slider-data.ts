export type HeroSlideCtaVariant = "accent" | "trial";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  headline: string;
  headlineHighlight?: string;
  subheadline: string;
  priceDetail: string;
  proofLine: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: HeroSlideCtaVariant;
  secondaryLabel: string;
  secondaryHref: string;
};

export const HERO_TITLE_CARD =
  "At ₹49 — build your resume in less than 2 minutes, at the cost of a pizza";

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "pizza",
    eyebrow: "India-first resume builder",
    headline: "Design your resume for the cost of a pizza",
    headlineHighlight: "the cost of a pizza",
    subheadline:
      "A professional, ATS-ready CV — for less than one slice. Built for freshers to senior roles across India.",
    priceDetail: "one-time · 14-day full Pro pass",
    proofLine: "PDF + Word export · 30+ templates · AI writing · unlimited ATS checks",
    ctaLabel: "Start for ₹49",
    ctaHref: "/pricing#trial",
    ctaVariant: "accent",
    secondaryLabel: "See what's included",
    secondaryHref: "/pricing",
  },
  {
    id: "export",
    eyebrow: "Stop sending broken PDFs",
    headline: "Download a recruiter-ready PDF in one click",
    headlineHighlight: "recruiter-ready PDF",
    subheadline:
      "No watermarks. No Word formatting fights. Export clean PDF and DOCX the way HR and ATS systems expect.",
    priceDetail: "14 days · every export unlocked",
    proofLine: "One payment. Full Pro. No auto-renew.",
    ctaLabel: "Unlock exports — ₹49",
    ctaHref: "/pricing#trial",
    ctaVariant: "accent",
    secondaryLabel: "Preview templates first",
    secondaryHref: "/templates",
  },
  {
    id: "ats",
    eyebrow: "Built for Naukri, LinkedIn & campus drives",
    headline: "Get past ATS filters. Land more interviews.",
    headlineHighlight: "ATS filters",
    subheadline:
      "Templates and checks tuned for how Indian recruiters and job portals actually screen CVs.",
    priceDetail: "full Pro · 14 days to apply everywhere",
    proofLine: "Unlimited ATS score checks + AI bullet rewrites",
    ctaLabel: "Get interview-ready — ₹49",
    ctaHref: "/pricing#trial",
    ctaVariant: "accent",
    secondaryLabel: "Free ATS check",
    secondaryHref: "/ats-resume-checker",
  },
  {
    id: "trial-pass",
    eyebrow: "Less than a coffee a day",
    headline: "14 days of full Pro — try everything before you commit",
    headlineHighlight: "14 days of full Pro",
    subheadline:
      "₹49 once. No card on file. No auto-renew. Use every template, export, and AI tool while you apply.",
    priceDetail: "vs ₹199/mo · ~₹3.50/day",
    proofLine: "Same email at checkout = instant unlock",
    ctaLabel: "Pay ₹49 — 14-day full Pro",
    ctaHref: "/pricing#trial",
    ctaVariant: "trial",
    secondaryLabel: "Compare all plans",
    secondaryHref: "/pricing",
  },
];

export const HERO_SLIDER_INTERVAL_MS = 6000;
