"use client";

import type { AwardsSection } from "@/types/resume";

interface Props {
  data: AwardsSection["data"];
  onChange: (data: AwardsSection["data"]) => void;
}

function genId() {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : `a-${Date.now()}`;
}

export function AwardsEditor({ data, onChange }: Props) {
  const entries = data.entries ?? [];

  const addEntry = () =>
    onChange({ entries: [...entries, { id: genId(), title: "", date: "", description: "" }] });

  const updateEntry = (i: number, field: string, value: string) => {
    const next = entries.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    onChange({ entries: next });
  };

  const removeEntry = (i: number) =>
    onChange({ entries: entries.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      {entries.map((award, i) => (
        <div key={award.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Award {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeEntry(i)}
              className="text-red-500 hover:text-red-600 text-xs"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={award.title}
              onChange={(e) => updateEntry(i, "title", e.target.value)}
              placeholder="Award or recognition title"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
            />
            <input
              type="text"
              value={award.date}
              onChange={(e) => updateEntry(i, "date", e.target.value)}
              placeholder="Year or date"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
            />
          </div>

          <input
            type="text"
            value={award.issuer ?? ""}
            onChange={(e) => updateEntry(i, "issuer", e.target.value)}
            placeholder="Issuing organisation (optional)"
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
          />

          <textarea
            value={award.description ?? ""}
            onChange={(e) => updateEntry(i, "description", e.target.value)}
            placeholder="Brief description (optional)"
            rows={2}
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm resize-none bg-white dark:bg-slate-900"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="text-xs text-primary-600 hover:underline"
      >
        + Add award
      </button>
    </div>
  );
}
