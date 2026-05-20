"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Copy, Trash2, FileText, MoreVertical } from "lucide-react";
import { getTemplateDisplayName } from "@/lib/subscription-labels";

export type ResumeLibraryItem = {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  _count?: { exportLogs: number };
};

type Props = {
  resumes: ResumeLibraryItem[];
  actionLoading: string | null;
  menuOpen: string | null;
  onMenuToggle: (id: string | null) => void;
  onDuplicate: (r: ResumeLibraryItem) => void;
  onDeleteRequest: (r: ResumeLibraryItem) => void;
};

export function ResumeLibraryGrid({
  resumes,
  actionLoading,
  menuOpen,
  onMenuToggle,
  onDuplicate,
  onDeleteRequest,
}: Props) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {resumes.map((r) => (
        <li
          key={r.id}
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-md transition hover:border-primary-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-700"
        >
          <Link href={`/resumes/${r.id}/edit`} className="flex flex-1 flex-col p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg border border-primary-100 bg-gradient-to-b from-primary-50 to-white dark:border-primary-800/50 dark:from-primary-950/60 dark:to-slate-900">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="line-clamp-2 font-semibold text-slate-900 dark:text-slate-100">
                  {r.title}
                </span>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {getTemplateDisplayName(r.templateId)}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Updated {formatDistanceToNow(new Date(r.updatedAt), { addSuffix: true })}
              {r._count && r._count.exportLogs > 0 && (
                <> · {r._count.exportLogs} export{r._count.exportLogs !== 1 ? "s" : ""}</>
              )}
            </p>
          </Link>
          <div className="flex items-center justify-end gap-1 border-t border-slate-100 px-3 py-2 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onDuplicate(r)}
              disabled={!!actionLoading}
              className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => onMenuToggle(menuOpen === r.id ? null : r.id)}
                className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                title="More actions"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen === r.id && (
                <>
                  <div className="fixed inset-0 z-10" aria-hidden onClick={() => onMenuToggle(null)} />
                  <div className="absolute bottom-full right-0 z-20 mb-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={() => onDeleteRequest(r)}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
