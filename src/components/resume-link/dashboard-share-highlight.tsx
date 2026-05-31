"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, MessageCircle } from "lucide-react";
import { buildWhatsAppShareUrl } from "@/lib/resume-link-utils";
import { useToast } from "@/contexts/toast-context";

/** Dashboard banner when user arrives via smart CTA with an existing published link. */
export function DashboardShareHighlight({
  resumeId,
}: {
  resumeId: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/resumes/${resumeId}/share`, { method: "POST", credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.url) setUrl(data.url);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [resumeId]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Link copied", { variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-cyan-200/60 bg-cyan-50/50 p-4 text-sm text-slate-600 dark:border-cyan-800/40 dark:bg-cyan-950/20 dark:text-slate-300">
        Loading your resume link…
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-950/30">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
          Could not load your share link.
        </p>
        <Link
          href={`/resumes/${resumeId}/edit?share=1`}
          className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
        >
          Open editor to publish link →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-cyan-300/70 bg-gradient-to-br from-cyan-50 to-sky-50 p-5 shadow-sm dark:border-cyan-700/50 dark:from-cyan-950/30 dark:to-sky-950/20">
      <p className="font-semibold text-slate-900 dark:text-white">Your resume link is live</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Share on WhatsApp, LinkedIn, or email — updates automatically when you edit.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={url}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <a
            href={buildWhatsAppShareUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        <Link
          href={`/resumes/${resumeId}/edit?share=1`}
          className="font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          Manage link & QR
        </Link>
        {" · "}
        <Link href="/pricing#pro-link" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Upgrade to custom URL
        </Link>
      </p>
    </div>
  );
}
