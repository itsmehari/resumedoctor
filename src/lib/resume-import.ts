// Phase 1.1 – Resume import (PDF/DOCX): extract text and parse with AI
import type { ResumeContent, ResumeSection } from "@/types/resume";
import { chatCompletion, isAiConfigured } from "@/lib/ai-client";
import { generateSectionId } from "@/lib/resume-utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Use Node-specific export to avoid pdfjs-dist webpack bundling issues (Object.defineProperty)
  const mod = await import("pdf-parse/node");
  const pdfParse = typeof mod === "function" ? mod : (mod as { default?: (b: Buffer) => Promise<{ text?: string }> }).default;
  if (!pdfParse) throw new Error("pdf-parse not available");
  const data = await pdfParse(buffer);
  return (data?.text || "").trim();
}

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return (result?.value || "").trim();
}

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractTextFromPdf(buffer);
  }
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return extractTextFromDocx(buffer);
  }
  throw new Error(
    `Unsupported file type: ${mimeType}. Use PDF or DOCX.`
  );
}

export function validateFile(
  file: { size: number; type: string },
  acceptedTypes: string[]
): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size is 10MB.`);
  }
  if (!acceptedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a PDF or DOCX file.");
  }
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export function isImportSupported(): boolean {
  return isAiConfigured();
}

/** Parse raw resume text into structured ResumeContent using AI */
export async function parseResumeWithAi(rawText: string): Promise<ResumeContent> {
  if (!rawText || rawText.trim().length < 50) {
    return { sections: [] };
  }

  const truncated = rawText.slice(0, 12000);
  const prompt = `Parse this resume text into structured JSON. Extract:
- contact: name, email, phone, location, linkedin, github, portfolio, website
- summary: professional summary (2-3 sentences)
- experience: array of { title, company, location, startDate, endDate, current, bullets[] }
- education: array of { degree, school, location, startDate, endDate, gpa?, honours? }
- skills: items array (and optionally categories: { name, items[] })
- projects: array of { name, description, link, bullets[], tech[] }
- certifications: array of { name, issuer, date, credentialId?, url? }
- languages: array of { name, proficiency: Native|Fluent|Conversational|Basic }
- awards: array of { title, issuer?, date, description? }
- volunteer: array of { role, organization, location, startDate, endDate, current, bullets[] }

Return ONLY valid JSON in this exact shape (no markdown, no extra text):
{
  "sections": [
    { "id": "string", "type": "contact|summary|experience|education|skills|projects|certifications|languages|awards|volunteer", "order": number, "data": {...} }
  ]
}

