"use client";

import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  FEATURE_ICON_PATHS,
  FEATURE_ITEMS,
  INTENT_FEATURE_ORDER,
  getFeaturesByIds,
  type FeatureItem,
  type FeatureTier,
} from "@/components/features/features-data";

function TierChip({ tier, label }: { tier: FeatureTier; label: string }) {
  const cls: Record<FeatureTier, string> = {
    try: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
    basic: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100",
    pro: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
    mixed: "border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        cls[tier]
      )}
    >
      {label}
    </span>
  );
}

function FeatureIcon({ item }: { item: FeatureItem }) {
  const d = FEATURE_ICON_PATHS[item.iconKey];
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="text-current"
        stroke="currentColor"
      >
        <path d={d} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CapabilityCard({ item }: { item: FeatureItem }) {
  const trackDeep = (href: string) => {
    trackEvent("features_deep_link", { target: href });
  };

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[box-shadow,transform] duration-300 ease-out",
        "hover:shadow-md motion-reduce:transform-none motion-reduce:hover:shadow-sm",
        "dark:border-slate-700 dark:bg-slate-900/40 dark:hover:shadow-black/30",
        "focus-within:ring-2 focus-within:ring-primary-500/30"
      )}
    >
      <div className="flex items-start gap-3">
        <FeatureIcon item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
            <TierChip tier={item.tier} label={item.tierLabel} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href={item.href}
              className="text-sm font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
              onClick={() => trackDeep(item.href)}
            >
              {item.linkLabel} →
            </Link>
            {item.secondaryHref && item.secondaryLabel ? (
              <Link
                href={item.secondaryHref}
                className="text-sm font-medium text-slate-600 underline-offset-2 hover:underline dark:text-slate-400"
                onClick={() => trackDeep(item.secondaryHref!)}
              >
                {item.secondaryLabel} →
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

const TABS: { id: keyof typeof INTENT_FEATURE_ORDER | "all"; label: string }[] = [
  { id: "all", label: "All features" },
  { id: "share", label: "Share fast" },
  { id: "apply", label: "Apply on portals" },
  { id: "tailor", label: "Tailor per job" },
  { id: "fresher", label: "Fresher" },
];

export function FeaturesCapabilityExplorer() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const visible = useMemo(() => {
    if (tab === "all") return FEATURE_ITEMS;
    return getFeaturesByIds(INTENT_FEATURE_ORDER[tab]);
  }, [tab]);

  const selectTab = useCallback((id: (typeof TABS)[number]["id"], focusIndex?: number) => {
    setTab(id);
    trackEvent("features_intent_tab", { tab: id });
    if (focusIndex !== undefined) {
      requestAnimationFrame(() => {
        tabRefs.current[focusIndex]?.focus();
      });
    }
  }, []);

  const onTabListKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = TABS.findIndex((x) => x.id === tab);
      if (currentIndex < 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = (currentIndex + 1) % TABS.length;
        selectTab(TABS[next].id, next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (currentIndex - 1 + TABS.length) % TABS.length;
        selectTab(TABS[prev].id, prev);
      } else if (e.key === "Home") {
        e.preventDefault();
        selectTab(TABS[0].id, 0);
      } else if (e.key === "End") {
        e.preventDefault();
        const last = TABS.length - 1;
        selectTab(TABS[last].id, last);
      }
    },
    [selectTab, tab]
  );

  return (
    <div className="space-y-8">
      <div
        role="tablist"
        aria-label="Explore features by goal"
        className="flex flex-wrap gap-2"
        onKeyDown={onTabListKeyDown}
      >
        {TABS.map((t, index) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`features-tab-${t.id}`}
              aria-controls="features-tab-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                selectTab(t.id);
              }}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "border-primary-600 bg-primary-600 text-white shadow-sm dark:border-primary-500 dark:bg-primary-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-700 dark:hover:bg-primary-950/40"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div id="features-tab-panel" role="tabpanel" aria-labelledby={`features-tab-${tab}`}>
        <ul className="grid gap-5 sm:grid-cols-2">
          {visible.map((item) => (
            <li key={item.id}>
              <CapabilityCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
