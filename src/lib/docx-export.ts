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

  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
    })
  );

  for (const section of sorted) {
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
        const exp = section.data;
        if (exp.title || exp.company) {
          children.push(
            new Paragraph({
              text: "Experience",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            })
          );
          const dateStr =
            exp.startDate || exp.endDate
              ? `${exp.startDate || ""} – ${exp.endDate || "Present"}`
              : "";
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.title || "Position"} at ${exp.company || ""}`,
                  bold: true,
                }),
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
        break;
      }

      case "education": {
        const edu = section.data;
        if (edu.degree || edu.school) {
          children.push(
            new Paragraph({
              text: "Education",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            })
          );
          const dateStr =
            edu.startDate || edu.endDate
              ? ` (${edu.startDate || ""} – ${edu.endDate || ""})`
              : "";
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
        const proj = section.data;
        if (proj.name || proj.bullets?.some(Boolean)) {
          children.push(
            new Paragraph({
              text: "Projects",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            })
          );
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
