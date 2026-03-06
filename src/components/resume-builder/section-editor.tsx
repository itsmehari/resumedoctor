// WBS 3.6, 3.7 – Section editing components
"use client";

import type { ResumeSection } from "@/types/resume";
import { ContactEditor } from "./sections/contact-editor";
import { SummaryEditor } from "./sections/summary-editor";
import { ExperienceEditor } from "./sections/experience-editor";
import { EducationEditor } from "./sections/education-editor";
import { SkillsEditor } from "./sections/skills-editor";
import { ProjectsEditor } from "./sections/projects-editor";
import { CertificationsEditor } from "./sections/certifications-editor";
import { LanguagesEditor } from "./sections/languages-editor";
import { AwardsEditor } from "./sections/awards-editor";

interface Props {
  section: ResumeSection;
  onChange: (section: ResumeSection) => void;
  onRemove: () => void;
  resumeId?: string;
}

export function SectionEditor({ section, onChange, onRemove, resumeId }: Props) {
  const removeBtn = (
    <button
      type="button"
      onClick={onRemove}
      className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 mt-1"
    >
      Remove section
    </button>
  );

  switch (section.type) {
    case "contact":
      return (
        <div className="space-y-2">
          <ContactEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          />
          {removeBtn}
        </div>
      );

    case "summary":
      return (
        <div className="space-y-2">
          <SummaryEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
            resumeId={resumeId}
          />
          {removeBtn}
        </div>
      );

    case "experience":
      return (
        <div className="space-y-2">
          <ExperienceEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
            resumeId={resumeId}
          />
          {removeBtn}
        </div>
      );

    case "education":
      return (
        <div className="space-y-2">
          <EducationEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          />
          {removeBtn}
        </div>
      );

    case "skills":
      return (
        <div className="space-y-2">
          <SkillsEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          />
          {removeBtn}
        </div>
      );

    case "projects":
      return (
        <div className="space-y-2">
          <ProjectsEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          />
          {removeBtn}
        </div>
      );

    case "certifications":
      return (
        <div className="space-y-2">
          <CertificationsEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          />
          {removeBtn}
        </div>
      );

    case "languages":
      return (
        <div className="space-y-2">
          <LanguagesEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          />
          {removeBtn}
        </div>
      );

    case "awards":
      return (
        <div className="space-y-2">
          <AwardsEditor
            data={section.data}
            onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          />
          {removeBtn}
        </div>
      );

    default:
      return null;
  }
}
