"use client";

import type { ResumeContent } from "@/types/resume";

interface Meta extends NonNullable<ResumeContent["meta"]> {}

interface Props {
  open: boolean;
  onClose: () => void;
  meta: Meta;
  onChange: (updates: Partial<Meta>) => void;
}

function contrastWarning(color?: string): string | null {
  if (!color) return null;
  const hex = color.replace("#", "");
  if (hex.length !== 6) return null;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.85) return "This accent may look faint on white paper.";
  return null;
}

export function EditorDesignDrawer({ open, onClose, meta, onChange }: Props) {
  if (!open) return null;
  const warning = contrastWarning(meta.primaryColor);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/30">
      <div className="h-full w-full max-w-sm overflow-y-auto border-l border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Design</h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:underline">
            Close
          </button>
        </div>
        <p className="mb-4 text-xs text-slate-500">Changes update the live preview immediately.</p>
        {warning && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{warning}</p>}
        <p className="mb-2 text-xs font-medium text-slate-500">Accent color</p>
        <div className="mb-4 flex flex-wrap gap-1">
          {["#0f172a", "#1e40af", "#059669", "#7c3aed", "#be185d", "#ea580c", "#0d9488", "#2563eb", "#16a34a"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ primaryColor: meta.primaryColor === c ? undefined : c })}
              className={`h-7 w-7 rounded-full border-2 ${meta.primaryColor === c ? "border-slate-900 dark:border-white" : "border-slate-300"}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
        <p className="mb-2 text-xs font-medium text-slate-500">Font</p>
        <div className="mb-4 flex flex-wrap gap-1">
          {(["sans", "serif", "mono"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onChange({ fontFamily: meta.fontFamily === f ? undefined : f })}
              className={`rounded px-2 py-1 text-xs ${meta.fontFamily === f ? "bg-primary-100 text-primary-800" : "bg-slate-100 text-slate-700"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="mb-2 text-xs font-medium text-slate-500">Font size</p>
        <div className="mb-4 flex flex-wrap gap-1">
          {(["small", "normal", "large"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onChange({ fontSize: meta.fontSize === f ? undefined : f })}
              className={`rounded px-2 py-1 text-xs capitalize ${meta.fontSize === f ? "bg-primary-100 text-primary-800" : "bg-slate-100 text-slate-700"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="mb-2 text-xs font-medium text-slate-500">Spacing</p>
        <div className="mb-4 flex flex-wrap gap-1">
          {(["compact", "normal", "spacious"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ spacing: meta.spacing === s ? undefined : s })}
              className={`rounded px-2 py-1 text-xs capitalize ${meta.spacing === s ? "bg-primary-100 text-primary-800" : "bg-slate-100 text-slate-700"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mb-2 text-xs font-medium text-slate-500">Date format (India)</p>
        <div className="mb-4 flex flex-wrap gap-1">
          {(["MM/YYYY", "DD/MM/YYYY"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onChange({ dateFormat: meta.dateFormat === d ? undefined : d })}
              className={`rounded px-2 py-1 text-xs ${meta.dateFormat === d ? "bg-primary-100 text-primary-800" : "bg-slate-100 text-slate-700"}`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="mb-2 text-xs font-medium text-slate-500">Document type</p>
        <div className="flex flex-wrap gap-1">
          {(["Resume", "CV"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ documentType: meta.documentType === t ? undefined : t })}
              className={`rounded px-2 py-1 text-xs ${meta.documentType === t ? "bg-primary-100 text-primary-800" : "bg-slate-100 text-slate-700"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}