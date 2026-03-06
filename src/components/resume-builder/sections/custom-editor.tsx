"use client";

import type { CustomSection } from "@/types/resume";

interface Props {
  data: CustomSection["data"];
  onChange: (data: CustomSection["data"]) => void;
}

export function CustomEditor({ data, onChange }: Props) {
  const bullets = data.bullets ?? [""];

  const addBullet = () => onChange({ ...data, bullets: [...bullets, ""] });
  const updateBullet = (i: number, v: string) => {
    const next = [...bullets];
    next[i] = v;
    onChange({ ...data, bullets: next });
  };
  const removeBullet = (i: number) => onChange({ ...data, bullets: bullets.filter((_, j) => j !== i) });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Section heading</label>
        <input
          type="text"
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
          placeholder="e.g. Extra-Curricular, Achievements, Courses..."
          className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Free text <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          value={data.text ?? ""}
          onChange={(e) => onChange({ ...data, text: e.target.value || undefined })}
          rows={2}
          placeholder="Optional paragraph of text..."
          className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm resize-none bg-white dark:bg-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Bullet points</label>
        {bullets.map((b, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={b}
              onChange={(e) => updateBullet(i, e.target.value)}
              placeholder="Add a bullet point..."
              className="flex-1 rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
            />
            <button type="button" onClick={() => removeBullet(i)} className="text-red-500 text-sm">×</button>
          </div>
        ))}
        <button type="button" onClick={addBullet} className="text-xs text-primary-600 hover:underline">
          + Add bullet
        </button>
      </div>
    </div>
  );
}
