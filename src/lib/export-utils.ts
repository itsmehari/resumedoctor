// WBS 5 – Export utilities: resume content → TXT, HTML
import type { ResumeSection } from "@/types/resume";

function sortSections(sections: ResumeSection[]): ResumeSection[] {
  return [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function resumeToPlainText(
  sections: ResumeSection[],
  title: string
): string {
  const sorted = sortSections(sections);
  const contactSection = sorted.find((s) => s.type === "contact");
  const contactData = contactSection?.type === "contact" ? contactSection.data : null;
  const displayName = (contactData?.name?.trim() || title).toUpperCase();
  const contactLine = contactData
    ? [contactData.email, contactData.phone, contactData.location, contactData.website].filter(Boolean).join(" | ")
    : "";
  const lines: string[] = [displayName];
  if (contactLine) lines.push(contactLine, "");
  lines.push("=".repeat(50), "");

  for (const section of sorted) {
    if (section.type === "contact") continue;
    switch (section.type) {
      case "summary":
        if (section.data.text?.trim()) {
          lines.push("SUMMARY");
          lines.push(section.data.text.trim());
          lines.push("");
        }
        break;

      case "experience": {
        const expData = section.data as { entries?: Array<{ title: string; company: string; location?: string; startDate: string; endDate: string; bullets?: string[] }> };
        const expEntries = expData.entries ?? [section.data as { title: string; company: string; location?: string; startDate: string; endDate: string; bullets?: string[] }];
        const expList = Array.isArray(expEntries) ? expEntries : [expEntries];
        for (const exp of expList) {
          if (exp.title || exp.company) {
            lines.push("EXPERIENCE");
            lines.push(`${exp.title || "Position"} | ${exp.company || ""}`);
            if (exp.location) lines.push(exp.location);
            const dates = exp.startDate || exp.endDate ? `${exp.startDate || ""} – ${exp.endDate || "Present"}` : "";
            if (dates) lines.push(dates);
            for (const b of exp.bullets?.filter(Boolean) ?? []) {
              lines.push(`  • ${b}`);
            }
            lines.push("");
          }
        }
        break;
      }

      case "education": {
        const eduData = section.data as { entries?: Array<{ degree: string; school: string; location?: string; startDate: string; endDate: string }> };
        const eduEntries = eduData.entries ?? [section.data as { degree: string; school: string; location?: string; startDate: string; endDate: string }];
        const eduList = Array.isArray(eduEntries) ? eduEntries : [eduEntries];
        for (const edu of eduList) {
          if (edu.degree || edu.school) {
            lines.push("EDUCATION");
            lines.push(`${edu.degree || ""} | ${edu.school || ""}`);
            if (edu.location) lines.push(edu.location);
            const dates = edu.startDate || edu.endDate ? `${edu.startDate || ""} – ${edu.endDate || ""}` : "";
            if (dates) lines.push(dates);
            lines.push("");
          }
        }
        break;
      }

      case "skills":
        const items = section.data.items?.filter(Boolean) ?? [];
        if (items.length > 0) {
          lines.push("SKILLS");
          lines.push(items.join(" • "));
          lines.push("");
        }
        break;

      case "projects": {
        const pd = section.data;
        const projEntries = "entries" in pd ? pd.entries : [pd as { name?: string; link?: string; bullets?: string[] }];
        if (projEntries.some((p) => p.name || p.bullets?.some(Boolean))) {
          lines.push("PROJECTS");
          for (const p of projEntries) {
            lines.push(p.name || "Project");
            if (p.link) lines.push(`Link: ${p.link}`);
            for (const b of p.bullets?.filter(Boolean) ?? []) {
              lines.push(`  • ${b}`);
            }
          }
          lines.push("");
        }
        break;
      }
    }
  }

  return lines.join("\n").trim();
}

export function resumeToHtml(
  sections: ResumeSection[],
  title: string,
  options?: { withWatermark?: boolean }
): string {
  const sorted = sortSections(sections);
  const watermark = options?.withWatermark
    ? '<div class="watermark">Upgrade for PDF • ResumeDoctor</div>'
    : "";

  const contactSection = sorted.find((s) => s.type === "contact");
  const contactData = contactSection?.type === "contact" ? contactSection.data : null;
  const hasContact = contactData && (contactData.name?.trim() || contactData.email || contactData.phone || contactData.location || contactData.website);
  const headerHtml = hasContact
    ? `<header class="resume-header">
        <h1>${escapeHtml(contactData!.name?.trim() || title)}</h1>
        ${[contactData!.email, contactData!.phone, contactData!.location, contactData!.website].filter(Boolean).length
          ? `<p class="contact-line">${[contactData!.email, contactData!.phone, contactData!.location, contactData!.website].filter((x): x is string => !!x).map(escapeHtml).join(" · ")}</p>`
          : ""}
      </header>`
    : `<h1>${escapeHtml(title)}</h1>`;

  const sectionHtml = sorted
    .filter((s) => s.type !== "contact")
    .map((section) => {
      switch (section.type) {
        case "summary":
          if (!section.data.text?.trim()) return "";
          return `
          <section>
            <h2>Summary</h2>
            <p>${escapeHtml(section.data.text.trim())}</p>
          </section>`;
        case "experience": {
          const expData = section.data as { entries?: Array<{ title: string; company: string; location?: string; startDate: string; endDate: string; bullets?: string[] }> };
          const expEntries = expData.entries ?? [section.data as { title: string; company: string; location?: string; startDate: string; endDate: string; bullets?: string[] }];
          const expList = Array.isArray(expEntries) ? expEntries : [expEntries];
          const entriesHtml = expList
            .filter((e) => e.title || e.company)
            .map((exp) => {
              const bullets = (exp.bullets?.filter(Boolean) ?? []).map((b) => `<li>${escapeHtml(b)}</li>`).join("");
              return `<div class="entry">
                <div class="entry-header">
                  <span class="title">${escapeHtml(exp.title || "Position")}</span>
                  <span class="dates">${exp.startDate || ""} – ${exp.endDate || "Present"}</span>
                </div>
                <div class="company">${escapeHtml(exp.company || "")}${exp.location ? `, ${escapeHtml(exp.location)}` : ""}</div>
                ${bullets ? `<ul>${bullets}</ul>` : ""}
              </div>`;
            })
            .join("");
          return entriesHtml ? `<section><h2>Experience</h2>${entriesHtml}</section>` : "";
        }
        case "education": {
          const eduData = section.data as { entries?: Array<{ degree: string; school: string; location?: string; startDate: string; endDate: string }> };
          const eduEntries = eduData.entries ?? [section.data as { degree: string; school: string; location?: string; startDate: string; endDate: string }];
          const eduList = Array.isArray(eduEntries) ? eduEntries : [eduEntries];
          const entriesHtml = eduList
            .filter((e) => e.degree || e.school)
            .map((edu) => `<div class="entry">
              <div class="entry-header">
                <span class="title">${escapeHtml(edu.degree || "")}</span>
                <span class="dates">${edu.startDate || ""} – ${edu.endDate || ""}</span>
              </div>
              <div class="company">${escapeHtml(edu.school || "")}${edu.location ? `, ${escapeHtml(edu.location)}` : ""}</div>
            </div>`)
            .join("");
          return entriesHtml ? `<section><h2>Education</h2>${entriesHtml}</section>` : "";
        }
        case "skills":
          const items = section.data.items?.filter(Boolean) ?? [];
          if (items.length === 0) return "";
          return `
          <section>
            <h2>Skills</h2>
            <p>${items.map(escapeHtml).join(" • ")}</p>
          </section>`;
        case "projects": {
          const ph = section.data;
          const phEntries = "entries" in ph ? ph.entries : [ph as { name?: string; link?: string; bullets?: string[] }];
          const projHtml = phEntries.map((p) => {
            const bHTML = (p.bullets?.filter(Boolean) ?? []).map((b: string) => `<li>${escapeHtml(b)}</li>`).join("");
            return `<div class="entry">
              <div class="entry-header"><span class="title">${escapeHtml(p.name || "Project")}</span></div>
              ${p.link ? `<div class="company"><a href="${escapeHtml(p.link)}">${escapeHtml(p.link)}</a></div>` : ""}
              ${bHTML ? `<ul>${bHTML}</ul>` : ""}
            </div>`;
          }).join("");
          return `<section><h2>Projects</h2>${projHtml}</section>`;
        }
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} – Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 11pt; line-height: 1.4; color: #1e293b; max-width: 21cm; margin: 0 auto; padding: 1.5cm; }
    h1 { font-size: 18pt; margin-bottom: 1rem; color: #0f172a; }
    h2 { font-size: 12pt; font-weight: 600; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 1rem 0 0.5rem; color: #334155; }
    section { margin-bottom: 1rem; }
    .entry { margin-bottom: 0.75rem; }
    .entry-header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
    .title { font-weight: 600; }
    .dates { font-size: 10pt; color: #64748b; }
    .company { font-size: 10pt; color: #64748b; margin-bottom: 2px; }
    ul { margin: 4px 0 0 1rem; }
    li { margin-bottom: 2px; }
    a { color: #2563eb; }
    .resume-header { margin-bottom: 1rem; }
    .contact-line { font-size: 10pt; color: #64748b; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 24pt; color: rgba(0,0,0,0.08); white-space: nowrap; pointer-events: none; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  ${watermark}
  ${headerHtml}
  ${sectionHtml}
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
