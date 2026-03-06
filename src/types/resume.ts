// WBS 3.1 – Resume content structure (JSON schema)

export type SectionType =
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards";

export interface BaseSection {
  id: string;
  type: SectionType;
  order: number;
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactSection extends BaseSection {
  type: "contact";
  data: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export interface SummarySection extends BaseSection {
  type: "summary";
  data: {
    text: string;
  };
}

// ─── Experience ───────────────────────────────────────────────────────────────

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

// ─── Education ────────────────────────────────────────────────────────────────

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  details?: string;
  gpa?: string;
}

export interface EducationSection extends BaseSection {
  type: "education";
  data:
    | { entries: EducationEntry[] }
    | Omit<EducationEntry, "id">; // legacy single-degree
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export interface SkillsSection extends BaseSection {
  type: "skills";
  data: {
    items: string[];
    categories?: { name: string; items: string[] }[];
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

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

// ─── Certifications ───────────────────────────────────────────────────────────

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

export interface CertificationsSection extends BaseSection {
  type: "certifications";
  data: {
    entries: CertificationEntry[];
  };
}

// ─── Languages ────────────────────────────────────────────────────────────────

export type LanguageProficiency = "Native" | "Fluent" | "Conversational" | "Basic";

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

export interface LanguagesSection extends BaseSection {
  type: "languages";
  data: {
    entries: LanguageEntry[];
  };
}

// ─── Awards ───────────────────────────────────────────────────────────────────

export interface AwardEntry {
  id: string;
  title: string;
  issuer?: string;
  date: string;
  description?: string;
}

export interface AwardsSection extends BaseSection {
  type: "awards";
  data: {
    entries: AwardEntry[];
  };
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type ResumeSection =
  | ContactSection
  | SummarySection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | ProjectsSection
  | CertificationsSection
  | LanguagesSection
  | AwardsSection;

// ─── Meta ─────────────────────────────────────────────────────────────────────

export interface ResumeContentMeta {
  primaryColor?: string;
  fontFamily?: "sans" | "serif" | "mono";
  fontSize?: "small" | "normal" | "large";
  spacing?: "compact" | "normal" | "spacious";
  /** WBS 4.6 – Template version for migration */
  templateVersion?: string;
}

export interface ResumeContent {
  sections: ResumeSection[];
  meta?: ResumeContentMeta;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_RESUME_CONTENT: ResumeContent = {
  sections: [
    {
      id: "default-summary",
      type: "summary",
      order: 0,
      data: { text: "" },
    },
  ],
};

/** Rich demo content for template thumbnails and trial users */
export const DEMO_RESUME_CONTENT: ResumeContent = {
  sections: [
    {
      id: "demo-contact",
      type: "contact",
      order: 0,
      data: {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43210",
        location: "Bangalore, India",
        linkedin: "linkedin.com/in/priyasharma",
      },
    },
    {
      id: "demo-summary",
      type: "summary",
      order: 1,
      data: {
        text: "Results-driven software engineer with 4+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud platforms. Passionate about clean code and user-centric design.",
      },
    },
    {
      id: "demo-experience",
      type: "experience",
      order: 2,
      data: {
        entries: [
          {
            id: "demo-exp-1",
            title: "Senior Software Engineer",
            company: "Tech Solutions Pvt Ltd",
            location: "Bangalore",
            startDate: "Jan 2022",
            endDate: "Present",
            current: true,
            bullets: [
              "Led migration of legacy app to microservices, reducing deployment time by 40%",
              "Built real-time dashboard used by 50K+ users across 12 cities",
              "Mentored 3 junior developers and drove team code review culture",
            ],
          },
          {
            id: "demo-exp-2",
            title: "Software Engineer",
            company: "StartupXYZ",
            location: "Remote",
            startDate: "Jun 2019",
            endDate: "Dec 2021",
            current: false,
            bullets: [
              "Developed REST APIs serving 1M+ requests/day with 99.9% uptime",
              "Implemented CI/CD pipeline cutting release cycles by 60%",
            ],
          },
        ],
      },
    },
    {
      id: "demo-education",
      type: "education",
      order: 3,
      data: {
        entries: [
          {
            id: "demo-edu-1",
            degree: "B.Tech Computer Science",
            school: "IIT Delhi",
            location: "New Delhi",
            startDate: "2015",
            endDate: "2019",
            gpa: "8.7 / 10",
          },
        ],
      },
    },
    {
      id: "demo-skills",
      type: "skills",
      order: 4,
      data: {
        items: ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Docker", "Git"],
        categories: [
          { name: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
          { name: "Backend", items: ["Node.js", "PostgreSQL", "REST APIs"] },
          { name: "DevOps", items: ["AWS", "Docker", "CI/CD"] },
        ],
      },
    },
    {
      id: "demo-projects",
      type: "projects",
      order: 5,
      data: {
        name: "ResumeBuilder SaaS",
        description: "AI-powered resume builder with ATS scoring",
        link: "github.com/priya/resumebuilder",
        bullets: [
          "Built with Next.js 14, Prisma, and OpenAI GPT-4",
          "Onboarded 2,000+ users in first 3 months post-launch",
        ],
      },
    },
    {
      id: "demo-certifications",
      type: "certifications",
      order: 6,
      data: {
        entries: [
          {
            id: "demo-cert-1",
            name: "AWS Certified Developer – Associate",
            issuer: "Amazon Web Services",
            date: "Mar 2023",
            credentialId: "AWS-CDA-2023-PRS",
          },
          {
            id: "demo-cert-2",
            name: "Google Analytics Certified",
            issuer: "Google",
            date: "Jan 2022",
          },
        ],
      },
    },
    {
      id: "demo-languages",
      type: "languages",
      order: 7,
      data: {
        entries: [
          { id: "demo-lang-1", name: "English", proficiency: "Fluent" },
          { id: "demo-lang-2", name: "Hindi", proficiency: "Native" },
          { id: "demo-lang-3", name: "Tamil", proficiency: "Conversational" },
        ],
      },
    },
    {
      id: "demo-awards",
      type: "awards",
      order: 8,
      data: {
        entries: [
          {
            id: "demo-award-1",
            title: "Employee of the Year",
            issuer: "Tech Solutions Pvt Ltd",
            date: "2023",
            description: "Recognised for leading the microservices migration project",
          },
        ],
      },
    },
  ],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createEmptySection(type: SectionType, order: number): ResumeSection {
  const id = genId();
  switch (type) {
    case "contact":
      return { id, type: "contact", order, data: { name: "", email: "", phone: "", location: "" } };
    case "summary":
      return { id, type: "summary", order, data: { text: "" } };
    case "experience":
      return {
        id, type: "experience", order,
        data: { entries: [{ id: genId(), title: "", company: "", startDate: "", endDate: "", current: false, bullets: [""] }] },
      };
    case "education":
      return {
        id, type: "education", order,
        data: { entries: [{ id: genId(), degree: "", school: "", startDate: "", endDate: "" }] },
      };
    case "skills":
      return { id, type: "skills", order, data: { items: [""] } };
    case "projects":
      return { id, type: "projects", order, data: { name: "", description: "", bullets: [""] } };
    case "certifications":
      return {
        id, type: "certifications", order,
        data: { entries: [{ id: genId(), name: "", issuer: "", date: "" }] },
      };
    case "languages":
      return {
        id, type: "languages", order,
        data: { entries: [{ id: genId(), name: "", proficiency: "Fluent" }] },
      };
    case "awards":
      return {
        id, type: "awards", order,
        data: { entries: [{ id: genId(), title: "", date: "", description: "" }] },
      };
    default:
      return { id, type: "summary", order, data: { text: "" } };
  }
}
