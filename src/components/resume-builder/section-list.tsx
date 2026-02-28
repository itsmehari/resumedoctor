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
import { SectionEditor } from "./section-editor";
import { SortableSection } from "./sortable-section";

interface Props {
  sections: ResumeSection[];
  onChange: (sections: ResumeSection[]) => void;
}

const SECTION_LABELS: Record<ResumeSection["type"], string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
};

export function SectionList({ sections, onChange }: Props) {
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
    onChange(
      sections.map((s) => (s.id === id ? updated : s))
    );
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              id={section.id}
              label={SECTION_LABELS[section.type]}
            >
              <SectionEditor
                section={section}
                onChange={(updated) => updateSection(section.id, updated)}
                onRemove={() => removeSection(section.id)}
              />
            </SortableSection>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
