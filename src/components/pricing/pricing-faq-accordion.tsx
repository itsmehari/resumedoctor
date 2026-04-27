"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type PricingFaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

type Props = {
  items: PricingFaqItem[];
};

export function PricingFaqAccordion({ items }: Props) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-primary-500/[0.07] via-transparent to-violet-500/[0.06] dark:from-primary-400/[0.09] dark:to-violet-400/[0.05]"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 rounded-[2rem] border border-slate-200/80 bg-slate-50/40 backdrop-blur-sm dark:border-white/[0.08] dark:bg-slate-950/40" />

      <ul className="space-y-3 sm:space-y-4">
        {items.map((item, index) => {
          const isOpen = openId === item.id;
          const panelId = `${baseId}-${item.id}-panel`;
          const buttonId = `${baseId}-${item.id}-button`;

          return (
            <li key={item.id}>
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border transition-all duration-300 ease-out",
                  isOpen
                    ? "border-primary-300/70 bg-white shadow-lg shadow-primary-900/[0.06] ring-1 ring-primary-500/20 dark:border-primary-500/35 dark:bg-slate-900/95 dark:shadow-black/40 dark:ring-primary-400/15"
                    : "border-slate-200/90 bg-white/90 hover:border-slate-300 hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/60 dark:hover:border-slate-600 dark:hover:bg-slate-900/85"
                )}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold tabular-nums transition-colors",
                        isOpen
                          ? "bg-primary-600 text-white dark:bg-primary-500"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      )}
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="block text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        {item.question}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-300",
                        isOpen
                          ? "rotate-180 border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-200"
                          : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      )}
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-slate-100 px-5 pb-5 pt-2 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:px-6 sm:pb-6">
                      <div className="flex gap-4">
                        <span className="w-9 shrink-0" aria-hidden />
                        <div className="min-w-0 flex-1 pr-2 [&_a]:font-medium [&_a]:text-primary-600 [&_a]:underline-offset-2 hover:[&_a]:text-primary-700 dark:[&_a]:text-primary-400">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
