"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

type Props = { slug: string };

export function BlogArticleFeedback({ slug }: Props) {
  const [submitted, setSubmitted] = useState<"yes" | "no" | null>(null);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const send = async (helpful: boolean) => {
    setSending(true);
    try {
      await fetch("/api/blog/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, helpful, comment: helpful ? undefined : comment || undefined }),
      });
      setSubmitted(helpful ? "yes" : "no");
    } catch {
      setSubmitted(helpful ? "yes" : "no");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-center text-sm text-slate-600 dark:text-slate-400" role="status">
        Thanks for your feedback.
      </p>
    );
  }

  return (
    <div className="blog-hide-in-reader border-t border-slate-200 pt-8 text-center dark:border-slate-800">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Was this article helpful?</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={sending}
          onClick={() => void send(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        >
          <ThumbsUp className="h-4 w-4" aria-hidden />
          Yes
        </button>
        <button
          type="button"
          disabled={sending}
          onClick={() => void send(false)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-amber-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        >
          <ThumbsDown className="h-4 w-4" aria-hidden />
          No
        </button>
      </div>
      <div className="mt-4 max-w-md mx-auto">
        <label htmlFor="feedback-why" className="sr-only">
          What could be better? (optional)
        </label>
        <textarea
          id="feedback-why"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="What could be better? (optional)"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        />
      </div>
    </div>
  );
}
