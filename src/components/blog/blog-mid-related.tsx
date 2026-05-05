"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { RelatedLink } from "@/lib/content-links";

type Props = { posts: RelatedLink[] };

export function BlogMidRelatedCarousel({ posts }: Props) {
  if (posts.length === 0) return null;
  return (
    <aside
      className="blog-hide-in-reader my-12 overflow-hidden rounded-2xl border border-primary-200/70 bg-gradient-to-br from-primary-50 via-white to-violet-50/40 p-5 shadow-sm dark:border-primary-800/40 dark:from-primary-950/25 dark:via-slate-900/80 dark:to-violet-950/20 sm:p-6"
      aria-label="Continue reading"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-300">Continue reading</p>
        <span className="text-xs text-slate-500 dark:text-slate-400">{posts.length} related guides</span>
      </div>
      <ul className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:gap-4">
        {posts.map((p, index) => (
          <li key={p.slug} className="min-w-[230px] max-w-[300px] snap-start sm:min-w-0 sm:max-w-none">
            <Link
              href={`/blog/${p.slug}`}
              className="group flex h-full flex-col rounded-xl border border-slate-200/90 bg-white/95 p-4 text-sm text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/65 dark:text-slate-200 dark:hover:border-primary-700"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Guide {index + 1}
              </span>
              <span className="mt-2 line-clamp-3 flex-1 text-sm font-semibold leading-snug text-slate-800 transition group-hover:text-primary-700 dark:text-slate-100 dark:group-hover:text-primary-300">
                {p.title}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                Read article
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
