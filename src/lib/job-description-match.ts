// Deterministic JD ↔ resume keyword overlap (no LLM)
import type { ResumeSection } from "@/types/resume";
import { resumeSectionsToPlainText } from "@/lib/resume-utils";

export interface JobDescriptionMatchResult {
  /** 0–100: share of ranked JD terms found in resume text */
  score: number;
  matchedTerms: string[];
  missingTerms: string[];
  /** Number of JD terms used in the score */
  termCount: number;
}

/** Job-post boilerplate and common English tokens to ignore */
const STOPWORDS = new Set([
  "a",
  "about",
  "above",
  "across",
  "after",
  "against",
  "all",
  "also",
  "an",
  "and",
  "any",
  "application",
  "applications",
  "apply",
  "applying",
  "are",
  "as",
  "at",
  "background",
  "be",
  "been",
  "before",
  "being",
  "below",
  "benefits",
  "between",
  "both",
  "build",
  "business",
  "by",
  "can",
  "candidate",
  "candidates",
  "client",
  "clients",
  "collaborate",
  "collaboration",
  "collaborative",
  "communication",
  "communications",
  "company",
  "competitive",
  "contact",
  "could",
  "current",
  "customer",
  "customers",
  "day",
  "days",
  "degree",
  "deliver",
  "description",
  "detail",
  "did",
  "disability",
  "disclosure",
  "do",
  "does",
  "doing",
  "don",
  "drive",
  "dynamic",
  "each",
  "education",
  "eg",
  "email",
  "employee",
  "employees",
  "employer",
  "employment",
  "ensure",
  "environment",
  "equal",
  "equivalent",
  "etc",
  "even",
  "ever",
  "excellent",
  "experience",
  "experienced",
  "fast",
  "few",
  "field",
  "first",
  "for",
  "four",
  "from",
  "full",
  "future",
  "gender",
  "get",
  "global",
  "go",
  "good",
  "got",
  "great",
  "had",
  "has",
  "have",
  "having",
  "he",
  "help",
  "her",
  "here",
  "high",
  "him",
  "hire",
  "hiring",
  "his",
  "how",
  "hybrid",
  "ie",
  "if",
  "including",
  "into",
  "interpersonal",
  "is",
  "it",
  "its",
  "join",
  "just",
  "last",
  "leadership",
  "level",
  "link",
  "location",
  "looking",
  "made",
  "make",
  "management",
  "many",
  "may",
  "might",
  "minimum",
  "month",
  "months",
  "more",
  "most",
  "much",
  "multiple",
  "must",
  "need",
  "needs",
  "new",
  "next",
  "no",
  "nor",
  "not",
  "now",
  "off",
  "office",
  "old",
  "on",
  "once",
  "one",
  "only",
  "opening",
  "opportunity",
  "oral",
  "or",
  "orientated",
  "oriented",
  "organization",
  "other",
  "our",
  "out",
  "over",
  "own",
  "paced",
  "part",
  "perform",
  "per",
  "please",
  "plus",
  "position",
  "preferred",
  "previous",
  "projects",
  "provide",
  "proven",
  "qualification",
  "qualifications",
  "race",
  "range",
  "record",
  "related",
  "religion",
  "remote",
  "required",
  "requirement",
  "requirements",
  "responsibilities",
  "responsible",
  "role",
  "salary",
  "same",
  "schedule",
  "seeking",
  "self",
  "send",
  "several",
  "shall",
  "she",
  "should",
  "similar",
  "site",
  "skill",
  "skills",
  "so",
  "some",
  "stakeholders",
  "status",
  "still",
  "strong",
  "submit",
  "such",
  "support",
  "team",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "three",
  "through",
  "time",
  "title",
  "to",
  "too",
  "track",
  "travel",
  "two",
  "under",
  "until",
  "up",
  "us",
  "various",
  "verbal",
  "very",
  "via",
  "veteran",
  "was",
  "way",
  "we",
  "website",
  "week",
  "weeks",
  "well",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "whose",
  "why",
  "will",
  "with",
  "within",
  "without",
  "work",
  "worker",
  "working",
  "would",
  "written",
  "year",
  "years",
  "you",
  "your",
]);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termInResume(resumeText: string, term: string): boolean {
  const t = term.toLowerCase();
  if (t.includes(" ") || /[^a-z0-9]/.test(t)) {
    return resumeText.includes(t);
  }
  if (t.length <= 4) {
    const re = new RegExp(`\\b${escapeRegExp(t)}\\b`, "i");
    return re.test(resumeText);
  }
  return resumeText.includes(t);
}

function collectTermScores(jd: string): Map<string, number> {
  const normalized = jd.toLowerCase().replace(/[''`]/g, " ");
  const counts = new Map<string, number>();
  const re = /\b[a-z][a-z0-9+#.-]{2,}\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(normalized)) !== null) {
    let token = m[0].replace(/^\.+|\.+$/g, "");
    if (token.includes("/")) {
      for (const part of token.split("/")) {
        const p = part.trim().toLowerCase();
        if (p.length >= 3 && !STOPWORDS.has(p)) {
          counts.set(p, (counts.get(p) ?? 0) + 1);
        }
      }
      continue;
    }
    if (token.length < 3 || STOPWORDS.has(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
}

/**
 * Ranks tokens from the job description by frequency, takes the top terms,
 * and scores how many appear in the resume (plain text from sections).
 */
export function computeJobDescriptionMatch(
  sections: ResumeSection[],
  jobDescription: string
): JobDescriptionMatchResult {
  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const resumeText = resumeSectionsToPlainText(sorted);
  const jd = jobDescription.trim();
  if (!jd) {
    return { score: 0, matchedTerms: [], missingTerms: [], termCount: 0 };
  }

  const scores = collectTermScores(jd);
  const ranked = Array.from(scores.entries()).sort(
    (a, b) => b[1] - a[1] || b[0].length - a[0].length
  );
  const terms = ranked.slice(0, 55).map(([t]) => t);

  const matchedTerms: string[] = [];
  const missingTerms: string[] = [];
  for (const term of terms) {
    if (termInResume(resumeText, term)) matchedTerms.push(term);
    else missingTerms.push(term);
  }

  const termCount = terms.length;
  const score =
    termCount === 0 ? 0 : Math.round((matchedTerms.length / termCount) * 100);

  return { score, matchedTerms, missingTerms, termCount };
}
