// SEO landing — intent: "update my resume", "refresh resume", "revise CV India".
// Complements /resume-link (distribution) with maintenance-focused copy.
import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { TrustBadges } from "@/components/trust-badges";
import { LpTierClarification } from "@/components/lp/lp-tier-clarification";
import { siteUrl } from "@/lib/seo";

const CANONICAL = `${siteUrl}/lp/update-my-resume-india`;

const FAQS = [
  {
    q: "How often should I update my resume in India?",
    a: "At minimum after every role change, promotion, or major project. Many active job seekers refresh headline, skills, and top bullets every 3–6 months so Naukri and LinkedIn search results stay aligned with what recruiters query today.",
  },
  {
    q: "What is the fastest way to update my resume without starting from scratch?",
    a: "Open your existing document in ResumeDoctor (OTP Try or your account), adjust sections in the editor, and re-run ATS or job-description match if you use those tools. When you publish a resume link, the same URL reflects your latest version—no re-sending attachments.",
  },
  {
    q: "Should I update Naukri and LinkedIn when I change my resume file?",
    a: "Yes. Portals rank partly on recency and field consistency. After you update your resume text, upload the new file where the portal asks for a CV, and align your profile headline and skills so they match the document recruiters open.",
  },
  {
    q: "Do I need to pay to update my resume on ResumeDoctor?",
    a: "Editing and publishing your live resume link are free. PDF and Word export, full template access, and advanced features unlock on Pro via SuperProfile—same account email as your builder login.",
  },
  {
    q: "How is this different from a resume link?",
    a: "This page is about refreshing content—metrics, dates, skills, and portal alignment. A resume link is how you share one URL that always shows your latest version. Many people do both: update in the editor, then share the same link everywhere.",
  },
];

export const metadata: Metadata = {
  title: "Update My Resume (India) — Refresh Your CV | ResumeDoctor",
  description:
    "When and how to update your resume for Naukri, LinkedIn, and Indian employers. Quick checklist, India portal tips, then edit in ResumeDoctor—OTP Try or account. Share a link that stays current.",
  alternates: { canonical: CANONICAL },
  keywords: [
    "update my resume",
    "how to update resume",
    "refresh resume India",
    "revise CV India",
    "resume update Naukri",
    "keep resume current",
    "update CV online India",
  ],
  openGraph: {
    title: "Update My Resume (India) — Refresh Your CV | ResumeDoctor",
    description:
      "Refresh headline, skills, and bullets; align Naukri & LinkedIn; edit in ResumeDoctor. Try with OTP—share one link that stays up to date.",
    url: CANONICAL,
    type: "website",
    siteName: "ResumeDoctor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Update My Resume (India) — Refresh Your CV | ResumeDoctor",
    description:
      "When to update, what to change first, and how Indian portals read recency. Build in ResumeDoctor; share a live link.",
  },
};

export default function UpdateMyResumeIndiaLp() {
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Resume maintenance · India job search
            </p>
            <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Update my resume — the right things, in the right order
            </h1>
            <p className="mt-4 text-center text-lg text-slate-600 dark:text-slate-400">
              Most people search &quot;update my resume&quot; when something changed—a new role, a stack shift, a return
              to market, or a stalled search. Here is a concise India-first path: what to refresh, how portals read it,
              then where to do the work in ResumeDoctor.
            </p>
            <div className="mt-10 flex justify-center">
              <TrustBadges />
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
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
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">When to update (triggers)</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
            <li>You took on a new title, team size, budget, or geography.</li>
            <li>Your tech stack or certifications changed materially.</li>
            <li>You completed a measurable win (revenue, latency, adoption) you can quantify in a bullet.</li>
            <li>You are switching function or industry and need different keywords above the fold.</li>
            <li>Your last Naukri or LinkedIn &quot;resume updated&quot; date is old enough that recruiters may skip you in sort.</li>
          </ul>
        </section>

        <section className="border-y border-slate-200/80 bg-white py-14 dark:border-slate-800 dark:bg-slate-900/30 sm:py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Quick refresh checklist</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700 dark:text-slate-300">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Headline / summary</strong> — Match the role
                family you want next, not only the job you left.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Top skills</strong> — Mirror the language
                employers use in India JDs (tools, domains, compliance where relevant).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Recent role bullets</strong> — Lead with
                outcomes; add numbers where credible.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Dates and location</strong> — Fix gaps only
                with truthful framing; see our career gaps guide.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">File + profile sync</strong> — After export or
                link publish, update the file on portals and align profile fields.
              </li>
            </ol>
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
              Deep pass:{" "}
              <Link href="/blog/resume-checklist-before-you-apply" className="text-primary-600 hover:underline dark:text-primary-400">
                Resume checklist before you apply
              </Link>{" "}
              ·{" "}
              <Link href="/blog/ats-friendly-resume-complete-guide" className="text-primary-600 hover:underline dark:text-primary-400">
                ATS-friendly resume guide
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">India portals: what &quot;update&quot; really means</h2>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            On large boards, recruiters often filter by recency and keyword overlap. Updating your resume document
            without touching your Naukri headline or uploaded file can split your story. After you revise in
            ResumeDoctor, upload the latest file and nudge fields that feed search—headline, key skills, and last
            modified—so the portal and your attachment agree.
          </p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            More context:{" "}
            <Link href="/blog/how-to-pass-naukri-ats-2026-india" className="text-primary-600 hover:underline dark:text-primary-400">
              Naukri / ATS field walkthrough (2026)
            </Link>
            .
          </p>
        </section>

        <section className="border-t border-slate-200/80 bg-gradient-to-b from-primary-50/50 to-slate-50 py-14 dark:border-slate-800 dark:from-primary-950/20 dark:to-slate-950 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Share once, edit anytime</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              After you update your resume in the builder, a published{" "}
              <Link href="/resume-link" className="font-semibold text-primary-700 hover:underline dark:text-primary-400">
                resume link
              </Link>{" "}
              keeps the same URL—useful when you have already sent it on WhatsApp, email, or LinkedIn.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/try"
                className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-primary-700"
              >
                Update in the builder
              </Link>
              <Link
                href="/resume-link"
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-800 transition hover:border-primary-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                Learn about resume links
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Longer guide</h2>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            For a step-by-step editorial pass—priorities, examples, and portal habits—read our companion article:{" "}
            <Link href="/blog/how-to-update-resume-india-2026" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              How to update your resume for a 2026 India job search
            </Link>
            .
          </p>
        </section>

        <section className="border-t border-slate-200/80 bg-white py-14 dark:border-slate-800 dark:bg-slate-900/40 sm:py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Questions</h2>
            <dl className="mt-8 space-y-8">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="font-bold text-slate-900 dark:text-slate-100">{f.q}</dt>
                  <dd className="mt-2 text-slate-700 dark:text-slate-300">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
}
