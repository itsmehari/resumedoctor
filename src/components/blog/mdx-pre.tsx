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
    <div className="group relative my-8 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--surface-soft)] shadow-[var(--shadow-soft)] dark:border-slate-700 dark:bg-slate-900/50">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      >
        {copied ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden /> : <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      <pre
        ref={ref}
        {...props}
        className={`overflow-x-auto rounded-[var(--radius-card)] bg-transparent p-5 pt-14 font-mono text-[0.8125rem] leading-relaxed text-slate-800 dark:text-slate-200 sm:p-6 sm:pt-14 ${props.className ?? ""}`}
      />
    </div>
  );
}
