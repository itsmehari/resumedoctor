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
    <nav className={cn("text-sm", className)} aria-label="On this page">
      <p className="mb-3 font-bold text-slate-800 dark:text-slate-200">On this page</p>
      <ul className="space-y-2 border-l-2 border-slate-200 pl-3 dark:border-slate-600">
        {h2h3.map((h) => (
          <li key={h.id} className={h.depth === 3 ? "ml-2" : ""}>
            <a
              href={`#${h.id}`}
              onClick={() => onNavigate?.()}
              className={cn(
                "block break-words text-slate-600 transition hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400",
                active === h.id && "font-semibold text-primary-600 dark:text-primary-400"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
