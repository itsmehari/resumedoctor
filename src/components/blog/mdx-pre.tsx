"use client";

import { useCallback, useRef, useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";

export function MdxPre(props: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = ref.current?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="group relative my-4">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white/95 px-2 py-1 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition hover:bg-slate-50 group-hover:opacity-100 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-200 dark:hover:bg-slate-700"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        ref={ref}
        {...props}
        className={`overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/80 ${props.className ?? ""}`}
      />
    </div>
  );
}
