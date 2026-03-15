// Phase 4 – Interview prep: common questions + AI-generated answers (rate limited)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserDashboardLayout } from "@/components/user-dashboard-layout";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

const SAMPLE_QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want to work here?",
  "What is your greatest strength?",
  "Describe a challenging project and how you overcame obstacles.",
  "Where do you see yourself in 5 years?",
];

interface ResumeOption {
  id: string;
  title: string;
}

export default function InterviewPrepPage() {
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [resumeId, setResumeId] = useState<string>("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loadingQuestion, setLoadingQuestion] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/resumes", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : { resumes: [] }))
        .then((d) => {
          const raw = Array.isArray(d) ? d : (d.resumes ?? []);
          const list = raw.map((r: { id: string; title: string }) => ({
            id: r.id,
            title: r.title,
          }));
          setResumes(list);
          if (list.length > 0 && !resumeId) setResumeId(list[0].id);
        })
        .finally(() => setLoadingResumes(false));
    } else {
      setLoadingResumes(false);
    }
  }, [session?.user?.email]);

  const handleGenerate = async (index: number) => {
    const question = SAMPLE_QUESTIONS[index];
    if (!question) return;
    setError(null);
    setLoadingQuestion(index);
    try {
      const res = await fetch("/api/interview-prep/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question,
          resumeId: resumeId || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setRateLimit({ used: data.used ?? 0, limit: data.limit ?? 5 });
        setError(data.error || "Daily limit reached. Upgrade to Pro for more.");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Failed to generate answer");
        return;
      }
      setAnswers((prev) => ({ ...prev, [index]: data.answer || "" }));
    } finally {
      setLoadingQuestion(null);
    }
  };

  const isAuthenticated = !!session?.user;

  return (
    <UserDashboardLayout
      title="Interview Prep"
      subtitle="Practice common interview questions. Generate AI sample answers tailored to your resume (uses your daily AI quota)."
    >
      <div className="space-y-6">
        {isAuthenticated && resumes.length > 0 && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Use resume for personalized answers (optional)
            </label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className="w-full max-w-md rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
            >
              <option value="">No resume</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isAuthenticated && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Sign in to generate AI sample answers.
            </p>
            <Link
              href="/login"
              className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
            >
              Sign in
            </Link>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
            {rateLimit && (
              <span className="text-red-600 dark:text-red-300">
                ({rateLimit.used}/{rateLimit.limit} used today)
              </span>
            )}
          </div>
        )}

        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Common questions to prepare for:
        </p>
        <ul className="space-y-4">
          {SAMPLE_QUESTIONS.map((q, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
            >
              <div className="px-5 py-4">
                <p className="font-medium text-slate-900 dark:text-slate-100">{q}</p>
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => handleGenerate(i)}
                    disabled={loadingQuestion !== null || status === "loading"}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingQuestion === i ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate sample answer
                      </>
                    )}
                  </button>
                )}
                {answers[i] && (
                  <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-4">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Sample answer
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {answers[i]}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-primary-200/60 dark:border-primary-800/40 bg-primary-50/50 dark:bg-primary-900/20 p-5">
          <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
            Pro tip
          </p>
          <p className="mt-1 text-sm text-primary-700/90 dark:text-primary-300/90">
            Use the &quot;Tailor for job&quot; feature in the resume builder to align your experience with the job description before your interview.
          </p>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
