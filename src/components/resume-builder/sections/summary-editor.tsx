"use client";

import type { SummarySection } from "@/types/resume";

interface Props {
  data: SummarySection["data"];
  onChange: (data: SummarySection["data"]) => void;
}

export function SummaryEditor({ data, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Professional Summary
      </label>
      <textarea
        value={data.text}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        rows={4}
        placeholder="A brief summary of your experience and goals..."
        className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );
}
