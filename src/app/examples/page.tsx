import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getExamplesSortedByTier, type ResumeExample } from "@/lib/examples";
import { getAllPosts } from "@/lib/blog";
import { SiteHeader } from "@/components/site-header";
import { ExamplesItemListJsonLd } from "@/components/seo/json-ld";
import { ArrowUpRight, Check, Layers, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume Examples by Role – India",
  description:
    "Resume examples for Software Engineer, Fresher, Data Analyst, Marketing, BPO, and more. Each guide includes sample lines, India hiring context, AI-era advice, tools by career stage, role-specific keywords recruiters look for, and mistakes to avoid.",
  alternates: { canonical: `${siteUrl}/examples` },
};

function exampleMatchesIndustry(ex: ResumeExample, filter: string): boolean {
  if (!filter) return true;
  if (ex.industry === "All") return true;
  return ex.industry === filter;
}

function sampleExcerpt(summary: string, maxLen = 160): string | null {
  const t = summary.trim();
  if (!t) return null;
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function ExampleCard({
  ex,
  badge,
}: {
  ex: { slug: string; title: string; description: string; industry: string; sampleSummary?: string };
  badge?: string;
}) {
  const preview = ex.sampleSummary ? sampleExcerpt(ex.sampleSummary) : null;
  return (
    <li>
      <Link
        href={`/examples/${ex.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-800/40 sm:p-7"
      >
        {badge ? (
          <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
            <Sparkles className="h-3 w-3" aria-hidden />
            {badge}
          </span>
        ) : null}
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          {ex.industry}
        </span>
        <h2 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-emerald-800 dark:text-slate-50 dark:group-hover:text-emerald-300">
          {ex.title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{ex.description}</p>
        {preview ? (
          <p className="mt-3 border-l-2 border-emerald-400/70 pl-3 text-xs leading-relaxed text-slate-600 dark:border-emerald-600/50 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Sample line: </span>
            {preview}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Includes AI-era note &amp; tools by career stage
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
          Read full guide
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      </Link>
    </li>
  );
}

type ExamplesPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ExamplesIndexPage({ searchParams }: ExamplesPageProps) {
  const examples = getExamplesSortedByTier();
  const industries = Array.from(new Set(examples.map((e) => e.industry))).sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });

  const requested =
    typeof searchParams?.industry === "string" ? searchParams.industry.trim() : "";
  const industryFilter =
    requested && industries.includes(requested) ? requested : "";

  const filtered = examples.filter((e) => exampleMatchesIndustry(e, industryFilter));
  const featured = filtered.filter((e) => e.priorityTier === "A");
  const more = filtered.filter((e) => e.priorityTier !== "A");
  const recentPosts = getAllPosts().slice(0, 4);

  const pillBase =
    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";
  const pillInactive =
    "border-slate-200 bg-white text-slate-700 hover:border-emerald-300/70 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-800";
  const pillActive =
    "border-primary-600 bg-primary-50 text-primary-900 dark:border-primary-500 dark:bg-primary-950/50 dark:text-primary-100";

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7] dark:bg-slate-950">
      <ExamplesItemListJsonLd
        examples={filtered.map((e) => ({ slug: e.slug, title: e.title, description: e.description }))}
      />
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
          <div
            className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-600/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary-400/15 blur-3xl dark:bg-primary-600/10"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <Layers className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
              Role-specific guides for India
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              Resume examples{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-primary-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-primary-400">
                by role
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Sample lines, section order, role-specific keywords, and mistakes to avoid — then open the builder to
              make your own version and publish it as a link.
            </p>
            <p className="mt-4 max-w-2xl text-sm font-medium text-slate-700 dark:text-slate-300">
              Every role guide includes the same depth: India hiring context,{" "}
              <span className="text-slate-900 dark:text-slate-100">AI era &amp; tools by career stage</span> (early →
              mid → senior), expert tips, common mistakes, and role-specific ATS keywords recruiters search for.
            </p>
            <ul
              className="mt-5 grid max-w-2xl gap-2 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2"
              aria-label="Contents of each resume example guide"
            >
              {[
                "Sample resume lines",
                "India hiring context",
                "AI-era note & tools by stage",
                "Expert tips & mistakes to avoid",
                "ATS keywords & checklist",
                "Related blog links",
              ].map((label) => (
                <li key={label} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/try"
                aria-label="Open the resume builder — free preview, no sign-up required"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Open resume builder
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl border-b border-slate-200/80 px-4 pb-10 pt-2 dark:border-slate-800 sm:px-6 lg:px-8"
          aria-label="Filter resume examples by industry"
        >
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Browse by industry</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            <li>
              <Link
                href="/examples"
                className={`${pillBase} ${!industryFilter ? pillActive : pillInactive}`}
                aria-current={!industryFilter ? "page" : undefined}
              >
                All industries
              </Link>
            </li>
            {industries.map((ind) => (
              <li key={ind}>
                <Link
                  href={`/examples?industry=${encodeURIComponent(ind)}`}
                  className={`${pillBase} ${industryFilter === ind ? pillActive : pillInactive}`}
                  aria-current={industryFilter === ind ? "page" : undefined}
                >
                  {ind}
                </Link>
              </li>
            ))}
          </ul>
          {industryFilter ? (
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Showing guides tagged <span className="font-semibold text-slate-700 dark:text-slate-300">{industryFilter}</span>, plus{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">All</span> (cross-cutting roles such as fresher or HR).
            </p>
          ) : null}
        </section>

        <section
          className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
          aria-label="Popular resume example guides"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Popular picks</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Highest-demand roles — full sample lines, India context, and tailored ATS keywords.
          </p>
          {featured.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              No guides in this filter. Choose another industry or{" "}
              <Link href="/examples" className="font-medium text-primary-600 underline dark:text-primary-400">
                view all
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {featured.map((ex) => (
                <ExampleCard key={ex.slug} ex={ex} badge="Popular pick" />
              ))}
            </ul>
          )}
        </section>

        <section
          className="mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-14 dark:border-slate-800 sm:px-6 lg:px-8"
          aria-label="More resume examples"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">More roles</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Marketing, sales, HR, BPO, finance, and teaching — same structure, role-specific content.
          </p>
          {more.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              No additional guides in this filter.
            </p>
          ) : (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {more.map((ex) => (
                <ExampleCard key={ex.slug} ex={ex} />
              ))}
            </ul>
          )}
        </section>

        <section className="border-t border-slate-200/80 bg-white/70 py-14 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">From our blog</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600 dark:text-slate-400">
              Deep dives on ATS, formats, and interviews — written to pair with these guides.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl border border-slate-200/90 bg-[#faf9f7] p-5 transition hover:border-primary-300/60 hover:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-primary-700/50 dark:hover:bg-slate-900"
                  >
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{post.title}</span>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{post.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                All articles
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </p>
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 px-4 py-12 text-sm sm:px-6 lg:px-8">
          <Link href="/templates" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Templates
          </Link>
          <Link href="/pricing" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Pricing — export PDF & Word
          </Link>
          <Link href="/blog" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
            Blog
          </Link>
          <Link href="/" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
