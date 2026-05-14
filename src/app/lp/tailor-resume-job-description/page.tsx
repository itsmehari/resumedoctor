import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { TrustBadges } from "@/components/trust-badges";
import { LpTierClarification } from "@/components/lp/lp-tier-clarification";

export const metadata: Metadata = {
  title: "Tailor Your Resume to the Job Description | ResumeDoctor",
  description:
    "Align your resume with a real JD: recruiter-readable layout plus keyword-match guidance. Build, share as a link, then export on Pro via SuperProfile when you need PDF or Word.",
  alternates: { canonical: `${siteUrl}/lp/tailor-resume-job-description` },
};

export default function TailorResumeJobDescriptionLp() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader variant="home" />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-16 outline-none sm:py-20"
      >
        <p className="text-center text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Job description fit · Keywords
        </p>
        <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Tailor your resume to each job description
        </h1>
        <p className="mt-4 text-center text-lg text-slate-600 dark:text-slate-400">
          Paste a JD, tighten bullets and skills with AI help, and use match guidance as a checklist—not a promise of
          shortlist. Built for how Indian portals and employers read files first.
        </p>
        <div className="mt-10 flex justify-center">
          <TrustBadges />
        </div>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/try"
            className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-primary-700"
          >
            Start with OTP Try
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-center text-base font-semibold text-slate-800 transition hover:border-primary-400 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-primary-500"
          >
            See pricing
          </Link>
        </div>
        <LpTierClarification />
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Guides:{" "}
          <Link
            href="/blog/how-to-tailor-resume-for-job-description"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            How to tailor for a JD
          </Link>{" "}
          ·{" "}
          <Link
            href="/blog/how-to-read-ats-job-match-feedback"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            Reading ATS / JD match feedback
          </Link>{" "}
          ·{" "}
          <Link
            href="/lp/update-my-resume-india"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            Update my resume (India)
          </Link>
        </p>
      </main>
    </div>
  );
}
