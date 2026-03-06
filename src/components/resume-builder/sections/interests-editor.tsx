"use client";

import type { InterestsSection } from "@/types/resume";

interface Props {
  data: InterestsSection["data"];
  onChange: (data: InterestsSection["data"]) => void;
}

export function InterestsEditor({ data, onChange }: Props) {
  const items = data.items ?? [""];

  const addItem = () => onChange({ items: [...items, ""] });
  const updateItem = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange({ items: next });
  };
  const removeItem = (i: number) => onChange({ items: items.filter((_, j) => j !== i) });

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
        Hobbies &amp; Interests
      </label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder="e.g. Open Source, Badminton, Classical Music"
            className="flex-1 rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
          />
          <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-600 text-sm">×</button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="text-xs text-primary-600 hover:underline">
        + Add interest
      </button>
    </div>
  );
}
