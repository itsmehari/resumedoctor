// WBS 3.1, 9.3 – Resume content helpers + keyword extraction
import type { ResumeContent, ResumeSection, ExperienceSection, EducationSection } from "@/types/resume";

export function generateSectionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function migrateExperienceSection(s: unknown): ExperienceSection | null {
  if (!s || typeof s !== "object" || !("type" in s) || (s as { type: string }).type !== "experience") return null;
  const sec = s as { id?: string; type: string; order?: number; data?: unknown };
  if (!sec.data || typeof sec.data !== "object") return null;
  const d = sec.data as Record<string, unknown>;
  if (Array.isArray(d.entries) && d.entries.length > 0) {
    const entries = d.entries as Array<Record<string, unknown>>;
    const normalized = entries.map((e) => ({
      id: (e.id as string) || generateSectionId(),
      title: (e.title as string) || "",
      company: (e.company as string) || "",
      location: e.location as string | undefined,
      startDate: (e.startDate as string) || "",
      endDate: (e.endDate as string) || "",
      current: !!e.current,
      bullets: Array.isArray(e.bullets) ? (e.bullets as string[]) : [""],
    }));
    return { id: sec.id || generateSectionId(), type: "experience", order: sec.order ?? 0, data: { entries: normalized } } as ExperienceSection;
  }
  const entry = {
    id: generateSectionId(),
    title: (d.title as string) || "",
    company: (d.company as string) || "",
    location: d.location as string | undefined,
    startDate: (d.startDate as string) || "",
    endDate: (d.endDate as string) || "",
    current: !!d.current,
    bullets: Array.isArray(d.bullets) ? (d.bullets as string[]) : [""],
  };
  return { id: sec.id || generateSectionId(), type: "experience", order: sec.order ?? 0, data: { entries: [entry] } } as ExperienceSection;
}

function migrateEducationSection(s: unknown): EducationSection | null {
  if (!s || typeof s !== "object" || !("type" in s) || (s as { type: string }).type !== "education") return null;
  const sec = s as { id?: string; type: string; order?: number; data?: unknown };
  if (!sec.data || typeof sec.data !== "object") return null;
  const d = sec.data as Record<string, unknown>;
  if (Array.isArray(d.entries) && d.entries.length > 0) {
    const entries = d.entries as Array<Record<string, unknown>>;
    const normalized = entries.map((e) => ({
      id: (e.id as string) || generateSectionId(),
      degree: (e.degree as string) || "",
      school: (e.school as string) || "",
      location: e.location as string | undefined,
      startDate: (e.startDate as string) || "",
      endDate: (e.endDate as string) || "",
      details: e.details as string | undefined,
    }));
    return { id: sec.id || generateSectionId(), type: "education", order: sec.order ?? 0, data: { entries: normalized } } as EducationSection;
  }
  const entry = {
    id: generateSectionId(),
    degree: (d.degree as string) || "",
    school: (d.school as string) || "",
    location: d.location as string | undefined,
    startDate: (d.startDate as string) || "",
    endDate: (d.endDate as string) || "",
    details: d.details as string | undefined,
  };
  return { id: sec.id || generateSectionId(), type: "education", order: sec.order ?? 0, data: { entries: [entry] } } as EducationSection;
}

export function parseResumeContent(content: unknown): ResumeContent {
  if (!content || typeof content !== "object") {
    return { sections: [] };
  }
  const obj = content as Record<string, unknown>;
  const rawSections = Array.isArray(obj.sections) ? obj.sections : [];
  const meta = obj.meta && typeof obj.meta === "object" ? (obj.meta as ResumeContent["meta"]) : undefined;

  const sections: ResumeContent["sections"] = rawSections
    .filter((s) => s && typeof s === "object" && "id" in s && "type" in s)
    .map((s) => {
      if ((s as { type: string }).type === "experience") return migrateExperienceSection(s);
      if ((s as { type: string }).type === "education") return migrateEducationSection(s);
      return s as ResumeSection;
    })
    .filter((s): s is ResumeSection => !!s);

  return { sections, ...(meta && { meta }) };
}

