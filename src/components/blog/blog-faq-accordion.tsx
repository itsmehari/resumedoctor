"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };

export function BlogFaqAccordion({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <div className="my-10 space-y-2" role="region" aria-label="Frequently asked questions">
      {items.map((item, i) => (
        <FaqItem key={i} item={item} id={`blog-faq-${i}`} />
      ))}
    </div>
  );
}

function FaqItem({ item, id }: { item: Item; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900/50">
      <h3>
        <button
          type="button"
          id={id}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-base font-semibold text-slate-900 dark:text-slate-100"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
        >
          {item.q}
          <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </h3>
      {open ? (
        <div
          id={`${id}-panel`}
          role="region"
          className="border-t border-slate-100 px-4 py-3 text-slate-600 dark:border-slate-700 dark:text-slate-300"
        >
          <p className="text-sm leading-relaxed">{item.a}</p>
        </div>
      ) : null}
    </div>
  );
}
