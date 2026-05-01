import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { TrustBadges } from "@/components/trust-badges";
import { LpTierClarification } from "@/components/lp/lp-tier-clarification";

export const metadata: Metadata = {
  title: "Resume PDF & Word Export for India Portals | ResumeDoctor",
  description:
    "Portal-ready PDF and editable DOCX when you are on Pro—no watermarks on paid tier per pricing. OTP Try to build first.",
  alternates: { canonical: `${siteUrl}/lp/resume-export-pdf-docx-india` },
};

export default function ResumeExportPdfDocxIndiaLp() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader variant="home" />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-16 outline-none sm:py-20"
      >
        <p className="text-center text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          India · Apply with the right file
        </p>
        <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          PDF and Word exports for Naukri, LinkedIn, and company portals
        </h1>
        <p className="mt-4 text-center text-lg text-slate-600 dark:text-slate-400">
          Finish your content in the builder, then download the format portals expect. Pro unlocks application-grade
          exports—see pricing for exactly what is included today.
        </p>
        <div className="mt-10 flex justify-center">
          <TrustBadges />
        </div>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-primary-700"
          >
            Compare plans
          </Link>
          <Link
            href="/try"
            className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-center text-base font-semibold text-slate-800 transition hover:border-primary-400 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-primary-500"
          >
            Start with OTP Try
          </Link>
        </div>
        <LpTierClarification />
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Guides:{" "}
          <Link
            href="/blog/resume-checklist-before-you-apply"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            Pre-submit checklist
          </Link>{" "}
          ·{" "}
          <Link
            href="/blog/ats-friendly-resume-complete-guide"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            ATS-friendly resume
          </Link>
        </p>
      </main>
    </div>
  );
}
