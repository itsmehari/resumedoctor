import type { ResumeSection, SectionType } from "@/types/resume";
import { computeResumeProgress } from "@/lib/resume-utils";

export const SUMMARY_MIN_CHARS = 50;
export const REVIEW_MODE_PROGRESS_THRESHOLD = 30;

export const EDITOR_STEPS = [
  { id: "contact", label: "Contact", sectionTypes: ["contact"] as SectionType[] },
  { id: "summary", label: "Summary", sectionTypes: ["summary", "objective"] as SectionType[] },
  { id: "experience", label: "Experience", sectionTypes: ["experience"] as SectionType[] },
  { id: "skills", label: "Skills", sectionTypes: ["skills"] as SectionType[] },
  { id: "ready", label: "Review", sectionTypes: [] as SectionType[] },
] as const;

export type EditorStepId = (typeof EDITOR_STEPS)[number]["id"];

export function isStepComplete(stepId: EditorStepId, sections: ResumeSection[]): boolean {
  switch (stepId) {
    case "contact": {
      const c = sections.find((s) => s.type === "contact");
      const d = c?.data as { name?: string; email?: string } | undefined;
      return !!(d?.name?.trim() && d?.email?.trim());
    }
    case "summary": {
      const s = sections.find((sec) => sec.type === "summary" || sec.type === "objective");
      const text = (s?.data as { text?: string })?.text ?? "";
      return text.trim().length >= SUMMARY_MIN_CHARS;
    }
    case "experience": {
      const exp = sections.find((s) => s.type === "experience");
      const entries = exp && "entries" in exp.data ? (exp.data as { entries?: unknown[] }).entries : [];
      return (
        Array.isArray(entries) &&
        entries.some((e: unknown) => {
          const x = e as { title?: string; company?: string };
          return !!(x?.title?.trim() && x?.company?.trim());
        })
      );
    }
    case "skills": {
      const sk = sections.find((s) => s.type === "skills");
      const items = (sk?.data as { items?: string[] })?.items ?? [];
      return items.some((i) => i?.trim());
    }
    case "ready":
      return isStepComplete("contact", sections) && isStepComplete("experience", sections);
    default:
      return false;
  }
}

export function getActiveStepId(sections: ResumeSection[]): EditorStepId {
  const incomplete = EDITOR_STEPS.find((s) => !isStepComplete(s.id, sections));
  return incomplete?.id ?? "ready";
}

export function getStepProgressLabel(stepId: EditorStepId, sections: ResumeSection[]): string | null {
  switch (stepId) {
    case "contact": {
      const c = sections.find((s) => s.type === "contact");
      const d = c?.data as { name?: string; email?: string } | undefined;
      const filled = [d?.name?.trim(), d?.email?.trim()].filter(Boolean).length;
      return `${filled}/2 fields`;
    }
    case "summary": {
      const s = sections.find((sec) => sec.type === "summary" || sec.type === "objective");
      const len = ((s?.data as { text?: string })?.text ?? "").trim().length;
      return `${Math.min(len, SUMMARY_MIN_CHARS)}/${SUMMARY_MIN_CHARS} chars`;
    }
    case "experience": {
      const exp = sections.find((s) => s.type === "experience");
      const entries = exp && "entries" in exp.data ? (exp.data as { entries?: unknown[] }).entries : [];
      const complete =
        Array.isArray(entries) &&
        entries.filter((e: unknown) => {
          const x = e as { title?: string; company?: string };
          return !!(x?.title?.trim() && x?.company?.trim());
        }).length;
      return `${complete} role${complete === 1 ? "" : "s"}`;
    }
    case "skills": {
      const sk = sections.find((s) => s.type === "skills");
      const count = ((sk?.data as { items?: string[] })?.items ?? []).filter((i) => i?.trim()).length;
      return `${count} skill${count === 1 ? "" : "s"}`;
    }
    default:
      return null;
  }
}

export function findSectionIdForStep(stepId: EditorStepId, sections: ResumeSection[]): string | null {
  const step = EDITOR_STEPS.find((s) => s.id === stepId);
  if (!step || step.sectionTypes.length === 0) return null;
  for (const type of step.sectionTypes) {
    const match = sections.find((s) => s.type === type);
    if (match) return match.id;
  }
  return null;
}

export function findSectionIdByLabel(label: string | undefined, sections: ResumeSection[]): string | null {
  if (!label) return null;
  const normalized = label.toLowerCase();
  const match = sections.find((s) => {
    const typeLabel = s.type.replace(/_/g, " ");
    return normalized.includes(typeLabel) || normalized.includes(s.type);
  });
  return match?.id ?? null;
}

