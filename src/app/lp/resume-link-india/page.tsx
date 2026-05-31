import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { TrustBadges } from "@/components/trust-badges";
import { LpTierClarification } from "@/components/lp/lp-tier-clarification";
import { ResumeLinkCta } from "@/components/resume-link/resume-link-cta";
import { ResumeLinkUrlTiers } from "@/components/resume-link/resume-link-url-tiers";

export const metadata: Metadata = {
  title: "Resume Link India — Share CV on WhatsApp & LinkedIn | ResumeDoctor",
  description:
    "One URL for your resume — always up to date. Free to publish on ResumeDoctor. Share on WhatsApp, LinkedIn, Naukri follow-ups, or a printed QR. Pro Link adds custom URL and analytics.",
  alternates: { canonical: `${siteUrl}/lp/resume-link-india` },
};

export default function ResumeLinkIndiaLp() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader variant="home" />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-16 sm:py-20 outline-none"
      >
        <p className="text-center text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
          India · Shareable resume URL
        </p>
        <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Your resume as one link — not another PDF attachment
        </h1>
        <p className="mt-4 text-center text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Build on ResumeDoctor, publish a live URL, and paste it on WhatsApp, LinkedIn DMs, recruiter
          email, or your bio. Update once — every link you&apos;ve shared stays current.
        </p>

        <div className="mt-8">
          <ResumeLinkUrlTiers variant="light" />
        </div>

        <div className="mt-10 flex justify-center">
          <TrustBadges />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ResumeLinkCta variant="primary" className="px-10 py-4 text-lg shadow-lg">
            Get your resume link
          </ResumeLinkCta>
          <Link
            href="/r/demo"
            className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-center text-base font-semibold text-slate-800 transition hover:border-cyan-400 hover:text-cyan-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            See live demo
          </Link>
        </div>

        <LpTierClarification />

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Why a link beats a PDF in India</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>WhatsApp recruiters open links in one tap — no download friction.</li>
            <li>Campus drives and networking events: print a QR to your live CV.</li>
            <li>Naukri / LinkedIn follow-ups: one URL instead of re-attaching files.</li>
            <li>Free publish today; Pro Link (₹99/mo) adds your-name URL + view count.</li>
          </ul>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Full guide:{" "}
          <Link href="/resume-link" className="text-primary-600 hover:underline dark:text-primary-400">
            Resume link product page
          </Link>
          {" · "}
          <Link href="/pricing#pro-link" className="text-primary-600 hover:underline dark:text-primary-400">
            Pro Link pricing
          </Link>
        </p>
      </main>
    </div>
  );
}
