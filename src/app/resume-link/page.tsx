// Phase 2 — Dedicated SEO landing page for the share-link feature.
// Targets queries like "online resume link", "share my resume online",
// "resume url India", "live resume", "shareable resume URL".
//
// Marketing-only page; converts via /try. The hero, walkthrough, and FAQ
// re-use the same vocabulary as the homepage resume-link section and /resume-link
// section so the brand language stays consistent across surfaces.
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ResumeLinkCta } from "@/components/resume-link/resume-link-cta";
import { ResumeLinkUrlTiers } from "@/components/resume-link/resume-link-url-tiers";
import { ResumeLinkPageJsonLd } from "@/components/seo/resume-link-json-ld";
import { siteUrl } from "@/lib/seo";
import { FREE_LINK_SLUG_EXAMPLE } from "@/lib/resume-link-utils";
import {
  RESUME_LINK_AEO_DEFINITION,
  RESUME_LINK_CANONICAL,
  RESUME_LINK_FAQS,
  RESUME_LINK_METADATA,
  RESUME_LINK_VS_PDF_ROWS,
} from "@/lib/resume-link-seo-data";

// ─── Inline icons ──────────────────────────────────────────────────────────────

function Icon({
  path,
  size = 24,
  className = "",
}: {
  path: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

const PATHS = {
  link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  copy: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
  check: "M5 13l4 4L19 7",
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
  refresh:
    "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  device:
    "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  sparkle:
    "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResumeLinkPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ResumeLinkPageJsonLd
        pageUrl={RESUME_LINK_CANONICAL}
        pageName={RESUME_LINK_METADATA.title}
        pageDescription={RESUME_LINK_METADATA.description}
        breadcrumbs={[
          { name: "Home", url: siteUrl },
          { name: "Resume link", url: RESUME_LINK_CANONICAL },
        ]}
      />
      <SiteHeader variant="home" />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex flex-col outline-none"
      >
        <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <li><Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-medium text-slate-700 dark:text-slate-200">Resume link</li>
          </ol>
        </nav>
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-950">
          {/* Background grid + glows */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(255 255 255 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.6) 1px, transparent 1px)",
              backgroundSize: "3rem 3rem",
            }}
          />
          <div
            className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #06b6d4 0%, transparent 65%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full opacity-25 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #818cf8 0%, transparent 65%)",
            }}
            aria-hidden
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 shadow-lg ring-1 ring-cyan-400/20">
                <Icon path={PATHS.link} size={12} className="text-cyan-300" />
                Resume link
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
                Your resume,{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                  as a link.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                One URL for your resume. Share it on WhatsApp, LinkedIn,
                recruiter email, or a printed QR. Update once — every link
                you&apos;ve ever shared stays current.
              </p>

              {/* URL pill mock */}
              <div className="mt-10 flex justify-center">
                <div className="flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-slate-900/70 backdrop-blur-md px-4 py-3 shadow-2xl ring-1 ring-cyan-400/10">
                  <Icon
                    path={PATHS.shield}
                    size={14}
                    className="text-emerald-400"
                  />
                  <span className="font-mono text-sm sm:text-base text-white/90">
                    resumedoctor.in/r/
                    <span className="text-cyan-300 font-bold">{FREE_LINK_SLUG_EXAMPLE}</span>
                  </span>
                  <Link
                    href="/r/demo"
                    className="ml-2 flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/25 transition-colors"
                  >
                    See live demo →
                  </Link>
                </div>
              </div>

              <div className="mt-8 max-w-lg mx-auto text-left">
                <ResumeLinkUrlTiers variant="dark" />
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <ResumeLinkCta variant="accentDark" />
                <Link
                  href="/r/demo"
                  className="rounded-xl border-2 border-white/30 bg-white/5 hover:bg-white/15 px-8 py-4 text-base font-semibold text-white text-center transition-all backdrop-blur-sm"
                >
                  See live demo
                </Link>
              </div>
              <p className="mt-5 text-sm text-white/60">
                Free to publish. Update anytime — your link stays the same.
              </p>
            </div>
          </div>
        </section>

        {/* ── AEO DEFINITION (citable by AI answer engines) ─────────────── */}
        <section
          id="resume-link-definition"
          className="py-14 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              What is a resume link?
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {RESUME_LINK_AEO_DEFINITION}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              On ResumeDoctor, publishing a resume link is <strong>free</strong>. You get an auto-generated URL like{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                resumedoctor.in/r/{FREE_LINK_SLUG_EXAMPLE}
              </code>
              . Optional <Link href="/pricing#pro-link" className="text-primary-600 hover:underline dark:text-primary-400">Pro Link</Link> adds a custom slug, view analytics, and a footer-free public page.
            </p>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Three steps. Your resume on the web.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
              {/* Connector */}
              <div
                className="hidden md:block absolute top-7 left-[12%] right-[12%] h-[2px] rounded-full bg-gradient-to-r from-cyan-200/90 via-indigo-200/90 to-emerald-200/90 dark:from-cyan-800/60 dark:via-indigo-800/60 dark:to-emerald-800/60"
                aria-hidden
              />

              {STEPS.map((s) => (
                <div
                  key={s.step}
                  className="relative flex flex-col items-center text-center rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-6 shadow-[0_8px_30px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:ring-slate-800"
                >
                  <div
                    className={`relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.colorBg} ring-4 ring-white shadow-lg ${s.glow} dark:ring-slate-900`}
                  >
                    <Icon path={s.icon} size={26} className="text-white" />
                  </div>
                  <p
                    className={`mt-3 text-[11px] font-extrabold tracking-[0.2em] ${s.accent}`}
                  >
                    {s.step}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── USE CASES ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">
                Use it everywhere
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                One link. Every channel.
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                Recruiters in India don&apos;t open PDF attachments on
                mobile. They tap links. Make it easy for them.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {USE_CASES.map((u) => (
                <div
                  key={u.label}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800 dark:hover:border-primary-700"
                >
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-white text-sm font-bold shadow-md ${u.bg}`}>
                    {u.badge}
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900 dark:text-slate-100">
                    {u.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {u.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS STRIP ────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">
                Why a link
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Why a link beats sending a PDF
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-md">
                    <Icon path={b.icon} size={18} />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pro Link upsell band ───────────────────────────────────── */}
            <div className="mt-16 rounded-3xl border-2 border-primary-200/80 bg-gradient-to-br from-primary-50/90 via-white to-cyan-50/40 p-6 sm:p-8 dark:border-primary-800/60 dark:from-primary-950/30 dark:via-slate-900/50 dark:to-cyan-950/20">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div>
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-800 dark:bg-primary-900/40 dark:text-primary-200">
                    Pro Link
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Make the link your own
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-700 dark:text-slate-300">
                    Pro Link upgrades your shareable URL with a custom address, view analytics, and a clean public page.
                  </p>
                </div>
                <p className="text-right text-xs text-slate-500 dark:text-slate-400">
                  Free with Pro annual ·{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    ₹99/mo standalone
                  </span>
                </p>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <li className="rounded-xl border border-primary-200/60 bg-white/80 p-3 text-sm dark:border-primary-800/40 dark:bg-slate-900/60">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Custom URL</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    /r/your-name instead of /r/abc123xyz. Lives on your business card and email signature.
                  </p>
                </li>
                <li className="rounded-xl border border-primary-200/60 bg-white/80 p-3 text-sm dark:border-primary-800/40 dark:bg-slate-900/60">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">View analytics</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    Total opens and last-viewed time, so you know when a recruiter is reading.
                  </p>
                </li>
                <li className="rounded-xl border border-primary-200/60 bg-white/80 p-3 text-sm dark:border-primary-800/40 dark:bg-slate-900/60">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">No ResumeDoctor footer</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    A clean public page — your name, your URL, no co-branding.
                  </p>
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/pricing#pro-link"
                  className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 shadow-md shadow-primary-900/10"
                >
                  See Pro Link plans
                </Link>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Publishing a basic link is still free — Pro Link is just the upgrades.
                </p>
              </div>
            </div>

            {/* ── Link vs PDF comparison (AEO table) ─────────────────────── */}
            <div id="resume-link-vs-pdf" className="mt-16">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
                Resume link vs PDF — when to use each
              </h3>
              <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Indian recruiters on WhatsApp prefer links. Job portals often still want a file upload — use both.
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <table className="w-full min-w-[480px] text-sm text-left">
                  <caption className="sr-only">
                    Comparison of shareable resume links versus PDF attachments for job seekers in India
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Aspect</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Resume link</th>
                      <th scope="col" className="px-4 py-3 font-semibold">PDF attachment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                    {RESUME_LINK_VS_PDF_ROWS.map((row) => (
                      <tr key={row.aspect}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.aspect}</th>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.link}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.pdf}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section id="resume-link-faq" className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">
                Questions
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Resume link FAQ
              </h2>
            </div>

            <div className="space-y-4">
              {RESUME_LINK_FAQS.map((f, i) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-800/60"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-slate-900 dark:text-slate-100">
                    <span className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-xs font-bold">
                        {i + 1}
                      </span>
                      {f.q}
                    </span>
                    <span className="text-primary-500 transition-transform group-open:rotate-45 text-2xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 pl-10 text-sm leading-relaxed text-slate-600 dark:text-slate-400 border-l-2 border-primary-100 dark:border-primary-900/50 ml-1">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING CTA ───────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900 py-24">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 50%, #fbbf24 0%, transparent 60%)",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:3rem_3rem]" aria-hidden />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Get your resume link.
            </h2>
            <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              Build, publish, share. One URL for every recruiter, every
              channel — always up to date.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:items-center">
              <ResumeLinkCta variant="accentDark" />
              <Link
                href="/r/demo"
                className="rounded-xl border-2 border-white/40 bg-white/10 hover:bg-white/20 px-8 py-4 text-base font-semibold text-white text-center transition-all backdrop-blur-sm"
              >
                See live demo
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/55">
              No credit card · Email verification for the quick try
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    step: "01",
    title: "Build your resume",
    body: "Pick a template, fill it with AI-assisted bullets. ~5 minutes to a polished draft.",
    icon: PATHS.sparkle,
    colorBg: "from-primary-500 to-blue-600",
    glow: "shadow-primary-500/40",
    accent: "text-primary-600 dark:text-primary-400",
  },
  {
    step: "02",
    title: "Publish your link",
    body: `One click. We generate resumedoctor.in/r/${FREE_LINK_SLUG_EXAMPLE} and copy it to your clipboard.`,
    icon: PATHS.link,
    colorBg: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/40",
    accent: "text-cyan-600 dark:text-cyan-400",
  },
  {
    step: "03",
    title: "Share & update",
    body: "Paste anywhere. Edit your resume later — every shared link reflects the latest version automatically.",
    icon: PATHS.refresh,
    colorBg: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/40",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
];

const USE_CASES = [
  {
    label: "WhatsApp",
    body: "Tap-to-open on every recruiter's phone. No PDF download dance.",
    badge: "W",
    bg: "bg-emerald-500",
  },
  {
    label: "LinkedIn DM",
    body: "Drop the link in a follow-up message. Zero friction for the hiring manager.",
    badge: "in",
    bg: "bg-blue-600",
  },
  {
    label: "Email signature",
    body: "Add it under your name. Every email becomes a soft pitch for your resume.",
    badge: "@",
    bg: "bg-slate-700",
  },
  {
    label: "QR on a card",
    body: "Print on a business card or share at networking events, college fairs, expos.",
    badge: "QR",
    bg: "bg-fuchsia-600",
  },
];

const BENEFITS = [
  {
    title: "Always the latest version",
    body: "Edit your resume once and every link you've ever shared reflects the change. No re-sending.",
    icon: PATHS.refresh,
  },
  {
    title: "Opens in one tap on mobile",
    body: "Mobile-first preview. No download, no app, no zoom-and-pinch.",
    icon: PATHS.device,
  },
  {
    title: "One URL forever",
    body: "Bookmark-friendly. Goodbye to resume-final-FINAL-v2-revised.pdf.",
    icon: PATHS.link,
  },
  {
    title: "Recruiter-friendly",
    body: "Recruiters skim links way more than attachments. A clean URL beats a 250 KB PDF every time.",
    icon: PATHS.shield,
  },
];

