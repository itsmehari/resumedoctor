"use client";

import type { LanguagesSection, LanguageProficiency } from "@/types/resume";

interface Props {
  data: LanguagesSection["data"];
  onChange: (data: LanguagesSection["data"]) => void;
}

const PROFICIENCY_OPTIONS: LanguageProficiency[] = ["Native", "Fluent", "Conversational", "Basic"];

function genId() {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : `l-${Date.now()}`;
}

export function LanguagesEditor({ data, onChange }: Props) {
  const entries = data.entries ?? [];

  const addEntry = () =>
    onChange({ entries: [...entries, { id: genId(), name: "", proficiency: "Fluent" }] });

  const updateEntry = (i: number, field: string, value: string) => {
    const next = entries.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    onChange({ entries: next });
  };

  const removeEntry = (i: number) =>
    onChange({ entries: entries.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      {entries.map((lang, i) => (
        <div key={lang.id} className="flex gap-2 items-center">
          <input
            type="text"
            value={lang.name}
            onChange={(e) => updateEntry(i, "name", e.target.value)}
            placeholder="Language name"
            className="flex-1 rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
          />
          <select
            value={lang.proficiency}
            onChange={(e) => updateEntry(i, "proficiency", e.target.value)}
            className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
          >
            {PROFICIENCY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => removeEntry(i)}
            className="text-red-500 hover:text-red-600 text-sm flex-shrink-0"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="text-xs text-primary-600 hover:underline"
      >
        + Add language
      </button>
    </div>
  );
}
