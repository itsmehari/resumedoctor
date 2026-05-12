// WBS 3.5, 3.6 – Section list with drag-and-drop
"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ResumeSection } from "@/types/resume";
import { hasContactSection } from "@/lib/resume-editor-progress";
import { SectionEditor } from "./section-editor";
import { SortableSection } from "./sortable-section";

interface Props {
  sections: ResumeSection[];
  onChange: (sections: ResumeSection[]) => void;
  resumeId?: string;
  activeSectionId?: string | null;
  onActiveSectionChange?: (id: string) => void;
}

const SECTION_LABELS: Record<ResumeSection["type"], string> = {
  contact: "Contact",
  summary: "Summary",
  objective: "Career Objective",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards",
  volunteer: "Volunteer Work",
  publications: "Publications",
  interests: "Interests",
  custom: "Custom Section",
};

export function SectionList({
  sections,
  onChange,
  resumeId,
  activeSectionId,
  onActiveSectionChange,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(sections, oldIndex, newIndex);
    const withOrder = reordered.map((s, i) => ({ ...s, order: i }));
    onChange(withOrder);
  };

  const updateSection = (id: string, updated: ResumeSection) => {
    onChange(sections.map((s) => (s.id === id ? updated : s)));
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
  };

  const restoreSection = (section: ResumeSection) => {
    onChange([...sections, { ...section, order: sections.length }]);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const reordered = arrayMove(sections, index, newIndex);
    onChange(reordered.map((s, i) => ({ ...s, order: i })));
  };

  const contactMissing = !hasContactSection(sections);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div id="resume-editor-sections" className="space-y-4">
          {sections.map((section, index) => (
            <SortableSection
              key={section.id}
              id={section.id}
              label={SECTION_LABELS[section.type]}
              isActive={activeSectionId === section.id}
              canMoveUp={index > 0}
              canMoveDown={index < sections.length - 1}
              onMoveUp={() => moveSection(index, -1)}
              onMoveDown={() => moveSection(index, 1)}
            >
              {contactMissing && (section.type === "summary" || section.type === "objective") && (
                <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                  Add a Contact section first so recruiters know how to reach you.
                </p>
              )}
              <SectionEditor
                section={section}
                onChange={(updated) => updateSection(section.id, updated)}
                onRemove={() => removeSection(section.id)}
                onRestore={restoreSection}
                resumeId={resumeId}
                onFocus={() => onActiveSectionChange?.(section.id)}
              />
            </SortableSection>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
