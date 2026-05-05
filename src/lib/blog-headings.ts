import GithubSlugger from "github-slugger";

export interface MarkdownHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

/** Extract h2/h3 from markdown; ids match rehype-slug / GitHub (github-slugger). */
export function extractMarkdownHeadings(md: string): MarkdownHeading[] {
  const slugger = new GithubSlugger();
  const out: MarkdownHeading[] = [];
  if (md.includes("<WhyAudienceGrid")) {
    out.push({ depth: 2, text: "Why tailoring matters", id: slugger.slug("Why tailoring matters") });
  }
  const lines = md.split(/\r?\n/);
  for (const line of lines) {
    const m = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    if (depth !== 2 && depth !== 3) continue;
    const text = m[2].replace(/\s+#+\s*$/, "").trim();
    const id = slugger.slug(text);
    out.push({ depth, text, id });
  }
  return out;
}

/**
 * Split markdown after the second ## section (preamble + section1 + section2 | rest).
 * Returns null if not enough structure for a mid-article insert.
 */
export function splitContentForMidRelated(md: string): { first: string; rest: string } | null {
  const re = /(?=^## [^\n#])/m;
  const parts = md.split(re);
  /** Need preamble + 3 ## sections so we can insert after the 2nd block. */
  if (parts.length < 4) return null;
  const first = parts[0] + parts[1] + parts[2];
  const rest = parts.slice(3).join("");
  if (!rest.trim()) return null;
  return { first, rest };
}
