"use client";

import type { EducationSection } from "@/types/resume";

interface Props {
  data: EducationSection["data"];
  onChange: (data: EducationSection["data"]) => void;
}

export function EducationEditor({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">Degree</label>
          <input
            type="text"
            value={data.degree}
            onChange={(e) => onChange({ ...data, degree: e.target.value })}
            placeholder="B.Tech Computer Science"
            className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">School</label>
          <input
            type="text"
            value={data.school}
            onChange={(e) => onChange({ ...data, school: e.target.value })}
            placeholder="University name"
            className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">Start</label>
          <input
            type="text"
            value={data.startDate}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            placeholder="2018"
            className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">End</label>
          <input
            type="text"
            value={data.endDate}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
            placeholder="2022"
            className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
