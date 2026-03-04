// WBS 3.1 – Resume content helpers
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
