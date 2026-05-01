// WBS 12.3, 12.4 – Resume examples library (static content)
import fs from "fs";
import path from "path";

export type ExamplePriorityTier = "A" | "B" | "C";

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
  priorityTier: ExamplePriorityTier;
}

const INDEX_PATH = path.join(process.cwd(), "content", "examples", "index.json");

const TIER_ORDER: Record<ExamplePriorityTier, number> = { A: 0, B: 1, C: 2 };

function loadExamples(): ResumeExample[] {
  if (!fs.existsSync(INDEX_PATH)) return [];
  const raw = fs.readFileSync(INDEX_PATH, "utf-8");
  const data = JSON.parse(raw) as ResumeExample[];
  return Array.isArray(data) ? data : [];
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