Use order: 0=contact, 1=summary, 2=experience, 3=education, 4=skills, 5=projects, etc.
Generate UUID-like ids (e.g. "sec-1", "sec-2"). If a section has no data, omit it.
Resume text:
---
${truncated}
---`;

  const content = await chatCompletion(
    [
      {
        role: "system",
        content:
          "You are a resume parser. Output only valid JSON. No markdown code blocks, no explanations.",
      },
      { role: "user", content: prompt },
    ],
    { maxTokens: 4000 }
  );

  if (!content) return { sections: [] };

  const cleaned = content.replace(/```json|```/g, "").trim();
  let parsed: { sections?: unknown[] };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { sections: [] };
  }

  const rawSections = Array.isArray(parsed?.sections) ? parsed.sections : [];
  const sections: ResumeSection[] = [];
  let order = 0;

  for (const s of rawSections) {
    if (!s || typeof s !== "object" || !("type" in s) || !("data" in s))
      continue;
    const sec = s as { type: string; data: unknown; id?: string };
    const id = (sec.id as string) || generateSectionId();

    const normalized = normalizeSection(sec.type, sec.data, id, order);
    if (normalized) {
      sections.push(normalized);
      order++;
    }
  }

  return { sections };
}

function normalizeSection(
  type: string,
  data: unknown,
  id: string,
  order: number
): ResumeSection | null {
  const d = data as Record<string, unknown>;
  if (!d) return null;

  switch (type) {
    case "contact":
      return {
        id,
        type: "contact",
        order,
        data: {
          name: String(d.name ?? ""),
          title: d.title ? String(d.title) : undefined,
          email: String(d.email ?? ""),
          phone: String(d.phone ?? ""),
          location: String(d.location ?? ""),
          website: d.website ? String(d.website) : undefined,
          linkedin: d.linkedin ? String(d.linkedin) : undefined,
          github: d.github ? String(d.github) : undefined,
          portfolio: d.portfolio ? String(d.portfolio) : undefined,
        },
      };

    case "summary":
      return {
        id,
        type: "summary",
        order,
        data: { text: String(d.text ?? "") },
      };

    case "experience": {
      const entries = Array.isArray(d.entries) ? d.entries : [d];
      const normalized = entries
        .map((e) => {
          const x = e as Record<string, unknown>;
          if (!x?.title && !x?.company) return null;
          return {
            id: generateSectionId(),
            title: String(x.title ?? ""),
            company: String(x.company ?? ""),
            location: x.location ? String(x.location) : undefined,
            startDate: String(x.startDate ?? ""),
            endDate: String(x.endDate ?? ""),
            current: !!x.current,
            bullets: Array.isArray(x.bullets)
              ? (x.bullets as string[]).filter(Boolean)
              : [""],
          };
        })
        .filter(Boolean) as Array<{
        id: string;
        title: string;
        company: string;
        location?: string;
        startDate: string;
        endDate: string;
        current: boolean;
        bullets: string[];
      }>;
      if (normalized.length === 0) return null;
      return {
        id,
        type: "experience",
        order,
        data: { entries: normalized },
      };
    }

    case "education": {
      const eduEntries = Array.isArray(d.entries) ? d.entries : [d];
      const normalized = eduEntries
        .map((e) => {
          const x = e as Record<string, unknown>;
          if (!x?.degree && !x?.school) return null;
          return {
            id: generateSectionId(),
            degree: String(x.degree ?? ""),
            school: String(x.school ?? ""),
            location: x.location ? String(x.location) : undefined,
            startDate: String(x.startDate ?? ""),
            endDate: String(x.endDate ?? ""),
            details: x.details ? String(x.details) : undefined,
            gpa: x.gpa ? String(x.gpa) : undefined,
            honours: x.honours ? String(x.honours) : undefined,
          };
        })
        .filter(Boolean) as Array<{
        id: string;
        degree: string;
        school: string;
        location?: string;
        startDate: string;
        endDate: string;
        details?: string;
        gpa?: string;
        honours?: string;
      }>;
      if (normalized.length === 0) return null;
      return {
        id,
        type: "education",
        order,
        data: { entries: normalized },
      };
    }

    case "skills": {
      const items = Array.isArray(d.items)
        ? (d.items as string[]).filter(Boolean)
        : [];
      const categories = Array.isArray(d.categories)
        ? (d.categories as Array<{ name?: string; items?: string[] }>)
            .map((c) => ({
              name: String(c?.name ?? ""),
              items: Array.isArray(c?.items) ? (c.items as string[]) : [],
            }))
            .filter((c) => c.name || c.items.length > 0)
        : undefined;
      if (items.length === 0 && !categories?.length) return null;
      return {
        id,
        type: "skills",
        order,
        data: { items: items.length ? items : [""], ...(categories?.length && { categories }) },
      };
    }

    case "projects": {
      const projEntries = Array.isArray(d.entries) ? d.entries : [d];
      const normalized = projEntries
        .map((e) => {
          const x = e as Record<string, unknown>;
          if (!x?.name) return null;
          return {
            id: generateSectionId(),
            name: String(x.name ?? ""),
            description: x.description ? String(x.description) : undefined,
            link: x.link ? String(x.link) : undefined,
            bullets: Array.isArray(x.bullets) ? (x.bullets as string[]) : [""],
            tech: Array.isArray(x.tech) ? (x.tech as string[]) : undefined,
            startDate: x.startDate ? String(x.startDate) : undefined,
            endDate: x.endDate ? String(x.endDate) : undefined,
          };
        })
        .filter(Boolean) as Array<{
        id: string;
        name: string;
        description?: string;
        link?: string;
        bullets: string[];
        tech?: string[];
        startDate?: string;
        endDate?: string;
      }>;
      if (normalized.length === 0) return null;
      return {
        id,
        type: "projects",
        order,
        data: { entries: normalized },
      };
    }

    case "certifications": {
      const certEntries = Array.isArray(d.entries) ? d.entries : [d];
      const normalized = certEntries
        .map((e) => {
          const x = e as Record<string, unknown>;
          if (!x?.name) return null;
          return {
            id: generateSectionId(),
            name: String(x.name ?? ""),
            issuer: String(x.issuer ?? ""),
            date: String(x.date ?? ""),
            credentialId: x.credentialId ? String(x.credentialId) : undefined,
            url: x.url ? String(x.url) : undefined,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x != null);
      if (normalized.length === 0) return null;
      return {
        id,
        type: "certifications",
        order,
        data: { entries: normalized },
      };
    }

    case "languages": {
      const langEntries = Array.isArray(d.entries) ? d.entries : [d];
      const normalized = langEntries
        .map((e) => {
          const x = e as Record<string, unknown>;
          if (!x?.name) return null;
          const prof = String(x.proficiency ?? "Fluent");
          const valid =
            ["Native", "Fluent", "Conversational", "Basic"].includes(prof) ? prof : "Fluent";
          return {
            id: generateSectionId(),
            name: String(x.name ?? ""),
            proficiency: valid as "Native" | "Fluent" | "Conversational" | "Basic",
          };
        })
        .filter((x): x is NonNullable<typeof x> => x != null);
      if (normalized.length === 0) return null;
      return {
        id,
        type: "languages",
        order,
        data: { entries: normalized },
      };
    }

    case "awards": {
      const awardEntries = Array.isArray(d.entries) ? d.entries : [d];
      const normalized = awardEntries
        .map((e) => {
          const x = e as Record<string, unknown>;
          if (!x?.title) return null;
          return {
            id: generateSectionId(),
            title: String(x.title ?? ""),
            issuer: x.issuer ? String(x.issuer) : undefined,
            date: String(x.date ?? ""),
            description: x.description ? String(x.description) : undefined,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x != null);
      if (normalized.length === 0) return null;
      return {
        id,
        type: "awards",
        order,
        data: { entries: normalized },
      };
    }

    case "volunteer": {
      const volEntries = Array.isArray(d.entries) ? d.entries : [d];
      const normalized = volEntries
        .map((e) => {
          const x = e as Record<string, unknown>;
          if (!x?.role && !x?.organization) return null;
          return {
            id: generateSectionId(),
            role: String(x.role ?? ""),
            organization: String(x.organization ?? ""),
            location: x.location ? String(x.location) : undefined,
            startDate: String(x.startDate ?? ""),
            endDate: String(x.endDate ?? ""),
            current: !!x.current,
            bullets: Array.isArray(x.bullets) ? (x.bullets as string[]) : [""],
          };
        })
        .filter((x): x is NonNullable<typeof x> => x != null);
      if (normalized.length === 0) return null;
      return {
        id,
        type: "volunteer",
        order,
        data: { entries: normalized },
      };
    }

    default:
      return null;
  }
}

export { ACCEPTED_TYPES };
