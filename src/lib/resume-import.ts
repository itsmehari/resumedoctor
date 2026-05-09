// Phase 1.1 – Resume import (PDF/DOCX): extract text and parse with AI
import type { ResumeContent, ResumeSection } from "@/types/resume";
import { chatCompletion, estimateTokens, isAiConfigured, maxAvailableTpm } from "@/lib/ai-client";
import { generateSectionId } from "@/lib/resume-utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const PDF_ERR =
    "Could not extract text from PDF. Try a different file or convert to DOCX.";
  const u8 = new Uint8Array(buffer);
  const errors: string[] = [];

  // 1. pdfjs-serverless – full extraction with position-aware reading order
  try {
    const { getDocument } = await import("pdfjs-serverless");
    const doc = await getDocument({
      data: u8,
      useSystemFonts: true,
      isEvalSupported: false,
    }).promise;
    const parts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const items = textContent.items as Array<{ str?: string; transform?: number[] }>;
      // Sort by position: Y desc (top first), then X asc (left to right) for correct reading order
      const sorted = [...items].sort((a, b) => {
        const ay = a.transform?.[5] ?? 0;
        const by = b.transform?.[5] ?? 0;
        if (Math.abs(ay - by) > 2) return by - ay; // higher Y = top of page in PDF coords
        const ax = a.transform?.[4] ?? 0;
        const bx = b.transform?.[4] ?? 0;
        return ax - bx;
      });
      const pageText = sorted.map((item) => item.str ?? "").join(" ").replace(/\s+/g, " ").trim();
      if (pageText) parts.push(pageText);
    }
    const text = parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
    if (text && text.length > 0) return text;
  } catch (e) {
    errors.push(`pdfjs-serverless: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 2. unpdf – serverless wrapper
  try {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(u8);
    const { text } = await extractText(pdf, { mergePages: true });
    if (text && text.trim().length > 0) return text.trim();
  } catch (e) {
    errors.push(`unpdf: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 3. pdf2json – fallback (can fail with nodeUtil in Next.js)
  try {
    const mod = await import("pdf2json");
    const PDFParser = mod.default ?? (mod as { PDFParser?: unknown }).PDFParser;
    if (PDFParser) {
      const text = await new Promise<string>((resolve, reject) => {
        const parser = new (PDFParser as new (a: unknown, b: boolean) => { on: (ev: string, cb: (e: unknown) => void) => void; getRawTextContent?: () => string; parseBuffer: (b: Buffer) => void })(null, true);
        parser.on("pdfParser_dataError", (e: unknown) =>
          reject(e && typeof e === "object" && "parserError" in e ? (e as { parserError?: Error }).parserError : e)
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
    }
  } catch (e) {
    errors.push(`pdf2json: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 4. pdf-parse – legacy fallback
  try {
    const mod = await import("pdf-parse");
    const fn = (mod as { default?: (b: Buffer) => Promise<{ text?: string }> }).default ?? mod;
    if (typeof fn === "function") {
      const data = await fn(buffer);
      const t = data?.text?.trim();
      if (t) return t;
    }
  } catch (e) {
    errors.push(`pdf-parse: ${e instanceof Error ? e.message : String(e)}`);
  }

  console.error("PDF extraction failed. Methods tried:", errors.join("; "));
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

const TEMPLATE_SUGGEST_COUNT = 10;

/** Use AI to suggest 10 best templates from parsed resume content */
export async function suggestTemplatesFromResume(parsed: ResumeContent): Promise<SuggestedTemplate[]> {
  if (!isAiConfigured()) return [];
  const contact = parsed.sections?.find((s) => s.type === "contact")?.data as { title?: string; name?: string } | undefined;
  const summary = parsed.sections?.find((s) => s.type === "summary" || s.type === "objective")?.data as { text?: string } | undefined;
  const exp = parsed.sections?.find((s) => s.type === "experience")?.data as { entries?: { title: string }[] } | undefined;
  const skills = parsed.sections?.find((s) => s.type === "skills")?.data as { items?: string[] } | undefined;
  const role = contact?.title || exp?.entries?.[0]?.title || "";
  const summaryText = summary?.text || "";
  const skillList = skills?.items?.slice(0, 15).join(", ") || "";
  const prompt = `Given this resume profile:
- Role/Title: ${role}
- Summary snippet: ${summaryText.slice(0, 400)}
- Top skills: ${skillList}

From our template library (id: name - description):
${TEMPLATE_LIST.join("\n")}

Pick exactly ${TEMPLATE_SUGGEST_COUNT} template IDs that best suit this candidate for the Indian job market. Consider: role level (fresher/mid/executive), industry (tech/HR/general), layout needs. Rank by fit (best first).

Return ONLY valid JSON array of ${TEMPLATE_SUGGEST_COUNT} objects: [{"id":"template-id","name":"Display Name","reason":"Brief reason in 10 words"}]. No markdown.`;

  const content = await chatCompletion(
    [
      { role: "system", content: "You recommend resume templates. Output only valid JSON array. No markdown, no extra text." },
      { role: "user", content: prompt },
    ],
    { maxTokens: 800 }
  );
  if (!content) return [];
  const cleaned = content.replace(/```json|```/g, "").trim();
  try {
    const arr = JSON.parse(cleaned);
    if (!Array.isArray(arr) || arr.length < 1) return [];
    return arr.slice(0, TEMPLATE_SUGGEST_COUNT).map((a: { id?: string; name?: string; reason?: string }) => ({
      id: String(a?.id || "professional-in"),
      name: String(a?.name || "Professional"),
      reason: String(a?.reason || "Well suited"),
    }));
  } catch {
    return [];
  }
}

const PARSE_SYSTEM_PROMPT =
  "You are a resume parser. Output only valid JSON. No markdown code blocks, no explanations.";

const PARSE_SCHEMA_HINT = `Extract EVERY detail (no summarising or skipping) into structured JSON:
- contact: name, email, phone, location, linkedin, github, portfolio, website (extract from header/top)
- summary or objective: 2-3 sentences (use type "summary" or "objective")
- experience: array of { title, company, location, startDate, endDate, current, bullets[] }
- education: array of { degree, school, location, startDate, endDate, gpa?, honours? }
- skills: items array (and optionally categories: { name, items[] })
- projects: array of { name, description, link, bullets[], tech[] }
- certifications: array of { name, issuer, date, credentialId?, url? }
- languages: array of { name, proficiency: Native|Fluent|Conversational|Basic }
- awards: array of { title, issuer?, date, description? }
- volunteer: array of { role, organization, location, startDate, endDate, current, bullets[] }

Return ONLY valid JSON, no markdown:
{ "sections": [ { "id": "string", "type": "contact|summary|experience|education|skills|projects|certifications|languages|awards|volunteer", "order": number, "data": {...} } ] }

Use EXACT field names: contact.data uses name/title (not fullName/jobTitle); summary.data.text; experience.data.entries[].bullets (string[]).
Order: 0=contact, 1=summary, 2=experience, 3=education, 4=skills, 5=projects, ...`;

/** Split a long resume into roughly-equal chunks, ideally on section headings, so each
 *  chunk fits within a model's TPM budget. Falls back to paragraph / size splits. */
function chunkResumeText(text: string, targetCharsPerChunk: number): string[] {
  if (text.length <= targetCharsPerChunk) return [text];

  // Common resume section headings (case-insensitive) used as natural split points.
  const headingRe = /^(?:\s*)(?:contact|summary|profile|objective|experience|work\s+experience|professional\s+experience|employment|education|skills|technical\s+skills|projects|certifications?|licenses?|languages?|awards?|honou?rs?|publications?|volunteer|references?|interests?|hobbies)\b[:\s-]*$/im;

  const lines = text.split(/\n/);
  const blocks: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (headingRe.test(line) && current.length > 0) {
      blocks.push(current.join("\n"));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current.join("\n"));

  // Greedy-pack blocks into chunks under targetCharsPerChunk.
  const chunks: string[] = [];
  let buf = "";
  for (const b of blocks) {
    if (!buf) {
      buf = b;
      continue;
    }
    if (buf.length + b.length + 2 <= targetCharsPerChunk) {
      buf += "\n\n" + b;
    } else {
      chunks.push(buf);
      buf = b;
    }
  }
  if (buf) chunks.push(buf);

  // If any chunk is still too big (e.g. one giant Experience section), hard-split it.
  const finalChunks: string[] = [];
  for (const c of chunks) {
    if (c.length <= targetCharsPerChunk) {
      finalChunks.push(c);
      continue;
    }
    for (let i = 0; i < c.length; i += targetCharsPerChunk) {
      finalChunks.push(c.slice(i, i + targetCharsPerChunk));
    }
  }
  return finalChunks.length ? finalChunks : [text];
}

async function parseChunkToSections(chunkText: string, isFirstChunk: boolean): Promise<unknown[]> {
  const focusNote = isFirstChunk
    ? "This is the FIRST/ONLY part of the resume – include the contact section."
    : "This is a CONTINUATION chunk – the contact/summary may already be captured. Focus on the sections present in THIS chunk.";

  const prompt = `${PARSE_SCHEMA_HINT}

${focusNote}
Resume text:
---
${chunkText}
---`;

  const content = await chatCompletion(
    [
      { role: "system", content: PARSE_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    { maxTokens: 4000 }
  );

  if (!content) return [];
  const cleaned = content.replace(/```json|```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as { sections?: unknown[] };
    return Array.isArray(parsed?.sections) ? parsed.sections : [];
  } catch {
    return [];
  }
}

/** Parse raw resume text into structured ResumeContent using AI.
 *  Handles arbitrarily large resumes by:
 *  1. Estimating token count and choosing a chunk size that fits the strongest model's TPM.
 *  2. Splitting on section headings when needed and parsing each chunk independently.
 *  3. Merging chunked results into a single ResumeContent (sections of the same type are merged). */
export async function parseResumeWithAi(rawText: string): Promise<ResumeContent> {
  if (!rawText || rawText.trim().length < 50) {
    return { sections: [] };
  }

  // Budget: leave room for the prompt scaffold (~600 tokens) + reserved output (~4000 tokens).
  // Convert remaining TPM to chars (~4 chars/token) and cap at 60k chars per chunk.
  const tpm = maxAvailableTpm();
  const promptOverheadTokens = 800;
  const reservedOutputTokens = 4200;
  const inputTokenBudget = Math.max(2000, tpm - promptOverheadTokens - reservedOutputTokens);
  const charsPerChunk = Math.min(60000, inputTokenBudget * 4);

  const fullText = rawText.slice(0, 200000); // hard ceiling: 200k chars (~50k tokens)
  const estimatedInputTokens = estimateTokens(fullText);

  const needsChunking = estimatedInputTokens > inputTokenBudget;
  const chunks = needsChunking ? chunkResumeText(fullText, charsPerChunk) : [fullText];

  const allRaw: unknown[] = [];
  for (let i = 0; i < chunks.length; i++) {
    try {
      const sectionsFromChunk = await parseChunkToSections(chunks[i], i === 0);
      allRaw.push(...sectionsFromChunk);
    } catch (err) {
      console.warn(
        `[resume-import] Chunk ${i + 1}/${chunks.length} parse failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  if (allRaw.length === 0) return { sections: [] };

  // Merge sections of the same type across chunks (Experience from chunk 1 + chunk 2 → one section).
  const sectionsByType = new Map<string, ResumeSection>();
  let order = 0;
  for (const s of allRaw) {
    if (!s || typeof s !== "object" || !("type" in s) || !("data" in s)) continue;
    const sec = s as { type: string; data: unknown; id?: string };
    const id = (sec.id as string) || generateSectionId();
    const normalized = normalizeSection(sec.type, sec.data, id, order);
    if (!normalized) continue;

    const existing = sectionsByType.get(normalized.type);
    if (!existing) {
      sectionsByType.set(normalized.type, normalized);
      order++;
    } else {
      mergeSectionInto(existing, normalized);
    }
  }

  // Re-order using canonical section order so output is consistent regardless of chunk order.
  const sections = sortSections(Array.from(sectionsByType.values()));

  // Fallback: if contact is missing/empty but raw text has email/phone, extract and add
  const contactSection = sections.find((s) => s.type === "contact");
  const contactData = contactSection?.data as { name?: string; email?: string; phone?: string; location?: string } | undefined;
  const needsFallback =
    (!contactSection || !contactData?.name?.trim() || !contactData?.email?.trim()) &&
    rawText.length >= 100;
  if (needsFallback) {
    const fallback = extractContactFallback(rawText);
    if (fallback.email || fallback.phone || fallback.name) {
      const existing = contactSection
        ? (contactSection.data as Record<string, unknown>)
        : {};
      const merged = {
        name: (existing.name as string) || fallback.name || "",
        title: (existing.title as string) || undefined,
        email: (existing.email as string) || fallback.email || "",
        phone: (existing.phone as string) || fallback.phone || "",
        location: (existing.location as string) || fallback.location || "",
        linkedin: (existing.linkedin as string) || undefined,
        github: (existing.github as string) || undefined,
        portfolio: (existing.portfolio as string) || undefined,
        website: (existing.website as string) || undefined,
      };
      const sec: ResumeSection = (contactSection
        ? { ...contactSection, data: merged }
        : {
            id: generateSectionId(),
            type: "contact",
            order: 0,
            data: merged,
          }) as ResumeSection;
      if (contactSection) {
        const idx = sections.indexOf(contactSection);
        sections[idx] = sec;
      } else {
        sections.unshift(sec);
        sections.forEach((s, i) => {
          (s as { order: number }).order = i;
        });
      }
    }
  }

  return { sections };
}

/** Canonical section order for the final merged resume. */
const SECTION_ORDER: Record<string, number> = {
  contact: 0,
  summary: 1,
  objective: 1,
  experience: 2,
  education: 3,
  skills: 4,
  projects: 5,
  certifications: 6,
  languages: 7,
  awards: 8,
  volunteer: 9,
};

function sortSections(list: ResumeSection[]): ResumeSection[] {
  const sorted = [...list].sort((a, b) => {
    const ai = SECTION_ORDER[a.type] ?? 99;
    const bi = SECTION_ORDER[b.type] ?? 99;
    return ai - bi;
  });
  sorted.forEach((s, i) => {
    (s as { order: number }).order = i;
  });
  return sorted;
}

/** Merge `next` into `target` in-place. Used when chunked parsing returns the same
 *  section type from multiple chunks (e.g. Experience continued on chunk 2). */
function mergeSectionInto(target: ResumeSection, next: ResumeSection): void {
  if (target.type !== next.type) return;
  const td = target.data as Record<string, unknown>;
  const nd = next.data as Record<string, unknown>;

  switch (target.type) {
    case "contact": {
      // Prefer non-empty values from `next` only when target's are missing.
      for (const k of ["name", "title", "email", "phone", "location", "website", "linkedin", "github", "portfolio"]) {
        if ((!td[k] || String(td[k]).trim() === "") && nd[k]) td[k] = nd[k];
      }
      return;
    }
    case "summary":
    case "objective": {
      const a = String(td.text ?? "").trim();
      const b = String(nd.text ?? "").trim();
      if (b && (!a || b.length > a.length)) td.text = b;
      return;
    }
    case "skills": {
      const aItems = Array.isArray(td.items) ? (td.items as string[]) : [];
      const bItems = Array.isArray(nd.items) ? (nd.items as string[]) : [];
      const seen = new Set<string>();
      const merged: string[] = [];
      for (const x of [...aItems, ...bItems]) {
        const v = String(x ?? "").trim();
        if (v && !seen.has(v.toLowerCase())) {
          seen.add(v.toLowerCase());
          merged.push(v);
        }
      }
      td.items = merged.length ? merged : [""];
      const aCats = Array.isArray(td.categories) ? (td.categories as Array<{ name: string; items: string[] }>) : [];
      const bCats = Array.isArray(nd.categories) ? (nd.categories as Array<{ name: string; items: string[] }>) : [];
      if (aCats.length || bCats.length) td.categories = [...aCats, ...bCats];
      return;
    }
    default: {
      // Entry-bearing sections (experience, education, projects, certifications, languages, awards, volunteer)
      const aEntries = Array.isArray(td.entries) ? (td.entries as unknown[]) : [];
      const bEntries = Array.isArray(nd.entries) ? (nd.entries as unknown[]) : [];
      td.entries = [...aEntries, ...bEntries];
      return;
    }
  }
}

/** Fallback: regex-extract email, phone, and first line (often name) when AI returns empty contact */
function extractContactFallback(rawText: string): {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
} {
  const lines = rawText.split(/\n/).map((l) => l.trim()).filter(Boolean);
  let email = "";
  let phone = "";
  let name = "";
  let location = "";

  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRe = /(?:\+91[\s-]?)?[6-9]\d{9}|(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

  for (const line of lines.slice(0, 20)) {
    if (!email && emailRe.test(line)) {
      const m = line.match(emailRe);
      if (m) email = m[0];
    }
    if (!phone && phoneRe.test(line)) {
      const m = line.match(phoneRe);
      if (m) phone = m[0];
    }
    if (!name && line.length >= 3 && line.length <= 80 && !emailRe.test(line) && !phoneRe.test(line)) {
      if (!/^(?:RESUME|CV|Curriculum|Contact|Email|Phone)/i.test(line)) {
        name = line;
      }
    }
    if (!location && (/\b(?:India|Chennai|Mumbai|Bangalore|Delhi|Hyderabad|Pune|Kolkata)\b/i.test(line) || /\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b/.test(line))) {
      const m = line.match(/([A-Za-z][A-Za-z\s,.-]+(?:India|IN)?)/);
      if (m) location = m[1].trim();
    }
    if (email && phone && name) break;
  }

  return { name: name || undefined, email: email || undefined, phone: phone || undefined, location: location || undefined };
}

/** Pick first non-empty value from object by keys (handles alternate AI field names) */
function pickFirst(obj: Record<string, unknown> | null | undefined, keys: string[]): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    const v = obj[k];
    if (v != null && String(v).trim()) return v;
  }
  return undefined;
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
    case "contact": {
      const name = pickFirst(d, ["name", "fullName", "full_name"]);
      const title = pickFirst(d, ["title", "professionalTitle", "jobTitle", "headline"]);
      const email = pickFirst(d, ["email"]);
      const phone = pickFirst(d, ["phone", "mobile", "contact"]);
      const location = pickFirst(d, ["location", "city", "address"]);
      const website = pickFirst(d, ["website", "url"]);
      const linkedin = pickFirst(d, ["linkedin", "linkedIn"]);
      const github = pickFirst(d, ["github"]);
      const portfolio = pickFirst(d, ["portfolio"]);
      return {
        id,
        type: "contact",
        order,
        data: {
          name: String(name ?? ""),
          title: title ? String(title) : undefined,
          email: String(email ?? ""),
          phone: String(phone ?? ""),
          location: String(location ?? ""),
          website: website ? String(website) : undefined,
          linkedin: linkedin ? String(linkedin) : undefined,
          github: github ? String(github) : undefined,
          portfolio: portfolio ? String(portfolio) : undefined,
        },
      };
    }

    case "summary": {
      const text = pickFirst(d, ["text", "summary", "description", "content"]);
      const t = String(text ?? "").trim();
      return t ? { id, type: "summary", order, data: { text: t } } : null;
    }

    case "objective": {
      const text = pickFirst(d, ["text", "objective", "summary", "description"]);
      const t = String(text ?? "").trim();
      return t ? { id, type: "objective", order, data: { text: t } } : null;
    }

    case "experience": {
      const entries = Array.isArray(d.entries) ? d.entries : [d];
      const normalized = entries
        .map((e) => {
          const x = e as Record<string, unknown>;
          const title = pickFirst(x, ["title", "position", "role", "jobTitle"]);
          const company = pickFirst(x, ["company", "organization", "employer"]);
          if (!title && !company) return null;
          const rawBullets = Array.isArray(x.bullets)
            ? (x.bullets as string[]).filter(Boolean)
            : [];
          const desc = pickFirst(x, ["description", "responsibilities"]);
          const descBullets = typeof desc === "string"
            ? desc.split(/[•\n]/).map((b) => b.trim()).filter(Boolean)
            : Array.isArray(desc)
              ? (desc as string[]).filter(Boolean)
              : [];
          const bullets = rawBullets.length ? rawBullets : descBullets.length ? descBullets : [""];
          return {
            id: generateSectionId(),
            title: String(title ?? ""),
            company: String(company ?? ""),
            location: x.location ? String(x.location) : undefined,
            startDate: String(x.startDate ?? x.start ?? ""),
            endDate: String(x.endDate ?? x.end ?? ""),
            current: !!x.current,
            bullets,
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
