"use client";

import { Check, Cloud, CloudOff, Loader2 } from "lucide-react";

interface Props {
  status: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  onRetry: () => void;
}

export function EditorSaveStatus({ status, lastSavedAt, onRetry }: Props) {
  const timeLabel =
    lastSavedAt &&
    lastSavedAt.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="flex items-center gap-2">
      {status === "saving" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-amber-600" aria-hidden />
          <span className="text-sm text-amber-600">Saving…</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Cloud className="h-4 w-4 text-green-600" aria-hidden />
          <span className="text-sm text-green-600">Saved{timeLabel ? ` · ${timeLabel}` : ""}</span>
        </>
      )}
      {status === "error" && (
        <>
          <CloudOff className="h-4 w-4 text-red-600" aria-hidden />
          <span className="text-sm text-red-600">Could not save</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
          >
            Retry
          </button>
        </>
      )}
      {status === "idle" && (
        <>
          <Cloud className="h-4 w-4 text-slate-400" aria-hidden />
          <span className="text-sm text-slate-500">
            Auto-save{timeLabel ? ` · ${timeLabel}` : ""}
          </span>
        </>
      )}
    </div>
  );
}
