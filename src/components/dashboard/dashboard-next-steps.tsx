import Link from "next/link";

type Props = {
  firstResumeId: string | null;
};

export function DashboardNextSteps({ firstResumeId }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Next steps</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={firstResumeId ? `/resumes/${firstResumeId}/edit` : "/resumes/new"}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Continue editing
        </Link>
        <Link
          href="/ats-resume-checker"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ATS &amp; JD match
        </Link>
        <Link
          href="/cover-letters/new"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cover letter
        </Link>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Browse jobs
        </Link>
      </div>
    </div>
  );
}
