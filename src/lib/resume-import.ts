// Phase 1.1 – Resume import (PDF/DOCX): extract text and parse with AI
import type { ResumeContent, ResumeSection } from "@/types/resume";
import { chatCompletion, isAiConfigured } from "@/lib/ai-client";
import { generateSectionId } from "@/lib/resume-utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const PDF_ERR =
    "Could not extract text from PDF. Try a different file or convert to DOCX.";

  // 1. pdf2json – zero deps, works on Vercel (needRawText=true for getRawTextContent)
  try {
    const PDFParser = (await import("pdf2json")).default;
    const text = await new Promise<string>((resolve, reject) => {
      const parser = new PDFParser(null, true);
      parser.on("pdfParser_dataError", (e: { parserError?: Error } | Error) =>
        reject((e && typeof e === "object" && "parserError" in e ? (e as { parserError?: Error }).parserError : e) ?? new Error("pdf2json error"))
      );
      parser.on("pdfParser_dataReady", () => {
        try {
          const raw = parser.getRawTextContent?.();
          resolve(typeof raw === "string" ? raw : "");
        } catch {
          resolve("");
        }
      });
      parser.parseBuffer(buffer);
    });
    if (text && text.trim().length > 0) return text.trim();
  } catch {
    // fall through
  }

  // 2. unpdf – serverless-optimized
  try {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    if (text && text.trim().length > 0) return text.trim();
  } catch {
    // fall through
  }

  // 3. pdf-parse – legacy fallback
  try {
    const mod = await import("pdf-parse");
    const fn = (mod as { default?: (b: Buffer) => Promise<{ text?: string }> }).default ?? mod;
    if (typeof fn === "function") {
      const data = await fn(buffer);
      const t = data?.text?.trim();
      if (t) return t;
    }
  } catch {
    // fall through
  }

  throw new Error(PDF_ERR);
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

const TEMPLATE_LIST = [
  "professional-in: Professional – corporate standard",
  "cascade: Cascade – color bar header, tag skills",
  "concept: Concept – timeline career, left-border headings",
  "crisp: Crisp – centered header, initials avatar",
  "cubic: Cubic – compact, icon-grid skills",
  "diamond: Diamond – two-column, professional",
  "enfold: Enfold – modern single column",
  "influx: Influx – creative layout",
  "minimal-in: Minimal – clean, minimal",
  "minimo: Minimo – ultra compact",
  "ats-minimal: ATS Minimal – strict ATS",
  "ats-strict: ATS Strict – maximum ATS",
  "nanica: Nanica – elegant",
  "modern: Modern – contemporary",
  "skill-based: Skill-based – skills focus",
  "hybrid: Hybrid – balanced layout",
  "fresher-in: Fresher – for students/entry-level",
  "student: Student – academic",
  "muse: Muse – creative",
  "combined: Combined – mixed sections",
  "midcareer-in: Midcareer – mid-level",
  "executive: Executive – senior/executive",
  "executive-modern: Executive Modern – executive contemporary",
  "tech: Tech – technology roles",
  "it: IT – IT industry",
  "iconic: Iconic – standout design",
  "creative-in: Creative – creative roles",
  "initials: Initials – avatar-focused",
  "traditional: Traditional – classic",
  "general: General – versatile",
];

export interface SuggestedTemplate {
  id: string;
  name: string;
  reason: string;
}

/** Use AI to suggest 2 best templates from parsed resume content */
export async function suggestTemplatesFromResume(parsed: ResumeContent): Promise<SuggestedTemplate[]> {
  if (!isAiConfigured()) return [];
  const contact = parsed.sections?.find((s) => s.type === "contact")?.data as { title?: string; name?: string } | undefined;
  const summary = parsed.sections?.find((s) => s.type === "summary")?.data as { text?: string } | undefined;
  const exp = parsed.sections?.find((s) => s.type === "experience")?.data as { entries?: { title: string }[] } | undefined;
  const skills = parsed.sections?.find((s) => s.type === "skills")?.data as { items?: string[] } | undefined;
  const role = contact?.title || exp?.entries?.[0]?.title || "";
  const summaryText = summary?.text || "";
  const skillList = skills?.items?.slice(0, 10).join(", ") || "";
  const prompt = `Given this resume profile:
- Role/Title: ${role}
- Summary snippet: ${summaryText.slice(0, 300)}
- Top skills: ${skillList}

From our template library (id: name - description):
${TEMPLATE_LIST.join("\n")}

Pick exactly 2 template IDs that best suit this candidate for the Indian job market. Consider: role level (fresher/mid/executive), industry (tech/HR/general), and layout needs.

Return ONLY valid JSON array of 2 objects: [{"id":"template-id","name":"Display Name","reason":"Brief reason in 10 words"}]. No markdown.`;

  const content = await chatCompletion(
    [
      { role: "system", content: "You recommend resume templates. Output only valid JSON array. No markdown, no extra text." },
      { role: "user", content: prompt },
    ],
    { maxTokens: 300 }
  );
  if (!content) return [];
  const cleaned = content.replace(/```json|```/g, "").trim();
  try {
    const arr = JSON.parse(cleaned);
    if (!Array.isArray(arr) || arr.length < 2) return [];
    return arr.slice(0, 2).map((a: { id?: string; name?: string; reason?: string }) => ({
      id: String(a?.id || "professional-in"),
      name: String(a?.name || "Professional"),
      reason: String(a?.reason || "Well suited"),
    }));
  } catch {
    return [];
  }
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
