/** MDX server components: Callout, Steps, Compare, YouTube, FAQ block */

import { Children, type ReactNode } from "react";

const calloutClass: Record<string, string> = {
  info: "border-primary-200/80 bg-primary-50/90 text-primary-950 dark:border-primary-800/60 dark:bg-primary-950/30 dark:text-primary-100",
  warn: "border-amber-200/80 bg-amber-50/90 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-100",
  tip: "border-violet-200/80 bg-violet-50/90 text-violet-950 dark:border-violet-800/60 dark:bg-violet-950/30 dark:text-violet-100",
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warn" | "tip";
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside
      className={`my-6 rounded-2xl border px-4 py-3 text-[0.98rem] leading-relaxed ${calloutClass[type] ?? calloutClass.info}`}
    >
      {title ? <p className="mb-1 font-bold">{title}</p> : null}
      <div className="prose-p:my-1 prose-p:text-inherit dark:prose-p:text-inherit">{children}</div>
    </aside>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/40">
      <div className="space-y-3 text-[1.02rem] leading-relaxed text-slate-800 dark:text-slate-200">{children}</div>
    </div>
  );
}

/** Two-column compare: pass two child blocks (e.g. two `<div>`s with content). */
export function Compare({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2" role="group" aria-label="Comparison">
      {items.map((child, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/50"
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export function YouTubeEmbed({ id, title }: { id: string; title?: string }) {
  if (!id) return null;
  return (
    <div className="relative my-8 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm dark:border-slate-700">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
        title={title || "YouTube video"}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export function LoomEmbed({ id, title }: { id: string; title?: string }) {
  if (!id) return null;
  return (
    <div className="relative my-8 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm dark:border-slate-700">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.loom.com/embed/${encodeURIComponent(id)}`}
        title={title || "Loom video"}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
