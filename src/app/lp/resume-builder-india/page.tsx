import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { TrustBadges } from "@/components/trust-badges";
import { LpTierClarification } from "@/components/lp/lp-tier-clarification";

export const metadata: Metadata = {
  title: "Resume Builder India — ATS-Friendly PDF & Word | ResumeDoctor",
  description:
    "Build a resume for Naukri, LinkedIn, and campus drives. OTP Try with no card; Pro unlocks PDF and Word on SuperProfile.",
  alternates: { canonical: `${siteUrl}/lp/resume-builder-india` },
};

export default function ResumeBuilderIndiaLp() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader variant="home" />
      <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-16 sm:py-20 outline-none">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          India · Job applications
        </p>
        <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Resume builder for Indian job portals
        </h1>
        <p className="mt-4 text-center text-lg text-slate-600 dark:text-slate-400">
          Recruiter-ready layouts, AI help for bullets, a shareable resume link for WhatsApp and LinkedIn, plus PDF and
          Word exports when you upgrade — aligned with how you actually apply on Naukri and LinkedIn.
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
          Deep guides:{" "}
          <Link href="/blog/ats-friendly-resume-complete-guide" className="text-primary-600 hover:underline dark:text-primary-400">
            ATS-friendly resume
          </Link>{" "}
          ·{" "}
          <Link href="/blog/resume-formats-india-guide" className="text-primary-600 hover:underline dark:text-primary-400">
            Resume formats in India
          </Link>
        </p>
      </main>
    </div>
  );
}
