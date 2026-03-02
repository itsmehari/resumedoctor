// WBS 7.2, 7.3 – Rule-based ATS checks and suggestions
import type { ResumeSection } from "@/types/resume";

export interface AtsSuggestion {
  type: "warning" | "improvement" | "good";
  message: string;
  section?: string;
}

export interface AtsResult {
  score: number;
  suggestions: AtsSuggestion[];
  checks: { name: string; pass: boolean; detail?: string }[];
}

const ATS_KEYWORDS = [
  "achieved", "led", "managed", "improved", "developed", "implemented",
  "analytics", "collaboration", "leadership", "problem-solving",
  "results", "metrics", "efficiency", "revenue", "growth",
];

function extractText(sections: ResumeSection[]): string {
  const parts: string[] = [];
  for (const s of sections) {
    if (s.type === "summary" && s.data.text) parts.push(s.data.text);
    if (s.type === "experience") {
      const d = s.data;
      if (d.title) parts.push(d.title);
      if (d.company) parts.push(d.company);
      if (d.bullets) parts.push(...d.bullets);
    }
    if (s.type === "education") {
      const d = s.data;
      if (d.degree) parts.push(d.degree);
      if (d.school) parts.push(d.school);
    }
    if (s.type === "skills" && s.data.items) parts.push(...s.data.items);
    if (s.type === "projects") {
      const d = s.data;
      if (d.name) parts.push(d.name);
      if (d.bullets) parts.push(...(d.bullets || []));
    }
  }
  return parts.join(" ").toLowerCase();
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function computeAtsScore(sections: ResumeSection[]): AtsResult {
  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const fullText = extractText(sorted);
  const wordCount = countWords(fullText);
  const suggestions: AtsSuggestion[] = [];
  const checks: { name: string; pass: boolean; detail?: string }[] = [];

  let score = 0;
  const maxScore = 100;

  // Length check (300-800 words ideal)
  const lengthOk = wordCount >= 250 && wordCount <= 900;
  checks.push({
    name: "Length",
    pass: lengthOk,
    detail: `${wordCount} words (ideal: 300-800)`,
  });
  if (lengthOk) score += 20;
  else if (wordCount < 150) suggestions.push({ type: "warning", message: "Resume is too short. Add more detail to experience and skills.", section: "experience" });
  else if (wordCount > 1000) suggestions.push({ type: "improvement", message: "Resume may be too long. Consider condensing.", section: "experience" });

  // Has summary
  const hasSummary = sorted.some((s) => s.type === "summary" && s.data.text?.trim());
  checks.push({ name: "Professional summary", pass: hasSummary });
  if (hasSummary) score += 15;
  else suggestions.push({ type: "improvement", message: "Add a professional summary at the top.", section: "summary" });

  // Has experience
  const expSections = sorted.filter((s) => s.type === "experience");
  const hasExperience = expSections.length > 0;
  checks.push({ name: "Experience section", pass: hasExperience });
  if (hasExperience) score += 20;

  // Bullet points (action-oriented)
  let bulletCount = 0;
  for (const s of expSections) {
    bulletCount += (s.data.bullets?.filter(Boolean).length ?? 0);
  }
  const hasGoodBullets = bulletCount >= 3;
  checks.push({ name: "Achievement bullets (3+)", pass: hasGoodBullets, detail: `${bulletCount} bullets` });
  if (hasGoodBullets) score += 15;
  else if (hasExperience) suggestions.push({ type: "improvement", message: "Add more bullet points with quantifiable achievements.", section: "experience" });

  // Skills section
  const hasSkills = sorted.some((s) => s.type === "skills" && (s.data.items?.filter(Boolean).length ?? 0) > 0);
  checks.push({ name: "Skills section", pass: hasSkills });
  if (hasSkills) score += 15;

  // Keyword density (action verbs)
  const keywordMatches = ATS_KEYWORDS.filter((kw) => fullText.includes(kw)).length;
  const keywordScore = Math.min(15, Math.floor(keywordMatches * 2));
  checks.push({ name: "Action keywords", pass: keywordMatches >= 3, detail: `${keywordMatches} found` });
  score += keywordScore;
  if (keywordMatches < 3) suggestions.push({ type: "improvement", message: "Use more action verbs (e.g. achieved, led, improved)." });

  // Education
  const hasEducation = sorted.some((s) => s.type === "education");
  checks.push({ name: "Education section", pass: hasEducation });
  if (hasEducation) score += 15;

  // Normalize to 100
  score = Math.min(100, Math.round(score));

  if (score >= 80) suggestions.push({ type: "good", message: "Strong ATS compatibility!" });
  if (score >= 60 && score < 80) suggestions.push({ type: "good", message: "Good structure. Minor improvements could boost your score." });

  return { score, suggestions, checks };
}
