"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { BookOpen, Search, X } from "lucide-react";
import type { BlogPost, BlogPostSummary } from "@/lib/blog";
import { cn } from "@/lib/utils";

type Props = {
  allTags: string[];
  /** All posts (for search). */
  posts: BlogPostSummary[];
  /** Hero card when not filtering. */
  featured: BlogPost | null;
};

function debouncedQuery(q: string, items: BlogPostSummary[]) {
  const t = q.trim().toLowerCase();
  if (!t) return items;
  return items.filter((p) => {
    const blob = `${p.title} ${p.description} ${(p.tags || []).join(" ")}`.toLowerCase();
    return blob.includes(t);
  });
}

export function BlogIndexClient({ allTags, posts, featured }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = debouncedQuery(query, posts);
    if (activeTag) {
      list = list.filter((p) => p.tags?.includes(activeTag));
    }
    return list;
  }, [query, posts, activeTag]);

  const showFeaturedHero = Boolean(
    featured && !query.trim() && !activeTag
  );
  const gridPosts = useMemo(() => {
    if (!showFeaturedHero || !featured) return filtered;
    return filtered.filter((p) => p.slug !== featured.slug);
  }, [filtered, showFeaturedHero, featured]);

  return (
    <div>
      {showFeaturedHero && featured ? (
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Featured</p>
          <Link
            href={`/blog/${featured.slug}`}
            prefetch
            className="mt-3 flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 shadow-md transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:from-slate-900 dark:to-slate-950/80 sm:grid sm:min-h-[280px] sm:grid-cols-2"
          >
            <div className="relative h-56 w-full sm:min-h-[280px] sm:h-full">
              <Image
                src={featured.coverImage || "/blog/covers/default.svg"}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 50vw, 100vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">{featured.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                {featured.date ? <span>{format(new Date(featured.date), "MMM d, yyyy")}</span> : null}
                <span className="font-semibold text-primary-600 dark:text-primary-400">Read →</span>
              </div>
            </div>
          </Link>
        </div>
      ) : null}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900/80"
            autoComplete="off"
            aria-label="Search blog posts"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Tip: use tags to filter by topic.</p>
      </div>

      {allTags.length > 0 ? (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              activeTag === null
                ? "border-primary-500 bg-primary-50 text-primary-800 dark:border-primary-500 dark:bg-primary-950/50 dark:text-primary-200"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag((a) => (a === tag ? null : tag))}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold capitalize transition",
                activeTag === tag
                  ? "border-primary-500 bg-primary-50 text-primary-800 dark:border-primary-500 dark:bg-primary-950/50 dark:text-primary-200"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}

      {gridPosts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
          No articles match your filters.{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveTag(null);
            }}
            className="font-semibold text-primary-600 dark:text-primary-400"
          >
            Clear search and tags
          </button>
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <li key={post.slug} className="">
              <Link
                href={`/blog/${post.slug}`}
                prefetch
                className="group relative flex h-full min-h-[180px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-primary-300/60 hover:shadow-lg hover:shadow-primary-900/[0.04] dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-primary-700/40 sm:p-8"
              >
                {post.coverImage ? (
                  <div className="mb-3 -mt-1 aspect-[16/7] w-full overflow-hidden rounded-xl">
                    <Image
                      src={post.coverImage}
                      alt=""
                      width={800}
                      height={350}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : null}
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  {(post.tags || []).map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Guide
                </span>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary-700 dark:text-slate-50 dark:group-hover:text-primary-300 sm:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{post.description}</p>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
                  <span>
                    {post.date ? format(new Date(post.date), "MMM d, yyyy") : ""} · {post.readTime} min read
                    {post.updated ? (
                      <span className="ml-1 text-primary-600 dark:text-primary-400">· updated</span>
                    ) : null}
                  </span>
                  <span className="font-semibold text-primary-600 transition group-hover:translate-x-0.5 dark:text-primary-400">
                    Read →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
