/**
 * Single source of truth for /features capability cards and JSON-LD ItemList.
 */

export type FeatureTier = "try" | "basic" | "pro" | "mixed";

export type FeatureItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  tier: FeatureTier;
  tierLabel: string;
  iconKey: keyof typeof FEATURE_ICON_PATHS;
};

export const FEATURE_ICON_PATHS = {
  link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  template:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z",
  ai: "M13 10V3L4 14h7v7l9-11h-7z",
  match:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  ats: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  export:
    "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
} as const;

export const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: "resume-link",
    title: "Resume as a link",
    body: "Publish to a public URL like resumedoctor.in/r/your-name. Share on WhatsApp, LinkedIn, recruiter email, or a printed QR — it always shows your latest edits.",
    href: "/resume-link",
    linkLabel: "Resume link details",
    tier: "basic",
    tierLabel: "Basic+",
    iconKey: "link",
  },
  {
    id: "templates",
    title: "Recruiter-tested templates",
    body: "Layouts tuned for how recruiters and portal parsers read resumes in India. Pick a structure, then focus on achievements — not margins.",
    href: "/templates",
    linkLabel: "Browse templates",
    secondaryHref: "/blog/ats-friendly-resume-complete-guide",
    secondaryLabel: "ATS-friendly guide",
    tier: "try",
    tierLabel: "Try+",
    iconKey: "template",
  },
  {
    id: "ai-writing",
    title: "AI help for bullets and summary",
    body: "Turn rough notes into clearer bullets and a professional summary. You decide what gets sent.",
    href: "/blog/how-to-write-professional-summary",
    linkLabel: "Summary guide",
    tier: "basic",
    tierLabel: "Signed in",
    iconKey: "ai",
  },
  {
    id: "jd-match",
    title: "Keyword match vs a job description",
    body: "Paste a JD for a fast keyword match when signed in — no AI charge. Deeper AI tailoring uses your daily AI pool; limits are on pricing.",
    href: "/blog/how-to-read-ats-job-match-feedback",
    linkLabel: "How to read match feedback",
    tier: "basic",
    tierLabel: "Basic+",
    iconKey: "match",
  },
  {
    id: "ats",
    title: "ATS score checker",
    body: "See how well your resume follows best practices before you apply. Basic includes a teaser score per resume; Pro unlocks unlimited re-checks.",
    href: "/pricing",
    linkLabel: "Compare tiers",
    tier: "mixed",
    tierLabel: "Basic / Pro",
    iconKey: "ats",
  },
  {
    id: "exports",
    title: "Resume & cover letter exports",
    body: "TXT on Basic where shown. Portal-ready PDF and Word for resumes may need Pro or a resume pack; cover letter Word matches resume Word on Pro. Full detail on pricing.",
    href: "/pricing",
    linkLabel: "Pricing & limits",
    secondaryHref: "/cover-letters",
    secondaryLabel: "Cover letters (signed in)",
    tier: "pro",
    tierLabel: "Pro",
    iconKey: "export",
  },
];

/** Intent tab → ordered feature ids (subset & order for psychology). */
export const INTENT_FEATURE_ORDER: Record<
  "share" | "apply" | "tailor" | "fresher",
  string[]
> = {
  share: ["resume-link", "templates", "ai-writing", "exports", "jd-match", "ats"],
  apply: ["exports", "templates", "ats", "jd-match", "ai-writing", "resume-link"],
  tailor: ["jd-match", "ai-writing", "templates", "ats", "resume-link", "exports"],
  fresher: ["templates", "ai-writing", "resume-link", "jd-match", "ats", "exports"],
};

const byId = Object.fromEntries(FEATURE_ITEMS.map((f) => [f.id, f])) as Record<
  string,
  FeatureItem
>;

export function getFeaturesByIds(ids: string[]): FeatureItem[] {
  return ids.map((id) => byId[id]).filter(Boolean);
}

export const JOURNEY_STEPS: {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}[] = [
  {
    title: "Pick a template",
    body: "Start from layouts built for Indian portals and referral forwarding.",
    href: "/templates",
    linkLabel: "Templates",
  },
  {
    title: "Polish with AI",
    body: "Draft bullets and a summary from rough notes — you stay in control.",
    href: "/blog/how-to-write-professional-summary",
    linkLabel: "Summary tips",
  },
  {
    title: "Publish your link",
    body: "Share one URL that always reflects your latest version.",
    href: "/resume-link",
    linkLabel: "Resume link",
  },
  {
    title: "Tailor & check fit",
    body: "Match keywords to a JD and run readability checks before you apply.",
    href: "/blog/how-to-read-ats-job-match-feedback",
    linkLabel: "Match feedback",
  },
  {
    title: "Export when needed",
    body: "Portal-ready PDF and Word when your plan allows — upgrade on SuperProfile.",
    href: "/pricing",
    linkLabel: "Pricing",
  },
];

export const PILLAR_ITEMS = [
  "Create a polished resume quickly",
  "Keep it cloud-saved — edit anytime",
  "Manage multiple resumes for different roles",
  "Share one link — WhatsApp, LinkedIn, recruiter email",
] as const;