export function isReviewModeReady(sections: ResumeSection[]): boolean {
  return computeResumeProgress(sections) >= REVIEW_MODE_PROGRESS_THRESHOLD;
}

export function canRunAtsCheck(sections: ResumeSection[]): boolean {
  const contact = sections.find((s) => s.type === "contact");
  const d = contact?.data as { name?: string; email?: string } | undefined;
  return !!(d?.name?.trim() || d?.email?.trim()) || sections.length >= 2;
}

export function hasContactSection(sections: ResumeSection[]): boolean {
  return sections.some((s) => s.type === "contact");
}

export interface NextEditorStep {
  title: string;
  description: string;
  stepId: EditorStepId;
  sectionType?: SectionType;
  ctaLabel: string;
}

export function getNextEditorStep(sections: ResumeSection[]): NextEditorStep {
  const active = getActiveStepId(sections);

  if (!hasContactSection(sections)) {
    return {
      title: "Add contact details",
      description: "Start with your name and email so recruiters can reach you.",
      stepId: "contact",
      sectionType: "contact",
      ctaLabel: "Add Contact",
    };
  }

  if (active === "contact" && !isStepComplete("contact", sections)) {
    return {
      title: "Finish contact details",
      description: "Add your name and a professional email address.",
      stepId: "contact",
      sectionType: "contact",
      ctaLabel: "Go to Contact",
    };
  }

  if (active === "summary" && !sections.some((s) => s.type === "summary" || s.type === "objective")) {
    const fresher = !sections.some((s) => s.type === "experience");
    return {
      title: fresher ? "Add a career objective" : "Add a professional summary",
      description: fresher
        ? "Freshers and career changers do well with a short goal statement."
        : "Write 2–4 sentences that highlight your experience and goals.",
      stepId: "summary",
      sectionType: fresher ? "objective" : "summary",
      ctaLabel: fresher ? "Add Objective" : "Add Summary",
    };
  }

  if (active === "summary" && !isStepComplete("summary", sections)) {
    return {
      title: "Strengthen your summary",
      description: `Aim for at least ${SUMMARY_MIN_CHARS} characters so ATS and recruiters get enough context.`,
      stepId: "summary",
      sectionType: sections.find((s) => s.type === "summary" || s.type === "objective")?.type,
      ctaLabel: "Continue summary",
    };
  }

  if (active === "experience" && !sections.some((s) => s.type === "experience")) {
    return {
      title: "Add work experience",
      description: "Include at least one role with company, title, and achievement bullets.",
      stepId: "experience",
      sectionType: "experience",
      ctaLabel: "Add Experience",
    };
  }

  if (active === "experience" && !isStepComplete("experience", sections)) {
    return {
      title: "Complete a work entry",
      description: "Add job title, company, and at least one bullet with impact.",
      stepId: "experience",
      sectionType: "experience",
      ctaLabel: "Go to Experience",
    };
  }

  if (active === "skills" && !isStepComplete("skills", sections)) {
    return {
      title: "Add relevant skills",
      description: "List tools and skills that match your target role.",
      stepId: "skills",
      sectionType: "skills",
      ctaLabel: "Add Skills",
    };
  }

  return {
    title: "Review and export",
    description: "Check the live preview, run ATS coaching, and export when you are ready.",
    stepId: "ready",
    ctaLabel: "Open review tools",
  };
}

export interface ExportPreflightItem {
  label: string;
  stepId: EditorStepId;
  sectionType?: SectionType;
}

export function getExportPreflightIssues(sections: ResumeSection[]): ExportPreflightItem[] {
  const issues: ExportPreflightItem[] = [];
  if (!isStepComplete("contact", sections)) {
    issues.push({ label: "Contact name and email", stepId: "contact", sectionType: "contact" });
  }
  if (!isStepComplete("experience", sections)) {
    issues.push({ label: "At least one complete work experience", stepId: "experience", sectionType: "experience" });
  }
  if (!isStepComplete("summary", sections) && !sections.some((s) => s.type === "objective")) {
    issues.push({ label: "Professional summary or objective", stepId: "summary", sectionType: "summary" });
  }
  return issues;
}

export function suggestExportFilename(title: string, sections: ResumeSection[]): string {
  const contact = sections.find((s) => s.type === "contact");
  const name = (contact?.data as { name?: string })?.name?.trim();
  const base = name || title.trim() || "resume";
  return `${base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume"}.pdf`;
}

export function findSectionIdByType(
  type: SectionType | undefined,
  sections: ResumeSection[]
): string | null {
  if (!type) return null;
  return sections.find((s) => s.type === type)?.id ?? null;
}

export const TRIAL_ENTITLEMENTS_COPY =
  "Trial: edit and preview free. Sign up to save; Pro or a resume pack unlocks PDF, Word, and full ATS checks.";
