"use client";

import type { CertificationsSection } from "@/types/resume";

interface Props {
  data: CertificationsSection["data"];
  onChange: (data: CertificationsSection["data"]) => void;
}

function genId() {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : `c-${Date.now()}`;
}

export function CertificationsEditor({ data, onChange }: Props) {
  const entries = data.entries ?? [];

  const addEntry = () =>
    onChange({ entries: [...entries, { id: genId(), name: "", issuer: "", date: "" }] });

  const updateEntry = (i: number, field: string, value: string) => {
    const next = entries.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    onChange({ entries: next });
  };

  const removeEntry = (i: number) =>
    onChange({ entries: entries.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      {entries.map((cert, i) => (
        <div key={cert.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Certification {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeEntry(i)}
              className="text-red-500 hover:text-red-600 text-xs"
            >
              Remove
            </button>
          </div>

          <input
            type="text"
            value={cert.name}
            onChange={(e) => updateEntry(i, "name", e.target.value)}
            placeholder="AWS Certified Developer – Associate"
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={cert.issuer}
              onChange={(e) => updateEntry(i, "issuer", e.target.value)}
              placeholder="Issuing organisation"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
            />
            <input
              type="text"
              value={cert.date}
              onChange={(e) => updateEntry(i, "date", e.target.value)}
              placeholder="Mar 2023"
              className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
            />
          </div>

          <input
            type="text"
            value={cert.credentialId ?? ""}
            onChange={(e) => updateEntry(i, "credentialId", e.target.value)}
            placeholder="Credential ID (optional)"
            className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-900"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="text-xs text-primary-600 hover:underline"
      >
        + Add certification
      </button>
    </div>
  );
}
