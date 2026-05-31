import Link from "next/link";
import { ResumeLinkCta } from "@/components/resume-link/resume-link-cta";

export function DemoResumeBanner() {
  return (
    <div className="mb-6 rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-indigo-50 px-4 py-3 dark:border-cyan-800/50 dark:from-cyan-950/40 dark:to-indigo-950/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700 dark:text-slate-200">
          <span className="font-semibold text-slate-900 dark:text-white">Live demo</span> — this is
          how your resume looks when shared as a link. Fictional profile for illustration.
        </p>
        <ResumeLinkCta variant="primary" className="shrink-0 px-5 py-2.5 text-sm shadow-md">
          Create yours free
        </ResumeLinkCta>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Prefer the full story?{" "}
        <Link href="/resume-link" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          How resume links work
        </Link>
      </p>
    </div>
  );
}
