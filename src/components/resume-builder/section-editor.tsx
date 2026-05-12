// WBS 3.6, 3.7 – Section editing components
"use client";

import { useState } from "react";
import type { ResumeSection } from "@/types/resume";
import { useToast } from "@/contexts/toast-context";
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
  onRestore?: (section: ResumeSection) => void;
  resumeId?: string;
  onFocus?: () => void;
}

export function SectionEditor({ section, onChange, onRemove, onRestore, resumeId, onFocus }: Props) {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);

  const handleRemove = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const snapshot = section;
    onRemove();
    toast("Section removed", {
      action: onRestore
        ? {
            label: "Undo",
            onClick: () => onRestore(snapshot),
          }
        : undefined,
    });
    setConfirming(false);
  };

  const removeBtn = (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleRemove}
        className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400"
      >
        {confirming ? "Confirm remove section" : "Remove section"}
      </button>
      {confirming && (
        <button type="button" onClick={() => setConfirming(false)} className="text-xs text-slate-500 hover:underline">
          Cancel
        </button>
      )}
    </div>
  );

  const wrap = (editor: React.ReactNode) => (
    <div className="space-y-2" onFocusCapture={onFocus}>
      {editor}
      {removeBtn}
    </div>
  );

  switch (section.type) {
    case "contact":
      return wrap(
        <ContactEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "summary":
      return wrap(
        <SummaryEditor
          data={section.data}
          onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          resumeId={resumeId}
        />
      );
    case "objective":
      return wrap(
        <ObjectiveEditor data={section.data} onChange={(data) => onChange({ ...section, data } as ResumeSection)} />
      );
    case "experience":
      return wrap(
        <ExperienceEditor
          data={section.data}
          onChange={(data) => onChange({ ...section, data } as ResumeSection)}
          resumeId={resumeId}
        />
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
