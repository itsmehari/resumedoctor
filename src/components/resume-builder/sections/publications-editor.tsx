"use client";

import type { PublicationsSection } from "@/types/resume";

interface Props {
  data: PublicationsSection["data"];
  onChange: (data: PublicationsSection["data"]) => void;
}

function genId() {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : `p-${Date.now()}`;
}

export function PublicationsEditor({ data, onChange }: Props) {
  const entries = data.entries ?? [];

  const addEntry = () =>
    onChange({ entries: [...entries, { id: genId(), title: "", publisher: "", date: "" }] });

  const updateEntry = (i: number, field: string, value: string) => {
    const next = entries.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    onChange({ entries: next });
  };

  const removeEntry = (i: number) => onChange({ entries: entries.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      {entries.map((pub, i) => (
        <div key={pub.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Publication {i + 1}</span>
            <button type="button" onClick={() => removeEntry(i)} className="text-red-500 text-xs">Remove</button>
          </div>

          <input type="text" value={pub.title} onChange={(e) => updateEntry(i, "title", e.target.value)}
            placeholder="Title of the paper / article / book"
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />

          <input type="text" value={pub.authors ?? ""} onChange={(e) => updateEntry(i, "authors", e.target.value)}
            placeholder="Author(s) — e.g. Sharma P., Rao K."
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />

          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={pub.publisher} onChange={(e) => updateEntry(i, "publisher", e.target.value)}
              placeholder="Journal / Conference / Publisher"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
            <input type="text" value={pub.date} onChange={(e) => updateEntry(i, "date", e.target.value)}
              placeholder="Year or date"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input type="url" value={pub.url ?? ""} onChange={(e) => updateEntry(i, "url", e.target.value)}
              placeholder="URL (optional)"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
            <input type="text" value={pub.doi ?? ""} onChange={(e) => updateEntry(i, "doi", e.target.value)}
              placeholder="DOI (optional)"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
          </div>
        </div>
      ))}
      <button type="button" onClick={addEntry} className="text-xs text-primary-600 hover:underline">
        + Add publication
      </button>
    </div>
  );
}
