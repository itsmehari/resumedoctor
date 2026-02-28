// WBS 3.1 – Resume content structure (JSON schema)

export type SectionType =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects";

export interface BaseSection {
  id: string;
  type: SectionType;
  order: number;
}

export interface SummarySection extends BaseSection {
  type: "summary";
  data: {
    text: string;
  };
}

export interface ExperienceSection extends BaseSection {
  type: "experience";
  data: {
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  };
}

export interface EducationSection extends BaseSection {
  type: "education";
  data: {
    degree: string;
    school: string;
    location?: string;
    startDate: string;
    endDate: string;
    details?: string;
  };
}

export interface SkillsSection extends BaseSection {
  type: "skills";
  data: {
    items: string[];
    categories?: { name: string; items: string[] }[];
  };
}

export interface ProjectsSection extends BaseSection {
  type: "projects";
  data: {
    name: string;
    description?: string;
    link?: string;
    bullets: string[];
    startDate?: string;
    endDate?: string;
  };
}

export type ResumeSection =
  | SummarySection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | ProjectsSection;

export interface ResumeContent {
  sections: ResumeSection[];
}

export const DEFAULT_RESUME_CONTENT: ResumeContent = {
  sections: [
    {
      id: crypto.randomUUID(),
      type: "summary",
      order: 0,
      data: { text: "" },
    },
  ],
};

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createEmptySection(
  type: SectionType,
  order: number
): ResumeSection {
  const id = genId();
  switch (type) {
    case "summary":
      return { id, type: "summary", order, data: { text: "" } };
    case "experience":
      return {
        id,
        type: "experience",
        order,
        data: {
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          current: false,
          bullets: [""],
        },
      };
    case "education":
      return {
        id,
        type: "education",
        order,
        data: {
          degree: "",
          school: "",
          startDate: "",
          endDate: "",
        },
      };
    case "skills":
      return {
        id,
        type: "skills",
        order,
        data: { items: [""] },
      };
    case "projects":
      return {
        id,
        type: "projects",
        order,
        data: {
          name: "",
          description: "",
          bullets: [""],
        },
      };
    default:
      return { id, type: "summary", order, data: { text: "" } };
  }
}
