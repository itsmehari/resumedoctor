"use client";

// WBS 7.5, 7.6 – ATS score UI (progress bar, checklist, suggestions)
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import type { ResumeSection } from "@/types/resume";

interface AtsResult {
  score: number;
  suggestions: Array<{ type: string; message: string; section?: string }>;
  checks: Array<{ name: string; pass: boolean; detail?: string }>;
  teaser?: boolean;
}

interface Props {
  resumeId: string;
  sections: ResumeSection[];
  isPro: boolean;
}

export function AtsScorePanel({ resumeId, sections, isPro }: Props) {
  const [result, setResult] = useState<AtsResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [teaserUsed, setTeaserUsed] = useState(false);

  type FetchOut = { ok: true; data: AtsResult } | { ok: false; error?: unknown; code?: string };

  const fetchScore = () => {
    setLoading(true);
    setResult(null);
    fetch(`/api/resumes/${resumeId}/ats`, { credentials: "include" })
      .then(async (r): Promise<FetchOut> => {
        if (r.status === 403) {
          const code = r.headers.get("content-type")?.includes("json") ? null : "TEASER_USED";
          const d = await r.json();
          return { ok: false, code: d.code ?? code, error: d.error };
        }
        const d = await r.json();
        return r.ok ? { ok: true, data: d } : { ok: false, error: d.error };
      })
      .then((out) => {
        if (out.ok && out.data) {
          setResult(out.data);
          if (out.data.teaser) setTeaserUsed(true);
        } else if (!out.ok && "code" in out && out.code === "TEASER_USED") {
          setTeaserUsed(true);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isPro && resumeId) fetchScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId, isPro]);

  if (!isPro && !teaserUsed) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
          ATS Checker
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
          Get one free ATS score and top 3 suggestions per resume. Upgrade to Pro for full suggestions and re-checks.
        </p>
        <button
          type="button"
          onClick={fetchScore}
          disabled={loading}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Check ATS score (1 free)"}
        </button>
      </div>
    );
  }

  if (!isPro && teaserUsed && !result) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
          ATS Checker
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          You&apos;ve used your free check for this resume. Upgrade to Pro to see all suggestions and re-check anytime.
        </p>
        <a
          href="/pricing"
          className="mt-2 inline-block text-sm font-medium text-primary-600 hover:underline"
        >
          Upgrade to Pro →
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p className="text-sm text-slate-500">Analyzing resume...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <button
          type="button"
          onClick={fetchScore}
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          Check ATS score
        </button>
      </div>
    );
  }

  const scoreColor =
    result.score >= 80
      ? "text-green-600 dark:text-green-400"
      : result.score >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
          ATS Score
        </h3>
        <button
          type="button"
          onClick={fetchScore}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-slate-200 dark:text-slate-600"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${result.score}, 100`}
              className={scoreColor}
            />
          </svg>
        </div>
        <div>
          <span className={`text-2xl font-bold ${scoreColor}`}>{result.score}</span>
          <span className="text-slate-500 text-sm ml-1">/ 100</span>
        </div>
      </div>

      {result.checks && result.checks.length > 0 && (
        <div className="space-y-2">
          {result.checks.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-2 text-sm"
            >
              {c.pass ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
              )}
              <span className={c.pass ? "text-slate-700 dark:text-slate-300" : "text-slate-600 dark:text-slate-400"}>
                {c.name}
                {c.detail && <span className="text-slate-500 ml-1">({c.detail})</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {result.teaser && (
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
          Upgrade to Pro to see all suggestions and re-check anytime.
        </p>
      )}
      {result.suggestions.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Suggestions {result.teaser ? "(top 3)" : ""}
          </p>
          {result.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              {s.type === "good" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              ) : s.type === "warning" ? (
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              )}
              <span
                className={
                  s.type === "good"
                    ? "text-green-700 dark:text-green-400"
                    : s.type === "warning"
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-slate-600 dark:text-slate-400"
                }
              >
                {s.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
