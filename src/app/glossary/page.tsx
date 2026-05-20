import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { GLOSSARY_TERMS } from "@/lib/glossary-data";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Resume & Job Search Glossary | ResumeDoctor",
  description:
    "Definitions for ATS, resume link, OTP Try, Pro, JD match, and India hiring terms—plain language from ResumeDoctor.",
  alternates: { canonical: `${siteUrl}/glossary` },
};

export default function GlossaryPage() {
  const sorted = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Glossary", url: `${siteUrl}/glossary` },
        ]}
      />
      <SiteHeader variant="home" />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="bg-gradient-to-br from-primary-700 to-indigo-900 py-14">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Glossary</h1>
            <p className="mt-3 text-white/85">Resume and India job-search terms we use on ResumeDoctor.</p>
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <dl className="space-y-6">
            {sorted.map((item) => (
              <div key={item.term} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <dt className="font-bold text-slate-900 dark:text-white">{item.term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.definition}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-center text-sm text-slate-500">
            <Link href="/guides" className="text-primary-600 hover:underline dark:text-primary-400">
              Read guides
            </Link>
            {" · "}
            <Link href="/faq" className="text-primary-600 hover:underline dark:text-primary-400">
              FAQ
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
