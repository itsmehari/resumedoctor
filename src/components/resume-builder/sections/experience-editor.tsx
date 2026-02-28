"use client";

import type { ExperienceSection } from "@/types/resume";

interface Props {
  data: ExperienceSection["data"];
  onChange: (data: ExperienceSection["data"]) => void;
}

export function ExperienceEditor({ data, onChange }: Props) {
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">Job title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Software Engineer"
            className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">Company</label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => onChange({ ...data, company: e.target.value })}
            placeholder="Acme Inc"
            className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">Start date</label>
          <input
            type="text"
            value={data.startDate}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            placeholder="Jan 2022"
            className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">End date</label>
          <input
            type="text"
            value={data.endDate}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
            placeholder="Present"
            disabled={data.current}
            className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm disabled:opacity-50"
          />
          <label className="mt-1 flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={data.current}
              onChange={(e) =>
                onChange({
                  ...data,
                  current: e.target.checked,
                  endDate: e.target.checked ? "Present" : data.endDate,
                })
              }
            />
            Current role
          </label>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Key achievements
        </label>
        {data.bullets.map((b, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={b}
              onChange={(e) => updateBullet(i, e.target.value)}
              placeholder="Achieved X by doing Y..."
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
