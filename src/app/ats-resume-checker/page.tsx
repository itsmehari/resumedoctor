import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { TrustBadges } from "@/components/trust-badges";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ATS Resume Checker — Job Match & Readability | ResumeDoctor India",
  description:
    "Check your resume against a job description, improve readability, and apply with confidence. ATS-aware templates and in-editor checks—India-first. Start with OTP Try.",
  alternates: { canonical: `${siteUrl}/ats-resume-checker` },
  keywords: [
    "ATS resume checker",
    "ATS resume checker India",
    "resume job description match",
    "ATS friendly resume",
  ],
  openGraph: {
    title: "ATS Resume Checker — ResumeDoctor",
    description: "Match your resume to job descriptions and fix readability before you apply.",
    url: `${siteUrl}/ats-resume-checker`,
    type: "website",
    siteName: "ResumeDoctor",
  },
};

const CHECKS = [
  {
    title: "Job description match",
    body: "Paste a JD and see keyword gaps and alignment hints so you can tailor bullets before Naukri or LinkedIn applications.",
  },
  {
    title: "Readability & structure",
    body: "Clear sections, scannable bullets, and layouts that parse well in Applicant Tracking Systems used by Indian portals.",
  },
  {
    title: "Templates built for parsing",
    body: "Start from ATS-aware templates—no decorative columns that break parsers on common ATS setups.",
  },
];

const FAQS = [
  {
    q: "Is the ATS checker free?",
    a: "You can explore the builder with OTP Try. Full job-description match and deeper checks are part of the signed-in editor; Pro unlocks the complete workflow and exports.",
  },
  {
    q: "Does this replace Naukri or LinkedIn?",
    a: "No. ResumeDoctor helps you prepare the resume you upload or share. You still apply on each portal; we help the file and link be ready.",
  },
  {
    q: "Where do I run the checker?",
    a: "Open a resume in the editor after sign-in. Marketing on this page explains the flow; the live tool runs inside your workspace.",
  },
];

export default function AtsResumeCheckerPage() {
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "ATS Resume Checker", url: `${siteUrl}/ats-resume-checker` },
        ]}
      />
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-primary-900 py-16 sm:py-24">
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300/90">India-first</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              ATS resume checker &amp; job match
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              ResumeDoctor combines ATS-friendly templates with in-editor checks—tailor to a job description,
              fix readability, then export or share your live resume link.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/try"
                className="rounded-xl bg-accent px-8 py-4 text-base font-bold text-accent-dark shadow-lg hover:bg-accent-hover"
              >
                Start OTP Try
              </Link>
              <Link
                href="/features#capabilities"
                className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white hover:bg-white/20"
              >
                See all features
              </Link>
            </div>
            <div className="mt-8 flex justify-center">
              <TrustBadges variant="onDark" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {CHECKS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-primary-200 bg-primary-50/80 p-8 dark:border-primary-800 dark:bg-primary-950/40">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">How to use it</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Start at /try or sign in and create a resume from a template.</li>
              <li>Open the editor and add your experience and skills.</li>
              <li>Paste a job description to run match feedback (Pro/trial rules apply in product).</li>
              <li>Export PDF/DOCX on Pro or share your resume link when ready.</li>
            </ol>
            <Link
              href="/guides"
              className="mt-6 inline-block text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              Browse resume guides →
            </Link>
          </div>

          <h2 className="mt-14 text-2xl font-bold text-slate-900 dark:text-white">FAQ</h2>
          <dl className="mt-6 space-y-6">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-slate-900 dark:text-white">{f.q}</dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-400">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <Footer />
    </div>
  );
}
