// WBS 12.3, 12.4 – Resume examples library (static content)
import fs from "fs";
import path from "path";

export interface ResumeExample {
  slug: string;
  title: string;
  role: string;
  industry: string;
  description: string;
  tips: string[];
}

const INDEX_PATH = path.join(process.cwd(), "content", "examples", "index.json");

function loadExamples(): ResumeExample[] {
  if (!fs.existsSync(INDEX_PATH)) return [];
  const raw = fs.readFileSync(INDEX_PATH, "utf-8");
  const data = JSON.parse(raw) as ResumeExample[];
  return Array.isArray(data) ? data : [];
}

export function getAllExamples(): ResumeExample[] {
  return loadExamples();
}

export function getExampleBySlug(slug: string): ResumeExample | null {
  return loadExamples().find((e) => e.slug === slug) ?? null;
}

export function getExampleSlugs(): string[] {
  return loadExamples().map((e) => e.slug);
}
