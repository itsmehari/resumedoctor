"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { ResumeSection, SectionType } from "@/types/resume";
import { createEmptySection } from "@/types/resume";
import {
  type EditorStepId,
  findSectionIdByLabel,
  findSectionIdForStep,
  getActiveStepId,
} from "@/lib/resume-editor-progress";

interface ResumeEditorContextValue {
  activeSectionId: string | null;
  activeStepId: EditorStepId;
  setActiveSectionId: (id: string | null) => void;
  scrollToSection: (sectionId: string) => void;
  scrollToStep: (stepId: EditorStepId) => void;
  scrollToSectionLabel: (label: string | undefined) => void;
  focusSectionField: (sectionId: string) => void;
  addSectionAndScroll: (type: SectionType, onAdd: (section: ResumeSection) => void, sections: ResumeSection[]) => void;
  editorMode: "write" | "review";
  setEditorMode: (mode: "write" | "review") => void;
  previewZoom: number;
  setPreviewZoom: (zoom: number) => void;
  coachingDeferred: boolean;
  setCoachingDeferred: (deferred: boolean) => void;
}

const ResumeEditorContext = createContext<ResumeEditorContextValue | null>(null);

export function ResumeEditorProvider({
  children,
  sections,
}: {
  children: ReactNode;
  sections: ResumeSection[];
}) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<"write" | "review">("write");
  const [previewZoom, setPreviewZoom] = useState(0.85);
  const [coachingDeferred, setCoachingDeferred] = useState(true);
  const activeStepId = useMemo(() => getActiveStepId(sections), [sections]);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
    const el = document.getElementById(`resume-section-${sectionId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const focusSectionField = useCallback((sectionId: string) => {
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    focusTimerRef.current = setTimeout(() => {
      const root = document.getElementById(`resume-section-${sectionId}`);
      const field = root?.querySelector<HTMLElement>("input, textarea, select, button");
      field?.focus();
    }, 350);
  }, []);

  const scrollToStep = useCallback(
    (stepId: EditorStepId) => {
      const sectionId = findSectionIdForStep(stepId, sections);
      if (sectionId) {
        scrollToSection(sectionId);
        focusSectionField(sectionId);
        return;
      }
      document.getElementById("resume-editor-sections")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [focusSectionField, scrollToSection, sections]
  );

  const scrollToSectionLabel = useCallback(
    (label: string | undefined) => {
      const sectionId = findSectionIdByLabel(label, sections);
      if (sectionId) {
        scrollToSection(sectionId);
        focusSectionField(sectionId);
      }
    },
    [focusSectionField, scrollToSection, sections]
  );

  const addSectionAndScroll = useCallback(
    (type: SectionType, onAdd: (section: ResumeSection) => void, current: ResumeSection[]) => {
      const section = createEmptySection(type, current.length);
      onAdd(section);
      requestAnimationFrame(() => {
        scrollToSection(section.id);
        focusSectionField(section.id);
      });
    },
    [focusSectionField, scrollToSection]
  );

  const value = useMemo(
    () => ({
      activeSectionId,
      activeStepId,
      setActiveSectionId,
      scrollToSection,
      scrollToStep,
      scrollToSectionLabel,
      focusSectionField,
      addSectionAndScroll,
      editorMode,
      setEditorMode,
      previewZoom,
      setPreviewZoom,
      coachingDeferred,
      setCoachingDeferred,
    }),
    [
      activeSectionId,
      activeStepId,
      scrollToSection,
      scrollToStep,
      scrollToSectionLabel,
      focusSectionField,
      addSectionAndScroll,
      editorMode,
      previewZoom,
      coachingDeferred,
    ]
  );

  return <ResumeEditorContext.Provider value={value}>{children}</ResumeEditorContext.Provider>;
}

export function useResumeEditor() {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx) throw new Error("useResumeEditor must be used within ResumeEditorProvider");
  return ctx;
}
