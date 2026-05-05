"use client";

import { useEffect, useState } from "react";
import type { MarkdownHeading } from "@/lib/blog-headings";
import { cn } from "@/lib/utils";

type Props = {
  headings: MarkdownHeading[];
};

/** Horizontal scroll anchor chips for small screens (sticky below header). */
export function BlogArticleMobileNav({ headings }: Props) {
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
      { rootMargin: "-12% 0px -55% 0px", threshold: [0, 0.1, 0.5, 1] }
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
      className="blog-hide-in-reader xl:hidden print:hidden sticky top-14 z-30 -mx-4 border-b border-[var(--color-border)] bg-[var(--surface)]/95 px-4 py-2.5 shadow-sm backdrop-blur-md dark:bg-slate-950/90 sm:-mx-6"
      aria-label="On this page"
    >
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Jump to</p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {h2h3.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={cn(
              "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold outline-none transition min-h-[44px] flex items-center",
              "border-[var(--color-border)] bg-[var(--surface-soft)] text-[var(--color-text)]",
              "hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/40",
              "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
              active === h.id && "border-primary-400 bg-primary-50 text-primary-900 dark:border-primary-600 dark:bg-primary-950/50 dark:text-primary-100"
            )}
          >
            <span className="max-w-[200px] truncate">{h.text}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
