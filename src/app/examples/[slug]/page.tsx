import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/seo";
import { getExampleBySlug, getExampleSlugs, getExamplesSortedByTier } from "@/lib/examples";
import { getRelatedPostsForExample } from "@/lib/content-links";
import { BreadcrumbJsonLd, ExampleHowToJsonLd } from "@/components/seo/json-ld";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getExampleSlugs().map((slug) => ({ slug }));
}

const META_SUFFIX =
  " Includes India hiring context, AI-era guidance, and concrete tools to list by career stage (early, mid, senior).";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ex = getExampleBySlug(params.slug);
  if (!ex) return {};
  const description = `${ex.description}${META_SUFFIX}`;
  return {
    title: `${ex.title} | ResumeDoctor`,
    description,
    alternates: { canonical: `${siteUrl}/examples/${ex.slug}` },
    openGraph: {
      title: ex.title,
      description,
      url: `${siteUrl}/examples/${ex.slug}`,
    },
  };
}

const INDUSTRY_COLORS: Record<string, string> = {
  "IT / Tech": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Analytics: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Marketing: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  "BPO / Services": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Education: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  Sales: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  All: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

function IndustryBadge({ industry }: { industry: string }) {
  const cls =
    INDUSTRY_COLORS[industry] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {industry}
    </span>
  );
}

