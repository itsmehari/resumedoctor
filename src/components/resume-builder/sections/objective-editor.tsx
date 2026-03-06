"use client";

import type { ObjectiveSection } from "@/types/resume";

interface Props {
  data: ObjectiveSection["data"];
  onChange: (data: ObjectiveSection["data"]) => void;
}

export function ObjectiveEditor({ data, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
        Career Objective
        <span className="ml-1 text-slate-400 font-normal">(2–3 sentences for freshers / career changers)</span>
      </label>
      <textarea
        value={data.text}
        onChange={(e) => onChange({ text: e.target.value })}
        rows={4}
        placeholder="Seeking a challenging role as a software engineer to apply my skills in React and Node.js while contributing to product growth..."
        className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm resize-none bg-white dark:bg-slate-900 dark:text-slate-100"
      />
    </div>
  );
}
