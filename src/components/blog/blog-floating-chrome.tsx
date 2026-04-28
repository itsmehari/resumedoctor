"use client";

import { useCallback, useState } from "react";
import { ArrowUp, List, Share2, X } from "lucide-react";
import type { MarkdownHeading } from "@/lib/blog-headings";
import { BlogToc } from "./blog-toc";

type Props = {
  headings: MarkdownHeading[];
  shareUrl: string;
  title: string;
};

export function BlogFloatingChrome({ headings, shareUrl, title }: Props) {
  const [tocOpen, setTocOpen] = useState(false);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const share = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch {
          /* ignore */
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        /* ignore */
      }
    }
  }, [title, shareUrl]);

  return (
    <>
      <div
        className="blog-floating-chrome pointer-events-none fixed bottom-6 right-4 z-40 flex flex-col gap-2 sm:bottom-8 sm:right-6 xl:hidden"
        aria-label="Article tools"
      >
        <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-lg backdrop-blur dark:border-slate-600 dark:bg-slate-900/95">
          <button
            type="button"
            onClick={scrollTop}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          {headings.length > 0 ? (
            <button
              type="button"
              onClick={() => setTocOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Table of contents"
            >
              <List className="h-5 w-5" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={share}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {tocOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="On this page"
          onClick={() => setTocOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-600 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">On this page</span>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <BlogToc headings={headings} onNavigate={() => setTocOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