export default function ExampleDetailPage({ params }: Props) {
  const ex = getExampleBySlug(params.slug);
  if (!ex) notFound();

  const allExamples = getExamplesSortedByTier();
  const currentIndex = allExamples.findIndex((e) => e.slug === params.slug);
  const prevEx = currentIndex > 0 ? allExamples[currentIndex - 1] : null;
  const nextEx = currentIndex < allExamples.length - 1 ? allExamples[currentIndex + 1] : null;

  const relatedPosts = getRelatedPostsForExample(params.slug);
  const deepDivePost = relatedPosts[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7] dark:bg-slate-950">
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

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 outline-none sm:px-6"
      >
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/examples" className="hover:text-primary-600">
            Resume Examples
          </Link>
          <span>›</span>
          <span>{ex.title}</span>
        </div>

        <div className="mb-10 flex items-start gap-4">
          <div>
            <IndustryBadge industry={ex.industry} />
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              {ex.title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {ex.description}
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            {(ex.sampleSummary.trim().length > 0 || ex.sampleBullets.length > 0) ? (
              <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Sample resume lines
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Illustrative patterns only — swap in your real employers, dates, and verified metrics.
                  </p>
                </div>
                <div className="bg-white px-6 py-5 dark:bg-slate-950/40">
                  <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80">
                    <figcaption className="border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-400">
                      Example excerpt (plain text)
                    </figcaption>
                    <pre
                      className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                      tabIndex={0}
                    >
                      {[
                        ex.sampleSummary.trim(),
                        ...ex.sampleBullets.map((b) => `• ${b}`),
                      ]
                        .filter(Boolean)
                        .join("\n\n")}
                    </pre>
                  </figure>
                </div>
              </section>
            ) : null}

            {ex.indiaContext ? (
              <section
                className="rounded-2xl border border-emerald-200/90 bg-emerald-50/80 px-6 py-5 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                aria-label="India job market context"
              >
                <h2 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  India hiring context
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-100/90">
                  {ex.indiaContext}
                </p>
              </section>
            ) : null}

            {ex.seniorityNote ? (
              <section
                className="rounded-2xl border border-sky-200/90 bg-sky-50/80 px-6 py-5 dark:border-sky-900/40 dark:bg-sky-950/20"
                aria-label="Seniority guidance for this role"
              >
                <h2 className="text-sm font-bold text-sky-900 dark:text-sky-200">
                  Junior vs senior — what to emphasize
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-sky-900/90 dark:text-sky-100/90">
                  {ex.seniorityNote}
                </p>
              </section>
            ) : null}

            <section
              className="overflow-hidden rounded-2xl border border-violet-200/90 bg-violet-50/50 dark:border-violet-900/40 dark:bg-violet-950/15"
              aria-label="AI era guidance and tools to list by career stage"
            >
              <div className="border-b border-violet-200/80 bg-violet-100/60 px-6 py-4 dark:border-violet-900/50 dark:bg-violet-950/40">
                <h2 className="text-base font-bold text-violet-950 dark:text-violet-100">
                  AI era &amp; tools by career stage
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-violet-900/95 dark:text-violet-200/90">
                  {ex.aiEraNote}
                </p>
              </div>
              <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
                {(
                  [
                    { key: "earlyCareer" as const, label: "Early career", sub: "Fresher · trainee · 0–2 yrs" },
                    { key: "midLevel" as const, label: "Mid-level", sub: "~2–6 yrs" },
                    { key: "senior" as const, label: "Senior / lead", sub: "6+ yrs · ownership" },
                  ] as const
                ).map(({ key, label, sub }) => (
                  <div
                    key={key}
                    className="rounded-xl border border-violet-200/70 bg-white/90 p-4 shadow-sm dark:border-violet-900/50 dark:bg-slate-950/50"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</h3>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {sub}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {ex.toolsByLevel[key].map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-violet-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Expert tips for {ex.role} resumes
                </h2>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {ex.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-4 px-6 py-4">
                    <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recommended resume sections
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Sections that work best for a {ex.role} resume
                </p>
              </div>
              <div className="flex flex-wrap gap-2 px-6 py-5">
                {ex.suggestedSections.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                    {s}
                  </span>
                ))}
              </div>
            </section>

            {ex.mistakesToAvoid.length > 0 ? (
              <section className="overflow-hidden rounded-2xl border border-rose-200 dark:border-rose-900/50">
                <div className="border-b border-rose-200 bg-rose-50 px-6 py-4 dark:border-rose-900/40 dark:bg-rose-950/30">
                  <h2 className="text-base font-bold text-rose-900 dark:text-rose-200">
                    Common mistakes to avoid
                  </h2>
                </div>
                <ul className="divide-y divide-rose-100 dark:divide-rose-900/20">
                  {ex.mistakesToAvoid.map((m, i) => (
                    <li key={i} className="px-6 py-3 text-sm leading-relaxed text-rose-950/90 dark:text-rose-100/85">
                      {m}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {ex.atsIntro.trim().length > 0 ||
            ex.atsKeywords.length > 0 ||
            ex.atsChecklist.length > 0 ? (
              <section className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10">
                <div className="border-b border-amber-200 px-6 py-4 dark:border-amber-800">
                  <h2 className="text-base font-bold text-amber-900 dark:text-amber-200">
                    ATS keywords for {ex.role}
                  </h2>
                  <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-300/80">
                    Words and checks tuned to this role — not generic filler. Pair with our{" "}
                    {deepDivePost ? (
                      <Link
                        href={`/blog/${deepDivePost.slug}`}
                        className="font-semibold text-primary-800 underline decoration-primary-500/50 underline-offset-2 hover:text-primary-900 dark:text-primary-300"
                      >
                        {deepDivePost.title}
                      </Link>
                    ) : (
                      <Link
                        href="/blog/ats-friendly-resume-complete-guide"
                        className="font-semibold text-primary-800 underline decoration-primary-500/50 underline-offset-2 hover:text-primary-900 dark:text-primary-300"
                      >
                        ATS-friendly resume guide
                      </Link>
                    )}
                    .
                  </p>
                </div>
                <div className="space-y-4 px-6 py-4">
                  {ex.atsIntro.trim().length > 0 ? (
                    <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200/95">
                      {ex.atsIntro}
                    </p>
                  ) : null}
                  {ex.atsKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2" aria-label="Role-specific ATS keywords">
                      {ex.atsKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full border border-amber-300/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {ex.atsChecklist.length > 0 ? (
                    <ul className="list-inside list-disc space-y-1.5 text-sm text-amber-900 dark:text-amber-200/95">
                      {ex.atsChecklist.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-center shadow-lg">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-1 text-base font-bold text-white">Build your {ex.role} resume</h3>
              <p className="mb-4 text-xs leading-relaxed text-white/80">
                Open the resume builder — ATS-friendly templates and a live preview. Most people finish a first draft
                in under five minutes.
              </p>
              <Link
                href="/try"
                aria-label="Open the resume builder — free preview, no sign-up required"
                className="block w-full rounded-xl bg-white py-2.5 text-sm font-bold text-primary-700 shadow transition-colors hover:bg-slate-50"
              >
                Open resume builder (free preview)
              </Link>
              <p className="mt-2 text-xs text-white/50">No account needed to try the editor</p>
            </div>

            {relatedPosts.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Related blog posts</h3>
                </div>
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {relatedPosts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="block px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{p.title}</p>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/blog"
                      className="block px-4 py-3 text-sm font-medium text-primary-600 hover:underline"
                    >
                      All articles →
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">More examples</h3>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {allExamples
                  .filter((e) => e.slug !== params.slug)
                  .slice(0, 5)
                  .map((e) => (
                    <li key={e.slug}>
                      <Link
                        href={`/examples/${e.slug}`}
                        className="block px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <p className="text-xs font-medium text-primary-600 dark:text-primary-400">{e.industry}</p>
                        <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">{e.title}</p>
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link
                    href="/examples"
                    className="block px-4 py-3 text-sm font-medium text-primary-600 hover:underline"
                  >
                    View all examples →
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 text-center dark:border-slate-800">
              <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
                Browse 30+ professional templates designed for the Indian job market
              </p>
              <Link href="/templates" className="inline-block text-sm font-semibold text-primary-600 hover:underline">
                See all templates →
              </Link>
            </div>
          </div>
        </div>

        <nav className="mt-12 flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-800">
          {prevEx ? (
            <Link href={`/examples/${prevEx.slug}`} className="text-sm text-primary-600 hover:underline">
              ← {prevEx.title}
            </Link>
          ) : (
            <span />
          )}
          {nextEx ? (
            <Link href={`/examples/${nextEx.slug}`} className="text-sm text-primary-600 hover:underline">
              {nextEx.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </div>
  );
}
