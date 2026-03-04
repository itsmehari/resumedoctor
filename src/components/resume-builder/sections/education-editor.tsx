"use client";

import type { EducationSection, EducationEntry } from "@/types/resume";
import { MonthYearPicker } from "../month-year-picker";
import { generateSectionId } from "@/lib/resume-utils";

type EducationData = { entries: EducationEntry[] };

interface Props {
  data: EducationSection["data"];
  onChange: (data: EducationData) => void;
}

function normalizeData(data: EducationSection["data"]): EducationData {
  if ("entries" in data && Array.isArray(data.entries)) return data as EducationData;
  const d = data as EducationEntry;
  return {
    entries: [
      {
        id: generateSectionId(),
        degree: d.degree || "",
        school: d.school || "",
        location: d.location,
        startDate: d.startDate || "",
        endDate: d.endDate || "",
        details: d.details,
      },
    ],
  };
}

export function EducationEditor({ data, onChange }: Props) {
  const { entries } = normalizeData(data);

  const updateEntry = (index: number, updates: Partial<EducationEntry>) => {
    const next = entries.map((e, i) => (i === index ? { ...e, ...updates } : e));
    onChange({ entries: next });
  };

  const addEntry = () => {
    onChange({
      entries: [
        ...entries,
        {
          id: generateSectionId(),
          degree: "",
          school: "",
          startDate: "",
          endDate: "",
        },
      ],
    });
  };

  const removeEntry = (index: number) => {
    if (entries.length <= 1) return;
    onChange({ entries: entries.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {entries.map((entry, idx) => (
        <div key={entry.id} className="rounded-lg border border-slate-200 dark:border-slate-600 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500">Degree {idx + 1}</span>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(idx)}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Degree</label>
              <input
                type="text"
                value={entry.degree}
                onChange={(e) => updateEntry(idx, { degree: e.target.value })}
                placeholder="B.Tech Computer Science"
                className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">School</label>
              <input
                type="text"
                value={entry.school}
                onChange={(e) => updateEntry(idx, { school: e.target.value })}
                placeholder="University name"
                className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Location (optional)</label>
            <input
              type="text"
              value={entry.location ?? ""}
              onChange={(e) => updateEntry(idx, { location: e.target.value || undefined })}
              placeholder="Chennai, India"
              className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Start</label>
              <MonthYearPicker
                value={entry.startDate}
                onChange={(v) => updateEntry(idx, { startDate: v })}
                placeholder="2018"
                className="mt-0.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">End</label>
              <MonthYearPicker
                value={entry.endDate}
                onChange={(v) => updateEntry(idx, { endDate: v })}
                placeholder="2022"
                className="mt-0.5"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Details (optional)</label>
            <input
              type="text"
              value={entry.details ?? ""}
              onChange={(e) => updateEntry(idx, { details: e.target.value || undefined })}
              placeholder="GPA, honors, etc."
              className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="text-sm text-primary-600 hover:underline dark:text-primary-400"
      >
        + Add another degree
      </button>
    </div>
  );
}
