"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Mail } from "lucide-react";

type Props = { className?: string };

export function BlogLeadMagnet({ className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/blog/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });
      const data = (await res.json()) as { ok?: boolean; downloadUrl?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");
      setDownloadUrl(data.downloadUrl ?? "/downloads/resume-checklist.txt");
      setDone(true);
    } catch {
      setErr("Something went wrong. You can still download the checklist from /downloads/resume-checklist.txt.");
      setDownloadUrl("/downloads/resume-checklist.txt");
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`blog-hide-in-reader rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/90 to-white p-5 dark:border-violet-900/40 dark:from-violet-950/20 dark:to-slate-900/40 ${className}`}
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Get the resume checklist</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Optional email for product updates — or submit without email to download the printable .txt checklist.
      </p>
      {done ? (
        <div className="mt-4 rounded-xl bg-white p-4 text-center dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">You&apos;re set.</p>
          <Link
            href={downloadUrl || "/downloads/resume-checklist.txt"}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            <Download className="h-4 w-4" />
            Download checklist
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="lead-email" className="sr-only">
              Email (optional)
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="lead-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="Email (optional)"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            {loading ? "…" : "Get link"}
          </button>
        </form>
      )}
      {err ? <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">{err}</p> : null}
    </div>
  );
}
