"use client";

import type { VolunteerSection } from "@/types/resume";

interface Props {
  data: VolunteerSection["data"];
  onChange: (data: VolunteerSection["data"]) => void;
}

function genId() {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : `v-${Date.now()}`;
}

export function VolunteerEditor({ data, onChange }: Props) {
  const entries = data.entries ?? [];

  const addEntry = () =>
    onChange({
      entries: [...entries, { id: genId(), role: "", organization: "", startDate: "", endDate: "", current: false, bullets: [""] }],
    });

  const updateEntry = (i: number, field: string, value: string | boolean) => {
    const next = entries.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    onChange({ entries: next });
  };

  const addBullet = (i: number) => {
    const next = entries.map((e, idx) =>
      idx === i ? { ...e, bullets: [...(e.bullets ?? []), ""] } : e
    );
    onChange({ entries: next });
  };

  const updateBullet = (entryIdx: number, bulletIdx: number, value: string) => {
    const next = entries.map((e, idx) => {
      if (idx !== entryIdx) return e;
      const bullets = [...(e.bullets ?? [])];
      bullets[bulletIdx] = value;
      return { ...e, bullets };
    });
    onChange({ entries: next });
  };

  const removeBullet = (entryIdx: number, bulletIdx: number) => {
    const next = entries.map((e, idx) => {
      if (idx !== entryIdx) return e;
      return { ...e, bullets: e.bullets.filter((_, j) => j !== bulletIdx) };
    });
    onChange({ entries: next });
  };

  const removeEntry = (i: number) => onChange({ entries: entries.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      {entries.map((v, i) => (
        <div key={v.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Entry {i + 1}</span>
            <button type="button" onClick={() => removeEntry(i)} className="text-red-500 text-xs">Remove</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={v.role} onChange={(e) => updateEntry(i, "role", e.target.value)}
              placeholder="Role / Position"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
            <input type="text" value={v.organization} onChange={(e) => updateEntry(i, "organization", e.target.value)}
              placeholder="Organisation / NGO"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={v.startDate} onChange={(e) => updateEntry(i, "startDate", e.target.value)}
              placeholder="Start date"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
            <input type="text" value={v.endDate} onChange={(e) => updateEntry(i, "endDate", e.target.value)}
              placeholder={v.current ? "Present" : "End date"}
              disabled={v.current}
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900 disabled:opacity-50" />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={v.current} onChange={(e) => updateEntry(i, "current", e.target.checked)} className="rounded" />
            Currently active
          </label>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Contributions</p>
            {(v.bullets ?? []).map((b, j) => (
              <div key={j} className="flex gap-2 mb-1.5">
                <input type="text" value={b} onChange={(e) => updateBullet(i, j, e.target.value)}
                  placeholder="What you contributed..."
                  className="flex-1 rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
                <button type="button" onClick={() => removeBullet(i, j)} className="text-red-500 text-sm">×</button>
              </div>
            ))}
            <button type="button" onClick={() => addBullet(i)} className="text-xs text-primary-600 hover:underline">
              + Add bullet
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addEntry} className="text-xs text-primary-600 hover:underline">
        + Add volunteer experience
      </button>
    </div>
  );
}
