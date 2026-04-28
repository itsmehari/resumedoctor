import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/seo";
import { getExampleBySlug, getExampleSlugs, getAllExamples } from "@/lib/examples";
import { getRelatedPostsForExample } from "@/lib/content-links";
import { BreadcrumbJsonLd, ExampleHowToJsonLd } from "@/components/seo/json-ld";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getExampleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ex = getExampleBySlug(params.slug);
  if (!ex) return {};
  return {
    title: `${ex.title} | ResumeDoctor`,
    description: ex.description,
    alternates: { canonical: `${siteUrl}/examples/${ex.slug}` },
    openGraph: {
      title: ex.title,
      description: ex.description,
      url: `${siteUrl}/examples/${ex.slug}`,
    },
  };
}

const INDUSTRY_COLORS: Record<string, string> = {
  "IT / Tech":    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Analytics":    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "Marketing":    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  "BPO / Services": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "Finance":      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Education":    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Sales":        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "All":          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

function IndustryBadge({ industry }: { industry: string }) {
  const cls = INDUSTRY_COLORS[industry] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${cls}`}>
      {industry}
    </span>
  );
}

const SECTION_SUGGESTIONS: Record<string, string[]> = {
  "software-engineer-resume":   ["Summary", "Skills", "Experience", "Projects", "Education", "Certifications"],
  "fresher-resume-example":     ["Objective", "Education", "Skills", "Projects", "Certifications", "Interests"],
  "data-analyst-resume":        ["Summary", "Skills", "Experience", "Projects", "Education", "Certifications"],
  "marketing-manager-resume":   ["Summary", "Experience", "Skills", "Awards", "Education"],
  "bpo-customer-service-resume":["Summary", "Experience", "Skills", "Education", "Languages"],
  "accountant-resume-example":  ["Summary", "Experience", "Education", "Skills", "Certifications"],
  "teacher-educator-resume":    ["Summary", "Experience", "Education", "Skills", "Volunteer", "Awards"],
  "sales-executive-resume":     ["Summary", "Experience", "Skills", "Awards", "Education"],
  "hr-manager-resume":          ["Summary", "Experience", "Skills", "Education", "Certifications", "Awards"],
  "product-manager-resume":     ["Summary", "Experience", "Projects", "Skills", "Education", "Certifications"],
};

export default function ExampleDetailPage({ params }: Props) {
  const ex = getExampleBySlug(params.slug);
  if (!ex) notFound();

  const allExamples = getAllExamples();
  const currentIndex = allExamples.findIndex((e) => e.slug === params.slug);
  const prevEx = currentIndex > 0 ? allExamples[currentIndex - 1] : null;
  const nextEx = currentIndex < allExamples.length - 1 ? allExamples[currentIndex + 1] : null;

  const suggestedSections = SECTION_SUGGESTIONS[ex.slug] ?? ["Summary", "Experience", "Education", "Skills"];
  const relatedPosts = getRelatedPostsForExample(params.slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] dark:bg-slate-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Resume Examples", url: `${siteUrl}/examples` },
          { name: ex.title, url: `${siteUrl}/examples/${ex.slug}` },
        ]}
      />
      <ExampleHowToJsonLd
        title={ex.title}
        description={ex.description}
        slug={ex.slug}
        steps={ex.tips}
      />
      <SiteHeader variant="home" maxWidth="6xl" />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/examples" className="hover:text-primary-600">Resume Examples</Link>
          <span>›</span>
          <span>{ex.title}</span>
        </div>

        {/* Hero */}
        <div className="flex items-start gap-4 mb-10">
          <div>
            <IndustryBadge industry={ex.industry} />
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
              {ex.title}
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {ex.description}
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left — tips + sections */}
          <div className="md:col-span-2 space-y-8">

            {/* Expert tips */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Expert tips for {ex.role} resumes
                </h2>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {ex.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-4 px-6 py-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Recommended sections */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recommended resume sections
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sections that work best for a {ex.role} resume
                </p>
              </div>
              <div className="px-6 py-5 flex flex-wrap gap-2">
                {suggestedSections.map((s) => (
                  <span key={s}
                    className="inline-flex items-center gap-1.5 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                    {s}
                  </span>
                ))}
              </div>
            </section>

            {/* ATS keyword tips */}
            <section className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-200 dark:border-amber-800">
                <h2 className="text-base font-bold text-amber-900 dark:text-amber-200">
                  ATS keyword tips
                </h2>
              </div>
              <div className="px-6 py-4 space-y-2">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Indian job boards (Naukri, LinkedIn, Indeed IN) use keyword matching. Include the exact job title and key skills from the JD.
                </p>
                <ul className="text-sm text-amber-800 dark:text-amber-300 list-disc list-inside space-y-1 mt-2">
                  <li>Mirror the job title in your headline/summary</li>
                  <li>Use industry-standard tool/technology names (not abbreviations only)</li>
                  <li>Quantify impact wherever possible — numbers beat adjectives every time</li>
                  <li>Keep formatting clean — no tables, text boxes, or columns in your PDF</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Right sidebar — CTA + related */}
          <div className="space-y-6">
            {/* Build CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-center shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-base mb-1">Build your {ex.role} resume</h3>
              <p className="text-white/75 text-xs mb-4 leading-relaxed">
                Start with Try using our ATS-ready templates. Takes under 5 minutes.
              </p>
              <Link href="/try"
                className="block w-full rounded-xl bg-white hover:bg-slate-50 text-primary-700 font-bold text-sm py-2.5 transition-colors shadow">
                Start with Try →
              </Link>
              <p className="text-white/50 text-xs mt-2">No sign up required to preview</p>
            </div>

            {/* Related blog posts */}
            {relatedPosts.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Related blog posts</h3>
                </div>
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {relatedPosts.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`}
                        className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">{p.title}</p>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/blog"
                      className="block px-4 py-3 text-sm text-primary-600 hover:underline font-medium">
                      All articles →
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Other examples */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">More examples</h3>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {allExamples
                  .filter((e) => e.slug !== params.slug)
                  .slice(0, 5)
                  .map((e) => (
                    <li key={e.slug}>
                      <Link href={`/examples/${e.slug}`}
                        className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{e.industry}</p>
                        <p className="text-sm text-slate-900 dark:text-slate-100 font-medium mt-0.5">{e.title}</p>
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link href="/examples"
                    className="block px-4 py-3 text-sm text-primary-600 hover:underline font-medium">
                    View all examples →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Templates CTA */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Browse 30+ professional templates designed for the Indian job market
              </p>
              <Link href="/templates"
                className="inline-block text-sm font-semibold text-primary-600 hover:underline">
                See all templates →
              </Link>
            </div>
          </div>
        </div>

        {/* Article navigation */}
        <nav className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-4 flex-wrap">
          {prevEx ? (
            <Link href={`/examples/${prevEx.slug}`}
              className="text-sm text-primary-600 hover:underline">
              ← {prevEx.title}
            </Link>
          ) : <span />}
          {nextEx ? (
            <Link href={`/examples/${nextEx.slug}`}
              className="text-sm text-primary-600 hover:underline">
              {nextEx.title} →
            </Link>
          ) : <span />}
        </nav>
      </main>
    </div>
  );
}
