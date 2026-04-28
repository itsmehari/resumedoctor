"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { RelatedLink } from "@/lib/content-links";

type Props = { posts: RelatedLink[] };

export function BlogMidRelatedCarousel({ posts }: Props) {
  if (posts.length === 0) return null;
  return (
    <aside
      className="blog-hide-in-reader my-10 overflow-hidden rounded-2xl border border-dashed border-primary-200/80 bg-gradient-to-br from-primary-50/80 to-white p-4 dark:border-primary-800/40 dark:from-primary-950/30 dark:to-slate-900/60"
      aria-label="Continue reading"
    >
      <p className="text-sm font-bold text-primary-800 dark:text-primary-200">Continue reading</p>
      <ul className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible">
        {posts.map((p) => (
          <li key={p.slug} className="min-w-[220px] max-w-[280px] snap-start sm:min-w-0 sm:max-w-none">
            <Link
              href={`/blog/${p.slug}`}
              className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200"
            >
              <span className="line-clamp-2 flex-1">{p.title}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                Read
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
