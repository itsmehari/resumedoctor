// Phase 4 – Interview prep: common questions + AI-generated answers (rate limited)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserDashboardLayout } from "@/components/user-dashboard-layout";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Mic,
  RefreshCw,
  Copy,
} from "lucide-react";

const SAMPLE_QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want to work here?",
  "What is your greatest strength?",
  "Describe a challenging project and how you overcame obstacles.",
  "Where do you see yourself in 5 years?",
];

const PREP_TRACK = [
  {
    id: "research",
    title: "Research company and role",
    description: "Study mission, product, role expectations, and latest company updates.",
  },
  {
    id: "elevator-pitch",
    title: "Craft your 60-second pitch",
    description: "Prepare your intro: who you are, what you have done, and why this role fits.",
  },
  {
    id: "story-bank",
    title: "Build STAR story bank",
    description: "Draft 5-7 stories that prove leadership, impact, ownership, and resilience.",
  },
  {
    id: "practice",
    title: "Practice core + role-specific questions",
    description: "Rehearse with timer, record your responses, and tighten weak answers.",
  },
  {
    id: "final-review",
    title: "Final pre-interview checklist",
    description: "Review resume, portfolio links, logistics, outfit, and backup internet setup.",
  },
];

const QUESTION_CATEGORIES = [
  {
    id: "behavioral",
    title: "Behavioral",
    questions: [
      "Tell me about a time you disagreed with a teammate and how you resolved it.",
      "Describe a failure and what you learned from it.",
      "When did you take ownership outside your formal responsibilities?",
      "How do you prioritize when multiple deadlines collide?",
    ],
  },
  {
    id: "role-fit",
    title: "Role Fit",
    questions: [
      "Why are you interested in this role and this company?",
      "Which of your projects is most relevant to this job and why?",
      "What is one skill gap you are currently working on?",
      "How would your previous manager describe your work style?",
    ],
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    questions: [
      "Walk me through a complex problem you solved end-to-end.",
      "How do you approach ambiguity when requirements are unclear?",
      "Tell me about a process you improved and the measurable result.",
      "How would you break down a large project in its first week?",
    ],
  },
];

const SCORE_RUBRIC = [
  "Clarity: Was your answer structured and easy to follow?",
  "Impact: Did you include measurable outcomes?",
  "Relevance: Did your story map to the role requirements?",
  "Confidence: Did you sound concise and intentional?",
  "Depth: Did you show decision-making and trade-offs?",
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
  const [categoryId, setCategoryId] = useState<string>(QUESTION_CATEGORIES[0].id);
  const [activeQuestion, setActiveQuestion] = useState<string>(SAMPLE_QUESTIONS[0]);
  const [practiceNotes, setPracticeNotes] = useState<string>("");
  const [prepChecklist, setPrepChecklist] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [score, setScore] = useState<Record<string, number>>({});

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
  }, [resumeId, session?.user?.email]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("interview-prep-checklist");
      if (raw) {
        setPrepChecklist(JSON.parse(raw) as Record<string, boolean>);
      }
    } catch {
      // Ignore malformed local data.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("interview-prep-checklist", JSON.stringify(prepChecklist));
  }, [prepChecklist]);

  useEffect(() => {
    if (!timerRunning) return;
    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [timerRunning]);

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

  const currentCategory =
    QUESTION_CATEGORIES.find((category) => category.id === categoryId) ?? QUESTION_CATEGORIES[0];

  const formatClock = (value: number) => {
    const minutes = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const randomizeQuestion = () => {
    const allQuestions = QUESTION_CATEGORIES.flatMap((category) => category.questions);
    const next = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    setActiveQuestion(next);
  };

  const checklistDone = Object.values(prepChecklist).filter(Boolean).length;
  const checklistTotal = PREP_TRACK.length;

  const isAuthenticated = !!session?.user;

  return (
    <UserDashboardLayout
      title="Interview Prep"
      subtitle="End-to-end interactive interview prep: planning, practice, AI-assisted answers, and self-review in one place."
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200/60 dark:border-primary-800/40 bg-primary-50/50 dark:bg-primary-900/20 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                Interview success roadmap
              </p>
              <p className="mt-1 text-sm text-primary-700/90 dark:text-primary-300/90">
                Complete every stage and track your progress. Your checklist is saved on this
                browser.
              </p>
            </div>
            <span className="rounded-full bg-white/80 dark:bg-slate-900/60 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
              {checklistDone}/{checklistTotal} done
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {PREP_TRACK.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-primary-100/80 dark:border-primary-900/50 bg-white/70 dark:bg-slate-900/40 px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    setPrepChecklist((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  aria-label={`Toggle ${item.title}`}
                  className="mt-0.5 text-primary-700 dark:text-primary-300"
                >
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      prepChecklist[item.id] ? "opacity-100" : "opacity-30"
                    }`}
                  />
                </button>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

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
        {loadingResumes && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
            Loading your resumes...
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

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Live answer practice
              </p>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300">
                <Clock3 className="h-3.5 w-3.5" />
                {formatClock(secondsLeft)}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {QUESTION_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    categoryId === category.id
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {currentCategory.questions.map((question) => (
                <li key={question}>
                  <button
                    type="button"
                    onClick={() => setActiveQuestion(question)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                      activeQuestion === question
                        ? "border-primary-300 bg-primary-50 text-primary-900 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-200"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Active prompt
              </p>
              <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{activeQuestion}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTimerRunning((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Mic className="h-4 w-4" />
                {timerRunning ? "Pause timer" : "Start 2-min timer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSecondsLeft(120);
                  setTimerRunning(false);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
              <button
                type="button"
                onClick={randomizeQuestion}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Random question
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Self-review notes
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Use this to capture weak points, better phrasing, and follow-up examples.
            </p>
            <textarea
              value={practiceNotes}
              onChange={(e) => setPracticeNotes(e.target.value)}
              className="mt-3 h-52 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm text-slate-800 dark:text-slate-100"
              placeholder="Example: Keep answer under 90 seconds, include metrics, mention team size..."
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(practiceNotes)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <Copy className="h-4 w-4" />
                Copy notes
              </button>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Quick scoring rubric (1-5)
              </p>
              <div className="space-y-2">
                {SCORE_RUBRIC.map((item) => (
                  <div key={item} className="flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-700 dark:text-slate-300">{item}</p>
                    <select
                      value={score[item] ?? 0}
                      onChange={(e) =>
                        setScore((prev) => ({ ...prev, [item]: Number(e.target.value) }))
                      }
                      className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-xs"
                    >
                      <option value={0}>-</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          AI sample answers for high-frequency interview questions:
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
                        Generating...
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
            Use the &quot;Tailor for job&quot; feature in the resume builder to align your
            experience with the job description before your interview.
          </p>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
