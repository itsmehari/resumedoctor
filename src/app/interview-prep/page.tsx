// Phase 4 – Interview prep (lite): common questions + AI-generated answers
"use client";

import { UserDashboardLayout } from "@/components/user-dashboard-layout";

const SAMPLE_QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want to work here?",
  "What is your greatest strength?",
  "Describe a challenging project and how you overcame obstacles.",
  "Where do you see yourself in 5 years?",
];

export default function InterviewPrepPage() {
  return (
    <UserDashboardLayout
      title="Interview Prep"
      subtitle="Practice common interview questions. Coming soon: AI-generated sample answers."
    >
      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Common questions to prepare for:
        </p>
        <ul className="space-y-3">
          {SAMPLE_QUESTIONS.map((q, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 text-slate-800 dark:text-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {q}
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-xl border border-primary-200/60 dark:border-primary-800/40 bg-primary-50/50 dark:bg-primary-900/20 p-5">
          <p className="text-sm text-primary-800 dark:text-primary-200 font-medium">
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
