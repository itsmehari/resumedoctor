"use client";

import type { SkillsSection } from "@/types/resume";

interface Props {
  data: SkillsSection["data"];
  onChange: (data: SkillsSection["data"]) => void;
}

export function SkillsEditor({ data, onChange }: Props) {
  const items = data.items ?? [""];
  const addItem = () => onChange({ ...data, items: [...items, ""] });
  const updateItem = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange({ ...data, items: next });
  };
  const removeItem = (i: number) =>
    onChange({
      ...data,
      items: items.filter((_, j) => j !== i),
    });

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        Skills (comma or one per line)
      </label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder="e.g. React, Node.js"
            className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="text-xs text-primary-600 hover:underline"
      >
        + Add skill
      </button>
    </div>
  );
}
