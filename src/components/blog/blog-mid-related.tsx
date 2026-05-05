"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { RelatedLink } from "@/lib/content-links";

type Props = { posts: RelatedLink[] };

export function BlogMidRelatedCarousel({ posts }: Props) {
  if (posts.length === 0) return null;
  return (
    <aside
      className="blog-hide-in-reader my-14 overflow-hidden rounded-[var(--radius-card)] border border-primary-200/70 bg-gradient-to-br from-[var(--color-primary-soft)] via-white to-slate-50/80 p-5 shadow-[var(--shadow-soft)] dark:border-primary-800/40 dark:from-primary-950/25 dark:via-slate-900/80 dark:to-slate-950/40 sm:p-7"
      aria-label="Continue reading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-800 dark:text-primary-200">Continue reading</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Related guides that pair with this workflow.</p>
        </div>
        <span className="text-xs font-medium text-[var(--color-muted)]">{posts.length} picks</span>
      </div>
      <ul className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:snap-none [&::-webkit-scrollbar]:hidden">
        {posts.map((p) => (
          <li key={p.slug} className="min-w-[min(100%,280px)] max-w-[320px] snap-start sm:min-w-0 sm:max-w-none">
            <Link
              href={`/blog/${p.slug}`}
              className="group flex h-full min-h-[148px] flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--surface)] p-5 text-slate-800 shadow-[var(--shadow-soft)] transition duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-primary-600"
            >
              {p.category ? (
                <span className="inline-flex w-fit rounded-full border border-slate-200/90 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-400">
                  {p.category}
                </span>
              ) : (
                <span className="inline-flex w-fit rounded-full border border-slate-200/90 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-400">
                  Guide
                </span>
              )}
              <span className="mt-3 line-clamp-3 flex-1 text-base font-bold leading-snug tracking-tight text-slate-900 transition group-hover:text-primary-700 dark:text-slate-50 dark:group-hover:text-primary-300">
                {p.title}
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary-700 dark:text-primary-300">
                Read article
                <ArrowUpRight className="h-3.5 w-3.5 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
