// WBS 5.4 – DOCX export using docx package
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  type FileChild,
} from "docx";
import type { ResumeSection } from "@/types/resume";

function sortSections(sections: ResumeSection[]): ResumeSection[] {
  return [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function buildDocx(
  sections: ResumeSection[],
  title: string
): Promise<Buffer> {
  const children: FileChild[] = [];
  const sorted = sortSections(sections);

  const contactSection = sorted.find((s) => s.type === "contact");
  const contactData = contactSection?.type === "contact" ? contactSection.data : null;
  const displayName = contactData?.name?.trim() || title;

  children.push(
    new Paragraph({
      text: displayName,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    })
  );

  if (contactData) {
    const contactParts = [contactData.email, contactData.phone, contactData.location, contactData.website].filter(Boolean);
    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          children: [new TextRun(contactParts.join(" · "))],
          spacing: { after: 400 },
        })
      );
    }
  }

  for (const section of sorted) {
    if (section.type === "contact") continue;
    switch (section.type) {
      case "summary":
        if (section.data.text?.trim()) {
          children.push(
            new Paragraph({
              text: "Summary",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            }),
            new Paragraph({
              children: [new TextRun(section.data.text.trim())],
              spacing: { after: 300 },
            })
          );
        }
        break;

      case "experience": {
        const expData = section.data as { entries?: Array<{ title: string; company: string; location?: string; startDate: string; endDate: string; bullets?: string[] }> };
        const expEntries = expData.entries ?? [section.data as { title: string; company: string; location?: string; startDate: string; endDate: string; bullets?: string[] }];
        const expList = Array.isArray(expEntries) ? expEntries : [expEntries];
        const validExp = expList.filter((e) => e.title || e.company);
        if (validExp.length > 0) {
          children.push(
            new Paragraph({
              text: "Experience",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            })
          );
          for (const exp of validExp) {
            const dateStr = exp.startDate || exp.endDate ? `${exp.startDate || ""} – ${exp.endDate || "Present"}` : "";
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${exp.title || "Position"} at ${exp.company || ""}`, bold: true }),
                  ...(dateStr ? [new TextRun(` (${dateStr})`)] : []),
                ],
                spacing: { after: 100 },
              })
            );
            if (exp.location) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: exp.location, italics: true })],
                  spacing: { after: 100 },
                })
              );
            }
            for (const b of exp.bullets?.filter(Boolean) ?? []) {
              children.push(
                new Paragraph({
                  children: [new TextRun(`• ${b}`)],
                  indent: { left: 720 },
                  spacing: { after: 80 },
                })
              );
            }
            children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
          }
        }
        break;
      }

      case "education": {
        const eduData = section.data as { entries?: Array<{ degree: string; school: string; location?: string; startDate: string; endDate: string }> };
        const eduEntries = eduData.entries ?? [section.data as { degree: string; school: string; location?: string; startDate: string; endDate: string }];
        const eduList = Array.isArray(eduEntries) ? eduEntries : [eduEntries];
        const validEdu = eduList.filter((e) => e.degree || e.school);
        if (validEdu.length > 0) {
          children.push(
            new Paragraph({
              text: "Education",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            })
          );
          for (const edu of validEdu) {
            const dateStr = edu.startDate || edu.endDate ? ` (${edu.startDate || ""} – ${edu.endDate || ""})` : "";
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.degree || ""} - ${edu.school || ""}${dateStr}`,
                    bold: true,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
            if (edu.location) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: edu.location, italics: true })],
                  spacing: { after: 200 },
                })
              );
            }
          }
        }
        break;
      }

      case "skills": {
        const items = section.data.items?.filter(Boolean) ?? [];
        if (items.length > 0) {
          children.push(
            new Paragraph({
              text: "Skills",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            }),
            new Paragraph({
              children: [new TextRun(items.join(" • "))],
              spacing: { after: 300 },
            })
          );
        }
        break;
      }

      case "projects": {
        const pd2 = section.data;
        const projEntries2 = "entries" in pd2 ? pd2.entries : [pd2 as { name?: string; link?: string; bullets?: string[] }];
        if (projEntries2.some((p) => p.name || p.bullets?.some(Boolean))) {
          children.push(
            new Paragraph({
              text: "Projects",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            })
          );
          for (const proj of projEntries2) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: proj.name || "Project", bold: true }),
                  ...(proj.link
                    ? [new TextRun({ text: ` - ${proj.link}`, italics: true })]
                    : []),
                ],
                spacing: { after: 100 },
              })
            );
            for (const b of proj.bullets?.filter(Boolean) ?? []) {
              children.push(
                new Paragraph({
                  children: [new TextRun(`• ${b}`)],
                  indent: { left: 720 },
                  spacing: { after: 80 },
                })
              );
            }
          }
          children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        }
        break;
      }

      case "certifications": {
        const certEntries = section.data.entries?.filter((e) => e.name) ?? [];
        if (certEntries.length > 0) {
          children.push(
            new Paragraph({ text: "Certifications", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } })
          );
          for (const cert of certEntries) {
            const meta = [cert.issuer, cert.date].filter(Boolean).join(", ");
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: cert.name, bold: true }),
                  ...(meta ? [new TextRun({ text: `  —  ${meta}`, italics: true })] : []),
                ],
                spacing: { after: 120 },
              })
            );
          }
          children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        }
        break;
      }

      case "languages": {
        const langEntries = section.data.entries?.filter((e) => e.name) ?? [];
        if (langEntries.length > 0) {
          children.push(
            new Paragraph({ text: "Languages", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } })
          );
          for (const lang of langEntries) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: lang.name, bold: true }),
                  ...(lang.proficiency ? [new TextRun(`  —  ${lang.proficiency}`)] : []),
                ],
                spacing: { after: 120 },
              })
            );
          }
          children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        }
        break;
      }

      case "awards": {
        const awardEntries = section.data.entries?.filter((e) => e.title) ?? [];
        if (awardEntries.length > 0) {
          children.push(
            new Paragraph({ text: "Awards & Honours", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } })
          );
          for (const award of awardEntries) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: award.title, bold: true }),
                  ...(award.issuer ? [new TextRun(`  —  ${award.issuer}`)] : []),
                  ...(award.date ? [new TextRun(`  (${award.date})`)] : []),
                ],
                spacing: { after: 100 },
              })
            );
            if (award.description) {
              children.push(
                new Paragraph({ children: [new TextRun(award.description)], indent: { left: 720 }, spacing: { after: 80 } })
              );
            }
          }
          children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        }
        break;
      }

      case "objective": {
        if (section.data.text?.trim()) {
          children.push(
            new Paragraph({ text: "Objective", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } }),
            new Paragraph({ children: [new TextRun(section.data.text.trim())], spacing: { after: 300 } })
          );
        }
        break;
      }

      case "volunteer": {
        const volEntries = section.data.entries?.filter((e) => e.organization) ?? [];
        if (volEntries.length > 0) {
          children.push(
            new Paragraph({ text: "Volunteer Work", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } })
          );
          for (const vol of volEntries) {
            const dateStr = vol.startDate || vol.endDate ? `${vol.startDate ?? ""} – ${vol.endDate ?? "Present"}` : "";
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${vol.role ?? "Volunteer"} at ${vol.organization}`, bold: true }),
                  ...(dateStr ? [new TextRun(`  (${dateStr})`)] : []),
                ],
                spacing: { after: 100 },
              })
            );
            for (const b of vol.bullets?.filter(Boolean) ?? []) {
              children.push(
                new Paragraph({ children: [new TextRun(`• ${b}`)], indent: { left: 720 }, spacing: { after: 80 } })
              );
            }
          }
          children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        }
        break;
      }

      case "publications": {
        const pubEntries = section.data.entries?.filter((e) => e.title) ?? [];
        if (pubEntries.length > 0) {
          children.push(
            new Paragraph({ text: "Publications", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } })
          );
          for (const pub of pubEntries) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: pub.title, bold: true }),
                  ...(pub.publisher ? [new TextRun(`  —  ${pub.publisher}`)] : []),
                  ...(pub.date ? [new TextRun(`  (${pub.date})`)] : []),
                ],
                spacing: { after: 100 },
              })
            );
            if (pub.url) {
              children.push(
                new Paragraph({ children: [new TextRun({ text: pub.url, italics: true })], indent: { left: 720 }, spacing: { after: 80 } })
              );
            }
          }
          children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        }
        break;
      }

      case "interests": {
        const interestItems = section.data.items?.filter(Boolean) ?? [];
        if (interestItems.length > 0) {
          children.push(
            new Paragraph({ text: "Interests", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } }),
            new Paragraph({ children: [new TextRun(interestItems.join(" · "))], spacing: { after: 300 } })
          );
        }
        break;
      }

      case "custom": {
        if (section.data.heading || section.data.text || section.data.bullets?.some(Boolean)) {
          children.push(
            new Paragraph({ text: section.data.heading || "Additional Information", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } })
          );
          if (section.data.text?.trim()) {
            children.push(
              new Paragraph({ children: [new TextRun(section.data.text.trim())], spacing: { after: 200 } })
            );
          }
          for (const b of section.data.bullets?.filter(Boolean) ?? []) {
            children.push(
              new Paragraph({ children: [new TextRun(`• ${b}`)], indent: { left: 720 }, spacing: { after: 80 } })
            );
          }
          children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        }
        break;
      }
    }
  }

  const doc = new Document({
    creator: "ResumeDoctor",
    title,
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

/** WBS 8.6 – Cover letter DOCX (plain text content) */
export function buildCoverLetterDocx(
  content: string,
  title: string,
  company?: string | null,
  role?: string | null
): Promise<Buffer> {
  const children: FileChild[] = [];
  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 300 },
    })
  );
  if (company || role) {
    children.push(
      new Paragraph({
        children: [
          ...(company ? [new TextRun({ text: company, bold: true })] : []),
          ...(company && role ? [new TextRun(" – ")] : []),
          ...(role ? [new TextRun(role)] : []),
        ],
        spacing: { after: 400 },
      })
    );
  }
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  for (const p of paragraphs) {
    children.push(
      new Paragraph({
        children: [new TextRun(p.trim())],
        spacing: { after: 200 },
      })
    );
  }
  const doc = new Document({
    creator: "ResumeDoctor",
    title,
    sections: [{ properties: {}, children }],
  });
  return Packer.toBuffer(doc);
}
