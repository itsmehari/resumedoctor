// WBS 12.3, 12.4 – Resume examples library (static content)
import fs from "fs";
import path from "path";

export type ExamplePriorityTier = "A" | "B" | "C";

/** Role-specific tools to emphasize on the resume by career stage (India hiring). */
export interface ExampleToolsByLevel {
  earlyCareer: string[];
  midLevel: string[];
  senior: string[];
}

export interface ResumeExample {
  slug: string;
  title: string;
  role: string;
  industry: string;
  description: string;
  tips: string[];
  suggestedSections: string[];
  sampleSummary: string;
  sampleBullets: string[];
  mistakesToAvoid: string[];
  atsIntro: string;
  atsKeywords: string[];
  atsChecklist: string[];
  indiaContext?: string;
  /** How AI tools fit this role: assistive drafting vs core skills interviews still test. */
  aiEraNote: string;
  toolsByLevel: ExampleToolsByLevel;
  priorityTier: ExamplePriorityTier;
}

const INDEX_PATH = path.join(process.cwd(), "content", "examples", "index.json");

const TIER_ORDER: Record<ExamplePriorityTier, number> = { A: 0, B: 1, C: 2 };

const EMPTY_TOOLS: ExampleToolsByLevel = {
  earlyCareer: [],
  midLevel: [],
  senior: [],
};

function stringArray(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  return x.filter((i): i is string => typeof i === "string");
}

function normalizeToolsByLevel(raw: unknown): ExampleToolsByLevel {
  if (!raw || typeof raw !== "object") return { ...EMPTY_TOOLS };
  const o = raw as Record<string, unknown>;
  return {
    earlyCareer: stringArray(o.earlyCareer),
    midLevel: stringArray(o.midLevel),
    senior: stringArray(o.senior),
  };
}

/** Merge JSON entries with defaults so partial content files never break the site. */
function normalizeResumeExample(raw: unknown): ResumeExample | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.slug !== "string" || typeof r.title !== "string") return null;

  const tips = stringArray(r.tips);
  const suggestedSections = stringArray(r.suggestedSections);
  const tier =
    r.priorityTier === "A" || r.priorityTier === "B" || r.priorityTier === "C"
      ? r.priorityTier
      : "C";

  return {
    slug: r.slug,
    title: r.title,
    role: typeof r.role === "string" ? r.role : r.title,
    industry: typeof r.industry === "string" ? r.industry : "All",
    description: typeof r.description === "string" ? r.description : "",
    tips:
      tips.length > 0
        ? tips
        : ["Tailor each bullet to the job description and keep formatting ATS-friendly."],
    suggestedSections:
      suggestedSections.length > 0
        ? suggestedSections
        : ["Summary", "Experience", "Skills", "Education"],
    sampleSummary: typeof r.sampleSummary === "string" ? r.sampleSummary : "",
    sampleBullets: stringArray(r.sampleBullets),
    mistakesToAvoid: stringArray(r.mistakesToAvoid),
    atsIntro:
      typeof r.atsIntro === "string"
        ? r.atsIntro
        : "Mirror truthful keywords from the job description in your summary and skills.",
    atsKeywords: stringArray(r.atsKeywords),
    atsChecklist: stringArray(r.atsChecklist),
    indiaContext: typeof r.indiaContext === "string" ? r.indiaContext : undefined,
    aiEraNote:
      typeof r.aiEraNote === "string"
        ? r.aiEraNote
        : "Use AI to draft and iterate, but verify every claim and keep interviews explainable.",
    toolsByLevel: normalizeToolsByLevel(r.toolsByLevel),
    priorityTier: tier,
  };
}

function loadExamples(): ResumeExample[] {
  if (!fs.existsSync(INDEX_PATH)) return [];
  const raw = fs.readFileSync(INDEX_PATH, "utf-8");
  let data: unknown[];
  try {
    data = JSON.parse(raw) as unknown[];
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data.map(normalizeResumeExample).filter((e): e is ResumeExample => e !== null);
}

export function getAllExamples(): ResumeExample[] {
  return loadExamples();
}

/** Stable sort: Priority A first, then B, then C (for index / nav). */
export function getExamplesSortedByTier(): ResumeExample[] {
  return [...loadExamples()].sort(
    (a, b) => TIER_ORDER[a.priorityTier] - TIER_ORDER[b.priorityTier],
  );
}

export function getExampleBySlug(slug: string): ResumeExample | null {
  return loadExamples().find((e) => e.slug === slug) ?? null;
}

export function getExampleSlugs(): string[] {
  return loadExamples().map((e) => e.slug);
}
