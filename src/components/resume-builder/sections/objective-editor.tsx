"use client";

import type { ObjectiveSection } from "@/types/resume";
import { SUMMARY_MIN_CHARS } from "@/lib/resume-editor-progress";

interface Props {
  data: ObjectiveSection["data"];
  onChange: (data: ObjectiveSection["data"]) => void;
}

export function ObjectiveEditor({ data, onChange }: Props) {
  const length = data.text.trim().length;

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
        Career Objective
        <span className="ml-1 font-normal text-slate-400">(2–3 sentences for freshers / career changers)</span>
      </label>
      <textarea
        value={data.text}
        onChange={(e) => onChange({ text: e.target.value })}
        rows={4}
        placeholder="Seeking a challenging role as a software engineer to apply my skills in React and Node.js while contributing to product growth..."
        className="w-full resize-none rounded border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
      <p
        className={`mt-1 text-xs ${
          length >= SUMMARY_MIN_CHARS ? "text-green-600 dark:text-green-400" : "text-slate-500"
        }`}
      >
        {length}/{SUMMARY_MIN_CHARS} characters for a complete objective
      </p>
    </div>
  );
}
