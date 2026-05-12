"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

interface Props {
  id: string;
  label: string;
  isActive?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  children: React.ReactNode;
}

export function SortableSection({
  id,
  label,
  isActive = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  children,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section
      id={`resume-section-${id}`}
      ref={setNodeRef}
      style={style}
      className={`scroll-mt-36 rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-800/50 ${
        isActive
          ? "border-primary-400 ring-2 ring-primary-200 dark:border-primary-600 dark:ring-primary-900/40"
          : "border-slate-200 dark:border-slate-700"
      } ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-700">
        <button
          type="button"
          className="cursor-grab rounded p-1 text-slate-400 hover:bg-slate-100 active:cursor-grabbing dark:hover:bg-slate-700"
          aria-label={`Reorder ${label} section`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>
        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
            aria-label={`Move ${label} up`}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
            aria-label={`Move ${label} down`}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}
