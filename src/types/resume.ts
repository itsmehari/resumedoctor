// WBS 3.1 – Resume content structure (JSON schema)

export type SectionType =
  | "contact"
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

export interface ContactSection extends BaseSection {
  type: "contact";
  data: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
  };
}

export interface SummarySection extends BaseSection {
  type: "summary";
  data: {
    text: string;
  };
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ExperienceSection extends BaseSection {
  type: "experience";
  data:
    | { entries: ExperienceEntry[] }
    | (Omit<ExperienceEntry, "id"> & { bullets: string[] }); // legacy single-job
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  details?: string;
}

export interface EducationSection extends BaseSection {
  type: "education";
  data:
    | { entries: EducationEntry[] }
    | Omit<EducationEntry, "id">; // legacy single-degree
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
  | ContactSection
  | SummarySection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | ProjectsSection;

export interface ResumeContentMeta {
  primaryColor?: string;
  fontFamily?: "sans" | "serif" | "mono";
  fontSize?: "small" | "normal" | "large";
  spacing?: "compact" | "normal" | "spacious";
  /** WBS 4.6 – Template version for migration (e.g. "1") */
  templateVersion?: string;
}

export interface ResumeContent {
  sections: ResumeSection[];
  meta?: ResumeContentMeta;
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

/** Demo content for trial users – pre-filled sample resume */
export const DEMO_RESUME_CONTENT: ResumeContent = {
  sections: [
    {
      id: crypto.randomUUID(),
      type: "contact",
      order: 0,
      data: {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43210",
        location: "Bangalore, India",
      },
    },
    {
      id: crypto.randomUUID(),
      type: "summary",
      order: 1,
      data: {
        text: "Results-driven software engineer with 4+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud platforms. Passionate about clean code and user-centric design.",
      },
    },
    {
      id: crypto.randomUUID(),
      type: "experience",
      order: 2,
      data: {
        entries: [
          {
            id: crypto.randomUUID(),
            title: "Senior Software Engineer",
            company: "Tech Solutions Pvt Ltd",
            location: "Bangalore",
            startDate: "Jan 2022",
            endDate: "Present",
            current: true,
            bullets: [
              "Led migration of legacy app to microservices, reducing deployment time by 40%",
              "Built real-time dashboard used by 50K+ users",
              "Mentored 3 junior developers and improved code review practices",
            ],
          },
          {
            id: crypto.randomUUID(),
            title: "Software Engineer",
            company: "StartupXYZ",
            location: "Remote",
            startDate: "Jun 2019",
            endDate: "Dec 2021",
            current: false,
            bullets: [
              "Developed REST APIs serving 1M+ requests/day",
              "Implemented CI/CD pipeline cutting release cycles by 60%",
            ],
          },
        ],
      },
    },
    {
      id: crypto.randomUUID(),
      type: "education",
      order: 3,
      data: {
        entries: [
          {
            id: crypto.randomUUID(),
            degree: "B.Tech Computer Science",
            school: "IIT Delhi",
            location: "New Delhi",
            startDate: "2015",
            endDate: "2019",
          },
        ],
      },
    },
    {
      id: crypto.randomUUID(),
      type: "skills",
      order: 4,
      data: {
        items: ["JavaScript", "React", "Node.js", "PostgreSQL", "AWS", "Git"],
      },
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
    case "contact":
      return {
        id,
        type: "contact",
        order,
        data: { name: "", email: "", phone: "", location: "" },
      };
    case "summary":
      return { id, type: "summary", order, data: { text: "" } };
    case "experience":
      return {
        id,
        type: "experience",
        order,
        data: {
          entries: [
            {
              id: genId(),
              title: "",
              company: "",
              startDate: "",
              endDate: "",
              current: false,
              bullets: [""],
            },
          ],
        },
      };
    case "education":
      return {
        id,
        type: "education",
        order,
        data: {
          entries: [
            {
              id: genId(),
              degree: "",
              school: "",
              startDate: "",
              endDate: "",
            },
          ],
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
