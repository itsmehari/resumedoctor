// Phase 4 – Interview prep (lite): common questions + AI-generated answers
import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Prep | ResumeDoctor",
  description: "Practice common interview questions with AI-generated answers.",
};

const SAMPLE_QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want to work here?",
  "What is your greatest strength?",
  "Describe a challenging project and how you overcame obstacles.",
  "Where do you see yourself in 5 years?",
];

export default function InterviewPrepPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/jobs" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              Jobs
            </Link>
            <AuthNav />
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Interview Prep
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Practice common interview questions. Coming soon: AI-generated sample answers.
        </p>
        <div className="mt-8 space-y-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Common questions to prepare for:
          </p>
          <ul className="space-y-2">
            {SAMPLE_QUESTIONS.map((q, i) => (
              <li
                key={i}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-200"
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          Pro tip: Use the &quot;Tailor for job&quot; feature in the resume builder to align your experience with the job description before your interview.
        </p>
      </main>
    </div>
  );
}