/** Concatenate resume section text for keyword / ATS-style matching (lowercased). */
export function resumeSectionsToPlainText(sections: ResumeSection[]): string {
  const parts: string[] = [];
  for (const s of sections) {
    if (s.type === "summary" && s.data.text) parts.push(s.data.text);
    if (s.type === "experience") {
      const d = s.data as { entries?: Array<{ title: string; company: string; bullets?: string[] }> };
      const entries = d.entries ?? [d as { title: string; company: string; bullets?: string[] }];
      const expList = Array.isArray(entries) ? entries : [entries];
      for (const e of expList) {
        if (e.title) parts.push(e.title);
        if (e.company) parts.push(e.company);
        if (e.bullets) parts.push(...e.bullets);
      }
    }
    if (s.type === "education") {
      const d = s.data as { entries?: Array<{ degree: string; school: string }> };
      const entries = d.entries ?? [d as { degree: string; school: string }];
      const eduList = Array.isArray(entries) ? entries : [entries];
      for (const e of eduList) {
        if (e.degree) parts.push(e.degree);
        if (e.school) parts.push(e.school);
      }
    }
    if (s.type === "skills" && s.data.items) parts.push(...s.data.items);
    if (s.type === "projects") {
      const d = s.data;
      if ("entries" in d && Array.isArray(d.entries)) {
        for (const p of d.entries) {
          if (p.name) parts.push(p.name);
          if (p.description) parts.push(p.description);
          if (p.link) parts.push(p.link);
          if (p.tech?.length) parts.push(...p.tech);
          if (p.bullets?.length) parts.push(...p.bullets);
        }
      } else {
        const legacy = d as {
          name?: string;
          description?: string;
          link?: string;
          bullets?: string[];
        };
        if (legacy.name) parts.push(legacy.name);
        if (legacy.description) parts.push(legacy.description);
        if (legacy.link) parts.push(legacy.link);
        if (legacy.bullets?.length) parts.push(...legacy.bullets);
      }
    }
    if (s.type === "contact") {
      const c = s.data as { name?: string; title?: string; email?: string };
      if (c.name) parts.push(c.name);
      if (c.title) parts.push(c.title);
    }
    if (s.type === "objective" && "text" in s.data && s.data.text) parts.push(String(s.data.text));
  }
  return parts.join(" ").toLowerCase();
}

/**
 * WBS 9.3 – Extract keywords from resume content for job matching.
 * Returns skills, job titles, and key nouns.
 */
export function extractResumeKeywords(content: unknown): string[] {
  const parsed = parseResumeContent(content);
  const keywords = new Set<string>();

  for (const section of parsed.sections) {
    if (section.type === "skills") {
      const items = (section.data as { items?: string[] }).items ?? [];
      items.forEach((i) => i?.trim() && keywords.add(i.trim()));
    } else if (section.type === "experience") {
      const entries = (section.data as { entries?: Array<{ title?: string; bullets?: string[] }> }).entries ?? [];
      for (const entry of entries) {
        if (entry.title?.trim()) keywords.add(entry.title.trim());
        for (const bullet of entry.bullets ?? []) {
          const words = bullet.split(/\s+/).filter((w) => w.length > 4);
          words.forEach((w) => keywords.add(w.replace(/[^a-zA-Z0-9+#.]/g, "").trim()).toString());
        }
      }
    } else if (section.type === "contact") {
      const title = (section.data as { title?: string }).title;
      if (title?.trim()) keywords.add(title.trim());
    }
  }

  return Array.from(keywords).filter(Boolean).slice(0, 80);
}

/** Compute resume completion percentage (0–100) */
export function computeResumeProgress(sections: ResumeContent["sections"]): number {
  if (!sections?.length) return 0;
  const weights: Record<string, number> = {
    contact: 20,
    summary: 15,
    experience: 30,
    education: 15,
    skills: 10,
    projects: 10,
  };
  let total = 0;
  let scored = 0;
  for (const s of sections) {
    const w = weights[s.type] ?? 10;
    total += w;
    const filled = isSectionFilled(s);
    scored += filled ? w : 0;
  }
  if (total === 0) return 0;
  return Math.round((scored / total) * 100);
}

function isSectionFilled(s: ResumeSection): boolean {
  const d = s.data;
  if (!d || typeof d !== "object") return false;
  switch (s.type) {
    case "contact": {
      const c = d as { name?: string; email?: string };
      return !!(c.name?.trim() && c.email?.trim());
    }
    case "summary": {
      const t = (d as { text?: string }).text;
      return !!(t && t.trim().length >= 50);
    }
    case "experience": {
      const entries = "entries" in d ? (d as { entries?: unknown[] }).entries : [d];
      const arr = Array.isArray(entries) ? entries : [];
      return arr.some((e) => {
        const x = e as { title?: string; company?: string; bullets?: string[] };
        return !!(x.title?.trim() && x.company?.trim() && (x.bullets?.some((b) => b?.trim()) ?? false));
      });
    }
    case "education": {
      const entries = "entries" in d ? (d as { entries?: unknown[] }).entries : [d];
      const arr = Array.isArray(entries) ? entries : [];
      return arr.some((e) => {
        const x = e as { degree?: string; school?: string };
        return !!(x.degree?.trim() && x.school?.trim());
      });
    }
    case "skills": {
      const items = (d as { items?: string[] }).items;
      return !!(Array.isArray(items) && items.some((i) => i?.trim()));
    }
    case "projects": {
      const name = (d as { name?: string }).name;
      return !!(name?.trim());
    }
    default:
      return false;
  }
}
