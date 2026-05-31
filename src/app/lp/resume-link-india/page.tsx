import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { TrustBadges } from "@/components/trust-badges";
import { LpTierClarification } from "@/components/lp/lp-tier-clarification";
import { ResumeLinkCta } from "@/components/resume-link/resume-link-cta";
import { ResumeLinkUrlTiers } from "@/components/resume-link/resume-link-url-tiers";
import { ResumeLinkPageJsonLd } from "@/components/seo/resume-link-json-ld";
import { siteUrl } from "@/lib/seo";
import { FREE_LINK_SLUG_EXAMPLE } from "@/lib/resume-link-utils";
import {
  RESUME_LINK_AEO_DEFINITION,
  RESUME_LINK_INDIA_LP,
  RESUME_LINK_INDIA_LP_METADATA,
  RESUME_LINK_LP_FAQS,
  RESUME_LINK_VS_PDF_ROWS,
} from "@/lib/resume-link-seo-data";

export default function ResumeLinkIndiaLp() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <ResumeLinkPageJsonLd
        pageUrl={RESUME_LINK_INDIA_LP}
        pageName={RESUME_LINK_INDIA_LP_METADATA.title}
        pageDescription={RESUME_LINK_INDIA_LP_METADATA.description}
        breadcrumbs={[
          { name: "Home", url: siteUrl },
          { name: "Resume link India", url: RESUME_LINK_INDIA_LP },
        ]}
        faqs={RESUME_LINK_LP_FAQS}
      />
      <SiteHeader variant="home" />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-16 sm:py-20 outline-none"
      >
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <li><Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-medium text-slate-700 dark:text-slate-200">Share resume on WhatsApp India</li>
          </ol>
        </nav>

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

        <section id="resume-link-definition" className="mt-8 rounded-2xl border border-cyan-200/80 bg-cyan-50/50 p-5 dark:border-cyan-900/50 dark:bg-cyan-950/20">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">What is a resume link?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {RESUME_LINK_AEO_DEFINITION}
          </p>
        </section>

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

        <section id="resume-link-vs-pdf" className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Resume link vs PDF</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full min-w-[400px] text-xs sm:text-sm text-left">
              <caption className="sr-only">Resume link versus PDF for Indian job applications</caption>
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Aspect</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Link</th>
                  <th scope="col" className="px-3 py-2 font-semibold">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                {RESUME_LINK_VS_PDF_ROWS.slice(0, 4).map((row) => (
                  <tr key={row.aspect}>
                    <th scope="row" className="px-3 py-2 font-medium">{row.aspect}</th>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.link}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.pdf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="resume-link-faq" className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Common questions</h2>
          <div className="mt-4 space-y-3">
            {RESUME_LINK_LP_FAQS.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Example URL:{" "}
          <code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">
            resumedoctor.in/r/{FREE_LINK_SLUG_EXAMPLE}
          </code>
          {" · "}
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
