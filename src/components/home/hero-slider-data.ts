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

/** All primary hero CTAs use SuperProfile ₹49 checkout (see hero-slider.tsx). */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "pizza",
    eyebrow: "India-first resume builder",
    headline: "A polished resume for less than a pizza",
    headlineHighlight: "less than a pizza",
    subheadline:
      "Build in minutes. Download PDF or Word. Built for freshers, campus drives, and experienced hires across India.",
    priceDetail: "one-time · 14-day full Pro",
    proofLine: "PDF + Word · 30+ templates · AI writing help",
    ctaLabel: "Start for ₹49",
    ctaVariant: "accent",
    secondaryLabel: "Try free preview",
    secondaryHref: "/try",
  },
  {
    id: "export",
    eyebrow: "Ready to send",
    headline: "Download a clean PDF in one click",
    headlineHighlight: "clean PDF",
    subheadline:
      "No watermarks. No broken formatting. Export files recruiters can open on any phone or laptop.",
    priceDetail: "14 days · every export unlocked",
    proofLine: "One payment. Full Pro. No auto-renew.",
    ctaLabel: "Unlock exports — ₹49",
    ctaVariant: "accent",
    secondaryLabel: "Browse templates",
    secondaryHref: "/templates",
  },
  {
    id: "interviews",
    eyebrow: "Naukri, LinkedIn & campus drives",
    headline: "Look sharp. Get more interview calls.",
    headlineHighlight: "interview calls",
    subheadline:
      "Layouts that read well on job portals and in recruiter inboxes — without jargon, without stress.",
    priceDetail: "full Pro · 14 days to apply",
    proofLine: "Role-fit tips + AI bullet rewrites",
    ctaLabel: "Get interview-ready — ₹49",
    ctaVariant: "accent",
    secondaryLabel: "See how it works",
    secondaryHref: "/features",
  },
  {
    id: "trial-pass",
    eyebrow: "Less than a coffee a day",
    headline: "14 days of full Pro — try before you commit",
    headlineHighlight: "14 days of full Pro",
    subheadline:
      "₹49 once. No card on file. No auto-renew. Every template, export, and AI tool while you apply.",
    priceDetail: "vs ₹199/mo · ~₹3.50/day",
    proofLine: "Same email at checkout = instant unlock",
    ctaLabel: "Pay ₹49 — 14-day full Pro",
    ctaVariant: "trial",
    secondaryLabel: "Compare plans",
    secondaryHref: "/pricing",
  },
  {
    id: "resume-link",
    eyebrow: "WhatsApp & LinkedIn ready",
    headline: "Share one link — not another PDF attachment",
    headlineHighlight: "one link",
    subheadline:
      "Paste your resume URL in a DM, email signature, or QR on your card. Update once — every shared link stays current.",
    priceAmount: "Free",
    priceDetail: "publish · Pro Link from ₹99/mo",
    proofLine: "Live demo at resumedoctor.in/r/demo",
    ctaLabel: "Pay ₹49 — full Pro + link",
    ctaVariant: "accent",
    secondaryLabel: "See live demo",
    secondaryHref: "/r/demo",
  },
];

export const HERO_SLIDER_INTERVAL_MS = 6000;
