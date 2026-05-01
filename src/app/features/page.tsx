import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Features — ResumeDoctor",
  description:
    "Templates, AI writing help, ATS match guidance, and PDF/DOCX exports for Indian job seekers. Try with OTP; Pro via SuperProfile.",
  alternates: { canonical: `${siteUrl}/features` },
};

const CAPABILITIES = [
  {
    title: "ATS-friendly templates",
    body: "Layouts aimed at parsers used by employers and portals. Pick a structure, then focus on achievements—not margins.",
    href: "/blog/ats-friendly-resume-complete-guide",
    linkLabel: "ATS guide",
  },
  {
    title: "AI help for bullets and summary",
    body: "Turn rough notes into clearer bullets and a professional summary. You stay in control of what gets sent.",
    href: "/blog/how-to-write-professional-summary",
    linkLabel: "Summary guide",
  },
  {
    title: "Match guidance vs a job description",
    body: "Paste a JD to see where your resume aligns and where keywords or sections are thin. Use it as a checklist, not a hiring guarantee.",
    href: "/blog/how-to-read-ats-job-match-feedback",
    linkLabel: "How to read match feedback",
  },
  {
    title: "PDF and DOCX export",
    body: "Download formats portals expect. What is included without watermarks depends on your tier—see pricing for the current list.",
    href: "/pricing",
    linkLabel: "Pricing & limits",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader variant="home" />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Product snapshot
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            What you get with ResumeDoctor
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            One stack for India-first job search: build in the browser, tighten content with AI, check fit against a JD,
            then export when your plan allows.
          </p>

          <ul className="mt-10 space-y-8">
            {CAPABILITIES.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
              >
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{item.body}</p>
                <Link
                  href={item.href}
                  className="mt-3 inline-block text-sm font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
                >
                  {item.linkLabel} →
                </Link>
              </li>
            ))}
          </ul>

          <section
            aria-labelledby="tier-snapshot-heading"
            className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/50"
          >
            <h2 id="tier-snapshot-heading" className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Tiers (short)
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Try</strong> — OTP session to explore; no card.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Basic</strong> — Signed-in free tier with limits.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Pro</strong> — Paid via SuperProfile; full exports
                and Pro limits on the date you subscribe.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">14-day pass</strong> — India one-time Pro window;
                not the same as OTP Try.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/try"
                className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Start Try
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-primary-400 dark:border-slate-600 dark:text-slate-100"
              >
                Full pricing
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
