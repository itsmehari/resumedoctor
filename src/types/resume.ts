// WBS 3.1 – Resume content structure (JSON schema)

export type SectionType =
  | "contact"
  | "summary"
  | "objective"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "volunteer"
  | "publications"
  | "interests"
  | "custom";

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
    /** Professional headline shown below the name (e.g. "Senior Software Engineer") */
    title?: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export interface SummarySection extends BaseSection {
  type: "summary";
  data: { text: string };
}

// ─── Objective (fresher / career change variant of summary) ──────────────────

export interface ObjectiveSection extends BaseSection {
  type: "objective";
  data: { text: string };
}

// ─── Experience ───────────────────────────────────────────────────────────────

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Freelance"
  | "Internship"
  | "Apprenticeship";

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location?: string;
  employmentType?: EmploymentType;
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
  honours?: string;
}

export interface EducationSection extends BaseSection {
  type: "education";
  data:
    | { entries: EducationEntry[] }
    | Omit<EducationEntry, "id">;
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export interface SkillsSection extends BaseSection {
  type: "skills";
  data: {
    items: string[];
    /** Optional category grouping for the "categories" variant */
    categories?: { name: string; items: string[] }[];
    /** Per-skill level 1–5 for bars/dots rendering */
    levels?: Record<string, number>;
  };
}

// ─── Projects (multi-entry) ───────────────────────────────────────────────────

export interface ProjectEntry {
  id: string;
  name: string;
  description?: string;
  link?: string;
  bullets: string[];
  tech?: string[];
  startDate?: string;
  endDate?: string;
}

export interface ProjectsSection extends BaseSection {
  type: "projects";
  data:
    | { entries: ProjectEntry[] }
    | {
        // Legacy single-project format
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
  data: { entries: CertificationEntry[] };
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
  data: { entries: LanguageEntry[] };
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
  data: { entries: AwardEntry[] };
}

// ─── Volunteer ────────────────────────────────────────────────────────────────

export interface VolunteerEntry {
  id: string;
  role: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface VolunteerSection extends BaseSection {
  type: "volunteer";
  data: { entries: VolunteerEntry[] };
}

// ─── Publications ─────────────────────────────────────────────────────────────

export interface PublicationEntry {
  id: string;
  title: string;
  publisher: string;
  date: string;
  authors?: string;
  url?: string;
  doi?: string;
}

export interface PublicationsSection extends BaseSection {
  type: "publications";
  data: { entries: PublicationEntry[] };
}

// ─── Interests ────────────────────────────────────────────────────────────────

export interface InterestsSection extends BaseSection {
  type: "interests";
  data: { items: string[] };
}

// ─── Custom ───────────────────────────────────────────────────────────────────

export interface CustomSection extends BaseSection {
  type: "custom";
  data: {
    /** User-defined section title */
    heading: string;
    bullets: string[];
    text?: string;
  };
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type ResumeSection =
  | ContactSection
  | SummarySection
  | ObjectiveSection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | ProjectsSection
  | CertificationsSection
  | LanguagesSection
  | AwardsSection
  | VolunteerSection
  | PublicationsSection
  | InterestsSection
  | CustomSection;

// ─── Meta ─────────────────────────────────────────────────────────────────────

export interface ResumeContentMeta {
  primaryColor?: string;
  fontFamily?: "sans" | "serif" | "mono";
  fontSize?: "small" | "normal" | "large";
  spacing?: "compact" | "normal" | "spacious";
  templateVersion?: string;
  /** Phase 2 – Indian formats: "DD/MM/YYYY" | "MM/YYYY" (default) */
  dateFormat?: "DD/MM/YYYY" | "MM/YYYY";
  /** Phase 2 – "Resume" (default) or "Curriculum Vitae" / "CV" */
  documentType?: "Resume" | "CV";
}

export interface ResumeContent {
  sections: ResumeSection[];
  meta?: ResumeContentMeta;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_RESUME_CONTENT: ResumeContent = {
  sections: [
    { id: "default-summary", type: "summary", order: 0, data: { text: "" } },
  ],
};

/** Rich demo content used for template thumbnails and trial users */
export const DEMO_RESUME_CONTENT: ResumeContent = {
  sections: [
    {
      id: "demo-contact",
      type: "contact",
      order: 0,
      data: {
        name: "Priya Sharma",
        title: "Senior Software Engineer",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43210",
        location: "Bangalore, India",
        linkedin: "linkedin.com/in/priyasharma",
        github: "github.com/priyasharma",
        portfolio: "priyasharma.dev",
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
            employmentType: "Full-time",
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
            employmentType: "Full-time",
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
            honours: "Dean's List — 2017, 2018",
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
        levels: {
          JavaScript: 5, TypeScript: 5, React: 5, "Node.js": 4,
          PostgreSQL: 4, AWS: 3, Docker: 4, Git: 5,
        },
      },
    },
    {
      id: "demo-projects",
      type: "projects",
      order: 5,
      data: {
        entries: [
          {
            id: "demo-proj-1",
            name: "ResumeBuilder SaaS",
            description: "AI-powered resume builder with ATS scoring",
            link: "github.com/priya/resumebuilder",
            tech: ["Next.js", "Prisma", "OpenAI"],
            bullets: [
              "Built with Next.js 14, Prisma, and OpenAI GPT-4",
              "Onboarded 2,000+ users in first 3 months post-launch",
            ],
          },
          {
            id: "demo-proj-2",
            name: "Real-time Dashboard",
            description: "Live analytics platform for logistics",
            tech: ["React", "WebSockets", "Redis"],
            bullets: [
              "Reduced data refresh latency from 30s to under 500ms",
            ],
          },
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
    {
      id: "demo-volunteer",
      type: "volunteer",
      order: 9,
      data: {
        entries: [
          {
            id: "demo-vol-1",
            role: "Technical Mentor",
            organization: "GirlScript Foundation",
            location: "Bangalore",
            startDate: "Mar 2021",
            endDate: "Present",
            current: true,
            bullets: [
              "Mentored 20+ women developers through project-based learning",
              "Conducted monthly coding workshops on React & Node.js",
            ],
          },
        ],
      },
    },
    {
      id: "demo-publications",
      type: "publications",
      order: 10,
      data: {
        entries: [
          {
            id: "demo-pub-1",
            title: "Scalable Microservices with Node.js",
            publisher: "Dev.to",
            date: "Aug 2023",
            authors: "Priya Sharma",
            url: "dev.to/priyasharma/microservices",
          },
        ],
      },
    },
    {
      id: "demo-interests",
      type: "interests",
      order: 11,
      data: {
        items: ["Open Source Contribution", "Tech Blogging", "Badminton", "Classical Music"],
      },
    },
  ],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createEmptySection(type: SectionType, order: number): ResumeSection {
  const id = genId();
  switch (type) {
    case "contact":
      return { id, type: "contact", order, data: { name: "", email: "", phone: "", location: "" } };
    case "summary":
      return { id, type: "summary", order, data: { text: "" } };
    case "objective":
      return { id, type: "objective", order, data: { text: "" } };
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
      return {
        id, type: "projects", order,
        data: { entries: [{ id: genId(), name: "", description: "", bullets: [""], tech: [] }] },
      };
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
    case "volunteer":
      return {
        id, type: "volunteer", order,
        data: { entries: [{ id: genId(), role: "", organization: "", startDate: "", endDate: "", current: false, bullets: [""] }] },
      };
    case "publications":
      return {
        id, type: "publications", order,
        data: { entries: [{ id: genId(), title: "", publisher: "", date: "" }] },
      };
    case "interests":
      return { id, type: "interests", order, data: { items: [""] } };
    case "custom":
      return { id, type: "custom", order, data: { heading: "Additional Information", bullets: [""] } };
    default:
      return { id, type: "summary", order, data: { text: "" } };
  }
}
