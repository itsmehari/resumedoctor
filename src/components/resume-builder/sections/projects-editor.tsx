"use client";

import type { ProjectsSection, ProjectEntry } from "@/types/resume";

interface Props {
  data: ProjectsSection["data"];
  onChange: (data: ProjectsSection["data"]) => void;
}

function genId() {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : `proj-${Date.now()}`;
}

function normalizeData(data: ProjectsSection["data"]): { entries: ProjectEntry[] } {
  if ("entries" in data && Array.isArray(data.entries)) return data as { entries: ProjectEntry[] };
  const d = data as { name: string; description?: string; link?: string; bullets: string[] };
  return { entries: [{ id: genId(), name: d.name || "", description: d.description, link: d.link, bullets: d.bullets ?? [""], tech: [] }] };
}

export function ProjectsEditor({ data, onChange }: Props) {
  const normalized = normalizeData(data);
  const entries = normalized.entries;

  const addEntry = () =>
    onChange({ entries: [...entries, { id: genId(), name: "", description: "", bullets: [""], tech: [] }] });

  const updateEntry = (i: number, field: string, value: string) => {
    const next = entries.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    onChange({ entries: next });
  };

  const updateTech = (i: number, value: string) => {
    const tech = value.split(",").map((s) => s.trim()).filter(Boolean);
    const next = entries.map((e, idx) => (idx === i ? { ...e, tech } : e));
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
      {entries.map((proj, i) => (
        <div key={proj.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Project {i + 1}</span>
            {entries.length > 1 && (
              <button type="button" onClick={() => removeEntry(i)} className="text-red-500 text-xs">Remove</button>
            )}
          </div>

          <input type="text" value={proj.name} onChange={(e) => updateEntry(i, "name", e.target.value)}
            placeholder="Project name"
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />

          <input type="text" value={proj.description ?? ""} onChange={(e) => updateEntry(i, "description", e.target.value)}
            placeholder="One-line description"
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />

          <div className="grid grid-cols-2 gap-2">
            <input type="url" value={proj.link ?? ""} onChange={(e) => updateEntry(i, "link", e.target.value)}
              placeholder="Link / GitHub URL"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
            <input type="text" value={(proj.tech ?? []).join(", ")} onChange={(e) => updateTech(i, e.target.value)}
              placeholder="Tech stack (comma-separated)"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900" />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Key achievements / bullets</p>
            {(proj.bullets ?? []).map((b, j) => (
              <div key={j} className="flex gap-2 mb-1.5">
                <input type="text" value={b} onChange={(e) => updateBullet(i, j, e.target.value)}
                  placeholder="What you built or achieved..."
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
        + Add another project
      </button>
    </div>
  );
}
