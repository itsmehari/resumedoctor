"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  label: string;
  children: React.ReactNode;
}

export function SortableSection({ id, label, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800/50 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing mb-3 pb-2 border-b border-slate-100 dark:border-slate-700"
      >
        <span className="text-slate-400">⋮⋮</span>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
