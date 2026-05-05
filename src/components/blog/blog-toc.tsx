"use client";

import { useEffect, useState } from "react";
import type { MarkdownHeading } from "@/lib/blog-headings";
import { cn } from "@/lib/utils";

type Props = {
  headings: MarkdownHeading[];
  className?: string;
  onNavigate?: () => void;
};

export function BlogToc({ headings, className, onNavigate }: Props) {
  const h2h3 = headings.filter((h) => h.depth === 2 || h.depth === 3);
  const [active, setActive] = useState<string | null>(null);

  const idKey = h2h3.map((h) => h.id).join("|");
  useEffect(() => {
    if (h2h3.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.1, 0.5, 1] }
    );
    h2h3.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- idKey encodes heading ids
  }, [idKey]);

  if (h2h3.length === 0) return null;

  return (
    <nav
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--surface)]/95 p-4 shadow-[var(--shadow-soft)] dark:border-slate-700 dark:bg-slate-900/70",
        className
      )}
      aria-label="On this page"
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">On this page</p>
      <ul className="space-y-1.5 border-l-2 border-slate-200 pl-3 dark:border-slate-700">
        {h2h3.map((h, index) => (
          <li key={h.id} className={h.depth === 3 ? "ml-3" : ""}>
            <a
              href={`#${h.id}`}
              onClick={() => onNavigate?.()}
              className={cn(
                "group flex items-start gap-2 rounded-lg px-2 py-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-primary-300",
                active === h.id && "bg-primary-50 font-semibold text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
              )}
            >
              <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-slate-100 px-1 text-[10px] font-bold text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-primary-900/50 dark:group-hover:text-primary-300">
                {index + 1}
              </span>
              <span className="break-words text-sm leading-snug">{h.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
