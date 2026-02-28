"use client";

import type { ProjectsSection } from "@/types/resume";

interface Props {
  data: ProjectsSection["data"];
  onChange: (data: ProjectsSection["data"]) => void;
}

export function ProjectsEditor({ data, onChange }: Props) {
  const addBullet = () =>
    onChange({ ...data, bullets: [...data.bullets, ""] });
  const updateBullet = (i: number, v: string) => {
    const next = [...data.bullets];
    next[i] = v;
    onChange({ ...data, bullets: next });
  };
  const removeBullet = (i: number) =>
    onChange({
      ...data,
      bullets: data.bullets.filter((_, j) => j !== i),
    });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-600">Project name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Project name"
          className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Link (optional)</label>
        <input
          type="url"
          value={data.link ?? ""}
          onChange={(e) => onChange({ ...data, link: e.target.value || undefined })}
          placeholder="https://..."
          className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Description / bullets
        </label>
        {data.bullets.map((b, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={b}
              onChange={(e) => updateBullet(i, e.target.value)}
              placeholder="What you built or achieved..."
              className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => removeBullet(i)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addBullet}
          className="text-xs text-primary-600 hover:underline"
        >
          + Add bullet
        </button>
      </div>
    </div>
  );
}
