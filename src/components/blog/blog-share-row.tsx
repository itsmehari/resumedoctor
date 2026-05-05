"use client";

import { useCallback, useState } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";

type Props = {
  url: string;
  title: string;
};

function withUtm(href: string, source: string) {
  try {
    const u = new URL(href);
    u.searchParams.set("utm_source", "resumedoctor");
    u.searchParams.set("utm_medium", "blog_share");
    u.searchParams.set("utm_campaign", source);
    return u.toString();
  } catch {
    return href;
  }
}

export function BlogShareRow({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = withUtm(url, "copy");

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [shareUrl]);

  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`;

  const native = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      void copy();
    }
  }, [title, shareUrl, copy]);

  return (
    <div className="mt-6 rounded-xl border border-slate-200/80 bg-white/80 p-2.5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70">
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Share</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-500"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" aria-hidden />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <a
        href={linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
      >
        LinkedIn
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={native}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary-300 dark:border-slate-600 dark:bg-slate-900 sm:hidden"
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" aria-hidden />
        Share
      </button>
      </div>
    </div>
  );
}
