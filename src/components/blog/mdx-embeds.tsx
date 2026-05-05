/** MDX server components: Callout, Steps, Compare, YouTube, FAQ block */

import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import { AlertTriangle, ArrowUpRight, Briefcase, Cpu, Users } from "lucide-react";

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

export function Tip({
  title = "Pro tip",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-7 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm dark:border-emerald-800/60 dark:from-emerald-950/30 dark:to-slate-900/70">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">{title}</p>
      <div className="mt-2 text-[0.98rem] leading-relaxed text-emerald-950 dark:text-emerald-100">{children}</div>
    </aside>
  );
}

export function Mistake({
  title = "Common mistake",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-7 rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-white p-4 shadow-sm dark:border-rose-800/60 dark:from-rose-950/30 dark:to-slate-900/70">
      <p className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">{title}</p>
      <div className="mt-2 text-[0.98rem] leading-relaxed text-rose-950 dark:text-rose-100">{children}</div>
    </aside>
  );
}

export function Example({
  title = "Example",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="my-7 rounded-2xl border border-primary-200/80 bg-white p-4 shadow-sm dark:border-primary-800/60 dark:bg-slate-900/60 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300">{title}</p>
      <div className="mt-2 text-[0.99rem] leading-relaxed text-slate-800 dark:text-slate-200">{children}</div>
    </section>
  );
}

function mapUlToChecklistItems(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return child;
    const isUl = child.type === "ul" || (typeof child.type === "string" && child.type === "ul");
    if (!isUl) return child;
    const listChildren = child.props.children;
    return (
      <ul className="m-0 list-none space-y-3 p-0">
        {Children.map(listChildren, (li, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary-600 bg-white text-xs font-bold text-primary-700 dark:border-primary-400 dark:bg-slate-900 dark:text-primary-300"
              aria-hidden
            >
              ✓
            </span>
            <span className="min-w-0 pt-0.5">{li}</span>
          </li>
        ))}
      </ul>
    );
  });
}

export function Checklist({
  title = "Quick checklist",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="my-10 rounded-[var(--radius-card)] border-2 border-primary-200/90 bg-gradient-to-b from-primary-50/95 to-white p-6 shadow-[var(--shadow-soft)] dark:border-primary-800/70 dark:from-primary-950/40 dark:to-slate-900 sm:p-8"
      aria-labelledby="checklist-heading"
    >
      <p id="checklist-heading" className="text-xs font-bold uppercase tracking-wider text-primary-800 dark:text-primary-200">
        {title}
      </p>
      <div className="mt-4 font-article text-[0.9375rem] leading-relaxed text-slate-900 dark:text-slate-100">
        {mapUlToChecklistItems(children)}
      </div>
    </section>
  );
}

export function KeyTakeaway({ children }: { children: ReactNode }) {
  return (
    <aside
      className="my-8 rounded-[var(--radius-card)] border border-primary-200/80 bg-[var(--color-primary-soft)] p-6 shadow-sm dark:border-primary-800/60 dark:bg-primary-950/30 sm:p-7"
      aria-label="Key takeaway"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-primary-800 dark:text-primary-200">Key takeaway</p>
      <div className="mt-2 font-article text-base font-medium leading-[1.65] text-slate-900 dark:text-slate-100">{children}</div>
    </aside>
  );
}

export function WhyAudienceGrid({
  ats,
  recruiters,
  hiringManagers,
}: {
  ats: string;
  recruiters: string;
  hiringManagers: string;
}) {
  const cards = [
    { title: "ATS", subtitle: "Applicant tracking systems", body: ats, Icon: Cpu },
    { title: "Recruiters", subtitle: "First-pass screeners", body: recruiters, Icon: Users },
    { title: "Hiring managers", subtitle: "Team decision-makers", body: hiringManagers, Icon: Briefcase },
  ];
  return (
    <section className="my-12 scroll-mt-32" aria-labelledby="why-tailoring-matters">
      <h2
        id="why-tailoring-matters"
        className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[1.65rem]"
      >
        Why tailoring matters
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ title, subtitle, body, Icon }) => (
          <div
            key={title}
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] dark:border-slate-700 dark:bg-slate-900/60 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-200/80 bg-primary-50 text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/50 dark:text-primary-200">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-primary-700 dark:text-primary-300">{title}</p>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--color-muted)]">{subtitle}</p>
              </div>
            </div>
            <p className="mt-4 font-article text-sm leading-[1.65] text-slate-700 dark:text-slate-300">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Mini block for scan-friendly “term → detail” rows inside a section. */
export function TermBlock({ term, children }: { term: string; children: ReactNode }) {
  return (
    <dl className="my-5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--surface-soft)] p-5 dark:border-slate-700 dark:bg-slate-800/40 sm:p-6">
      <dt className="text-base font-bold text-slate-900 dark:text-slate-50">{term}</dt>
      <dd className="mt-2 font-article text-[1.0625rem] leading-[1.65] text-slate-700 dark:text-slate-300 [&_p]:mb-0">{children}</dd>
    </dl>
  );
}

export function BeforeAfterCompare({ before, after }: { before: string; after: string }) {
  return (
    <div
      className="my-10 grid gap-4 sm:grid-cols-2"
      role="group"
      aria-label="Resume bullet before and after comparison"
    >
      <div className="rounded-[var(--radius-card)] border border-slate-200/90 bg-slate-50/90 p-5 dark:border-slate-600 dark:bg-slate-800/40 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Before</p>
        <p className="mt-3 font-article text-base leading-[1.65] text-slate-700 dark:text-slate-300">{before}</p>
      </div>
      <div className="rounded-[var(--radius-card)] border border-primary-200/80 bg-primary-50/60 p-5 dark:border-primary-800/50 dark:bg-primary-950/25 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary-800 dark:text-primary-200">After</p>
        <p className="mt-3 font-article text-base font-medium leading-[1.65] text-slate-900 dark:text-slate-100">{after}</p>
      </div>
    </div>
  );
}

export function WarningAdvice({ title = "Important", children }: { title?: string; children: ReactNode }) {
  return (
    <aside
      className="my-10 flex gap-4 rounded-[var(--radius-card)] border border-amber-200/90 bg-amber-50/90 p-5 shadow-sm dark:border-amber-800/60 dark:bg-amber-950/25 sm:p-6"
      role="note"
    >
      <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-bold text-amber-950 dark:text-amber-100">{title}</p>
        <div className="mt-2 font-article text-[0.9375rem] leading-[1.65] text-amber-950 dark:text-amber-50">{children}</div>
      </div>
    </aside>
  );
}

export function ResumeDoctorCta() {
  return (
    <section
      className="my-12 rounded-[var(--radius-card)] border border-primary-200/80 bg-gradient-to-br from-white to-primary-50/50 p-6 shadow-[var(--shadow-soft)] dark:border-primary-800/50 dark:from-slate-900 dark:to-primary-950/20 sm:p-8"
      aria-labelledby="rd-cta-heading"
    >
      <h2 id="rd-cta-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
        Tailor your resume faster with ResumeDoctor
      </h2>
      <p className="mt-3 max-w-2xl font-article text-base leading-[1.65] text-slate-600 dark:text-slate-400">
        Paste a job description, get summary and keyword suggestions, then edit with control.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/try"
          prefetch
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-400 sm:w-auto"
        >
          Try ResumeDoctor
        </Link>
        <Link
          href="/blog/ats-friendly-resume-complete-guide"
          prefetch
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-primary-300 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 sm:w-auto"
        >
          Read ATS Guide
          <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
