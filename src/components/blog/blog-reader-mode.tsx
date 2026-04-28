"use client";

import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";

export function BlogReaderMode() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("blog-reader", on);
    return () => {
      document.body.classList.remove("blog-reader");
    };
  }, [on]);

  return (
    <div className="not-print:flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-primary-300 dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-200"
        aria-pressed={on}
      >
        {on ? <X className="h-4 w-4" aria-hidden /> : <BookOpen className="h-4 w-4" aria-hidden />}
        {on ? "Exit reader" : "Reader"}
      </button>
    </div>
  );
}
