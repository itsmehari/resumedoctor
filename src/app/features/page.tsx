import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { FeaturesJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { EmailMatchNote, PricingTrustStatsBar } from "@/components/pricing/payment-value-sections";
import { JOURNEY_STEPS, PILLAR_ITEMS } from "@/components/features/features-data";
import { FeaturesPageAnalytics } from "@/components/features/features-analytics";
import { FeaturesCapabilityExplorer } from "@/components/features/features-capability-explorer";
import { FeaturesFaq } from "@/components/features/features-faq";
import { FeaturesStickyCta } from "@/components/features/features-sticky-cta";
import { FeaturesSectionNav } from "@/components/features/features-section-nav";
import { TrackedFeaturesLink } from "@/components/features/features-tracked-link";

export const metadata: Metadata = {
  title: "Features — ResumeDoctor",
  description:
    "Create your resume, share it as one always-updated link for WhatsApp and LinkedIn, and apply on Indian portals with confidence. Templates, AI writing help, job-description match, readability checks, and PDF or Word when you upgrade on SuperProfile. Try with OTP — no card.",
  alternates: { canonical: `${siteUrl}/features` },
  openGraph: {
    title: "Features — ResumeDoctor",
    description:
      "One workflow from blank page to shareable link: templates, AI help, JD match, checks, and exports. India-first. Try with OTP.",
    url: `${siteUrl}/features`,
    type: "website",
    siteName: "ResumeDoctor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features — ResumeDoctor",
    description:
      "Create, update, and share your resume as a link — plus exports when you need them. Built for India.",
  },
};

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <FeaturesPageAnalytics />
      <FeaturesJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Features", url: `${siteUrl}/features` },
        ]}
      />

      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none pb-24 lg:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900">
          <div
            className="absolute top-0 right-0 size-[480px] rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }}
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 size-[360px] rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }}
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">Product tour</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Everything you need for an India-first job search — in one place.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              Build in the browser, share as a link that always stays current, tighten bullets with help when you want
              it, then export PDF or Word when your plan allows. Upgrade on SuperProfile with the{" "}
              <strong className="font-semibold text-white">same email</strong> as your ResumeDoctor account.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <TrackedFeaturesLink
                href="/try"
                event="features_cta_try"
                className="inline-flex justify-center rounded-xl bg-amber-400 px-8 py-4 text-base font-bold text-amber-950 shadow-lg shadow-black/25 transition hover:bg-amber-300 sm:min-w-[14rem]"
              >
                Build my resume — Try
              </TrackedFeaturesLink>
              <TrackedFeaturesLink
                href="/pricing"
                event="features_cta_pricing"
                className="inline-flex justify-center rounded-xl border-2 border-white/35 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:min-w-[11rem]"
              >
                See pricing
              </TrackedFeaturesLink>
              <Link
                href="/signup"
                className="inline-flex justify-center rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white/95 hover:bg-white/10"
              >
                Create free account
              </Link>
            </div>

            <p className="mt-4 text-sm text-white/65">Try uses OTP · No credit card</p>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
              <TrackedFeaturesLink href="/templates" event="features_deep_link" className="underline-offset-2 hover:underline">
                Templates
              </TrackedFeaturesLink>
              <span className="hidden sm:inline" aria-hidden>
                ·
              </span>
              <TrackedFeaturesLink href="/examples" event="features_deep_link" className="underline-offset-2 hover:underline">
                Examples
              </TrackedFeaturesLink>
              <span className="hidden sm:inline" aria-hidden>
                ·
              </span>
              <TrackedFeaturesLink href="/resume-link" event="features_deep_link" className="underline-offset-2 hover:underline">
                Resume link
              </TrackedFeaturesLink>
              <span className="hidden sm:inline" aria-hidden>
                ·
              </span>
              <TrackedFeaturesLink href="/login" event="features_deep_link" className="underline-offset-2 hover:underline">
                Sign in
              </TrackedFeaturesLink>
              <span className="hidden sm:inline" aria-hidden>
                ·
              </span>
              <Link href="/dashboard" className="underline-offset-2 hover:underline">
                Dashboard
              </Link>
            </div>
          </div>
        </section>

        <FeaturesSectionNav />

        {/* Pillars */}
        <section id="pillars" className="scroll-mt-28 border-b border-slate-200/80 bg-white py-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Outcomes
            </h2>
            <p className="mt-2 max-w-2xl text-lg font-semibold text-slate-900 dark:text-slate-100">
              Create, keep current, manage variants, share one link.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {PILLAR_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-950/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    <IconCheck className="text-emerald-600 dark:text-emerald-400" />
                  </span>
                  <span className="pt-1 text-sm font-medium leading-snug text-slate-800 dark:text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Journey */}
        <section id="journey" className="scroll-mt-28 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              How it fits together
            </h2>
            <p className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              From template to application-ready file
            </p>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {JOURNEY_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Step {index + 1}
                  </span>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
                  <Link
                    href={step.href}
                    className="mt-4 inline-block text-sm font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
                  >
                    {step.linkLabel} →
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Capabilities + explorer */}
        <section id="capabilities" className="scroll-mt-28 border-y border-slate-200/90 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Explore by goal
            </h2>
            <p className="mt-2 max-w-3xl text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Features that map to how you actually apply
            </p>
            <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-400">
              Use the tabs to reorder the same capabilities — whether you need to share quickly, attach files to portals,
              tailor to a job description, or start out as a fresher.
            </p>
            <div className="mt-12">
              <FeaturesCapabilityExplorer />
            </div>
          </div>
        </section>

        {/* Resume link spotlight */}
        <section
          id="resume-link-spotlight"
          className="scroll-mt-28 bg-gradient-to-br from-slate-100 via-white to-primary-50/60 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-primary-950/30"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                  Central differentiator
                </h2>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Your resume as a link — always up to date
                </p>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  One URL for WhatsApp, LinkedIn DMs, email signatures, or a QR on a card. Edit anytime; everyone with the
                  link sees the latest version — no more “resume-final-v3.pdf”.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <TrackedFeaturesLink
                    href="/resume-link"
                    event="features_deep_link"
                    className="rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
                  >
                    How the resume link works
                  </TrackedFeaturesLink>
                  <TrackedFeaturesLink
                    href="/try"
                    event="features_cta_try"
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-primary-400 dark:border-slate-600 dark:text-slate-100"
                  >
                    Start Try
                  </TrackedFeaturesLink>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Public URL example</p>
                <p className="mt-3 break-all font-mono text-sm text-primary-700 dark:text-primary-300">
                  resumedoctor.in/r/<span className="text-slate-600 dark:text-slate-400">your-name</span>
                </p>
                <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
                  Share anywhere recruiters already look — your updates sync automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ATS support band — supporting, not leading */}
        <section id="ats-support" className="scroll-mt-28 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 px-6 py-8 dark:border-slate-700 dark:bg-slate-900/50 sm:px-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Readability and ATS-style checks</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                When you are ready to attach a file to a portal, it helps to know your sections and keywords line up with
                common parsers. We surface checks and scores where your plan allows — without replacing your judgment on
                what to send. Compare what&apos;s included on{" "}
                <Link href="/pricing" className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400">
                  pricing
                </Link>{" "}
                or read our{" "}
                <Link
                  href="/blog/ats-friendly-resume-complete-guide"
                  className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
                >
                  ATS-friendly resume guide
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Pricing bridge */}
        <section id="pricing-bridge" className="scroll-mt-28 border-t border-slate-200/90 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/25">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Plans
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Start free. Upgrade when you export.
            </p>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-950/40">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Try &amp; Basic</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-2">
                    <IconCheck className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>
                      <strong className="text-slate-900 dark:text-slate-100">Try</strong> — OTP session to explore; no
                      card.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <IconCheck className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>
                      <strong className="text-slate-900 dark:text-slate-100">Basic</strong> — signed-in free tier with
                      limits.
                    </span>
                  </li>
                </ul>
                <TrackedFeaturesLink
                  href="/try"
                  event="features_cta_try"
                  className="mt-8 inline-flex rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Start Try
                </TrackedFeaturesLink>
              </div>
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-6 dark:border-amber-900/50 dark:bg-amber-950/25">
                <p className="text-sm font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">Pro &amp; passes</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-800 dark:text-slate-200">
                  <li className="flex gap-2">
                    <IconCheck className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400" />
                    <span>
                      <strong className="font-semibold">Pro</strong> — paid via SuperProfile; full exports and Pro limits
                      for your billing period.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <IconCheck className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400" />
                    <span>
                      <strong className="font-semibold">14-day pass</strong> — India one-time full-Pro window;{" "}
                      <em className="not-italic text-slate-600 dark:text-slate-400">not</em> the same as OTP Try.
                    </span>
                  </li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <TrackedFeaturesLink
                    href="/pricing"
                    event="features_cta_pricing"
                    className="inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    Full pricing
                  </TrackedFeaturesLink>
                  <TrackedFeaturesLink
                    href="/pricing#trial"
                    event="features_cta_trial_pass"
                    className="inline-flex rounded-lg border border-amber-400 bg-amber-100/80 px-4 py-2.5 text-sm font-semibold text-amber-950 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-900/55"
                  >
                    ₹49 · 14-day pass
                  </TrackedFeaturesLink>
                </div>
                <div className="mt-6">
                  <EmailMatchNote />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section id="trust" className="scroll-mt-28 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <PricingTrustStatsBar variant="compact" id="features-trust" />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-28 pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              FAQ
            </h2>
            <p className="mt-2 text-center text-2xl font-bold text-slate-900 dark:text-slate-50">Common questions</p>
            <div className="mt-10">
              <FeaturesFaq />
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section
          id="closing"
          className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900 py-20 sm:py-28"
        >
          <div className="absolute inset-0 opacity-15" aria-hidden style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #fbbf24 0%, transparent 60%)" }} />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to build — and share — your resume?
            </h2>
            <p className="mt-5 text-lg text-white/85">
              Start with Try, invite feedback with your link, then upgrade on SuperProfile when you need PDF, Word, and
              every template.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <TrackedFeaturesLink
                href="/try"
                event="features_cta_try"
                className="rounded-xl bg-amber-400 px-10 py-4 text-lg font-bold text-amber-950 shadow-xl shadow-black/25 transition hover:bg-amber-300"
              >
                Build my resume — Try
              </TrackedFeaturesLink>
              <TrackedFeaturesLink
                href="/pricing"
                event="features_cta_pricing"
                className="rounded-xl border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                Compare plans
              </TrackedFeaturesLink>
            </div>
            <p className="mt-6 text-sm text-white/60">No credit card for Try · Email verification for the quick session</p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/75">
              <Link href="/templates" className="underline-offset-2 hover:underline">
                Templates
              </Link>
              <Link href="/examples" className="underline-offset-2 hover:underline">
                Examples
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FeaturesStickyCta />
    </div>
  );
}
