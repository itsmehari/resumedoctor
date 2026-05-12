"use client";

import type { ExportPreflightItem } from "@/lib/resume-editor-progress";
import { suggestExportFilename } from "@/lib/resume-editor-progress";
import type { ResumeSection } from "@/types/resume";

interface Props {
  open: boolean;
  issues: ExportPreflightItem[];
  title: string;
  sections: ResumeSection[];
  onClose: () => void;
  onContinue: () => void;
  onJump: (issue: ExportPreflightItem) => void;
}

export function ExportPreflightModal({
  open,
  issues,
  title,
  sections,
  onClose,
  onContinue,
  onJump,
}: Props) {
  if (!open) return null;

  const filename = suggestExportFilename(title, sections);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-preflight-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h2 id="export-preflight-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Before you export
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Suggested file name: <span className="font-medium text-slate-800 dark:text-slate-200">{filename}</span>
        </p>
        {issues.length > 0 ? (
          <>
            <p className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-200">Still missing</p>
            <ul className="mt-2 space-y-2">
              {issues.map((issue) => (
                <li key={issue.label}>
                  <button
                    type="button"
                    onClick={() => onJump(issue)}
                    className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                  >
                    {issue.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">You can export anyway, but recruiters expect these sections.</p>
          </>
        ) : (
          <p className="mt-4 text-sm text-green-700 dark:text-green-400">Core sections look ready.</p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {issues.length > 0 ? "Export anyway" : "Continue to export"}
          </button>
        </div>
      </div>
    </div>
  );
}
