// WBS 3.6, 3.7 – Section editing components
"use client";

import type { ResumeSection } from "@/types/resume";
import { ContactEditor } from "./sections/contact-editor";
import { SummaryEditor } from "./sections/summary-editor";
import { ObjectiveEditor } from "./sections/objective-editor";
import { ExperienceEditor } from "./sections/experience-editor";
import { EducationEditor } from "./sections/education-editor";
import { SkillsEditor } from "./sections/skills-editor";
import { ProjectsEditor } from "./sections/projects-editor";
import { CertificationsEditor } from "./sections/certifications-editor";
import { LanguagesEditor } from "./sections/languages-editor";
import { AwardsEditor } from "./sections/awards-editor";
import { VolunteerEditor } from "./sections/volunteer-editor";
import { PublicationsEditor } from "./sections/publications-editor";
import { InterestsEditor } from "./sections/interests-editor";
import { CustomEditor } from "./sections/custom-editor";

interface Props {
  section: ResumeSection;
  onChange: (section: ResumeSection) => void;
  onRemove: () => void;
  resumeId?: string;
}

export function SectionEditor({ section, onChange, onRemove, resumeId }: Props) {
  const removeBtn = (
    <button type="button" onClick={onRemove}
      className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 mt-1">
      Remove section
    </button>
  );

  const wrap = (editor: React.ReactNode) => (
    <div className="space-y-2">{editor}{removeBtn}</div>
  );

  switch (section.type) {
    case "contact":
      return wrap(
        <ContactEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "summary":
      return wrap(
        <SummaryEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} resumeId={resumeId} />
      );
    case "objective":
      return wrap(
        <ObjectiveEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "experience":
      return wrap(
        <ExperienceEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} resumeId={resumeId} />
      );
    case "education":
      return wrap(
        <EducationEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "skills":
      return wrap(
        <SkillsEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "projects":
      return wrap(
        <ProjectsEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "certifications":
      return wrap(
        <CertificationsEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "languages":
      return wrap(
        <LanguagesEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "awards":
      return wrap(
        <AwardsEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "volunteer":
      return wrap(
        <VolunteerEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "publications":
      return wrap(
        <PublicationsEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "interests":
      return wrap(
        <InterestsEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "custom":
      return wrap(
        <CustomEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    default:
      return null;
  }
}
