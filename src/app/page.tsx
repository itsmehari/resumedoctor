import Link from "next/link";
import Image from "next/image";
import heroArtwork from "../../Resumedoctor-heroimage.png";
import { SiteHeader } from "@/components/site-header";
import { HomeJsonLd, FaqJsonLd, HowToJsonLd, FAQ_ITEMS } from "@/components/seo/json-ld";
import { PricingTrustStatsBar } from "@/components/pricing/payment-value-sections";
import { siteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
  title: "ResumeDoctor – Build ATS-Ready Resumes in Minutes | India-First Resume Builder",
  description:
    "Create a professional resume in under 5 minutes. 30+ ATS-friendly templates, AI suggestions, OTP try flow, and Pro exports. Trusted by job seekers across India.",
};

// ─── Inline SVG icons (server-safe, no deps) ─────────────────────────────────

function Icon({ path, size = 24, className = "" }: { path: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={path} />
    </svg>
  );
}

const PATHS = {
  check: "M5 13l4 4L19 7",
  template: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z",
  ai: "M13 10V3L4 14h7v7l9-11h-7z",
  download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  ats: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  device: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  globe: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  briefcase: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
  sparkle: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <HomeJsonLd />
      <FaqJsonLd />
      <HowToJsonLd />

      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col outline-none">
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 blur-3xl rounded-full"
          style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }} aria-hidden />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-10 blur-3xl rounded-full"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }} aria-hidden />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Built for the Indian job market
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.05] tracking-tight">
                Build a Resume<br />
                <span className="bg-gradient-to-r from-amber-200 via-accent to-amber-300 bg-clip-text text-transparent">
                  Recruiters Love
                </span>
              </h1>
              <p className="mt-5 text-lg text-white/85 max-w-lg leading-relaxed">
                Go from blank page to a portal-ready resume fast—ATS-friendly layouts, AI help for bullets, and a
                checker before you hit submit. Built for India, fresher to senior.
              </p>

              {/* Quick wins */}
              <ul className="mt-6 space-y-2">
                {[
                  "Templates recruiters can scan in seconds",
                  "AI turns rough notes into achievement bullets",
                  "See ATS fit before you apply to a role",
                  "Try with OTP · PDF & Word when you upgrade on Pro",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="w-4 h-4 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
                      <Icon path={PATHS.check} size={10} className="text-green-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTAs — primary "Try" (OTP) + secondary "Create account" so the
                  funnel does not depend solely on the OTP/email pipe. */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/try"
                  className="rounded-xl bg-accent hover:bg-accent-hover px-8 py-4 text-base font-bold text-accent-dark text-center transition-all shadow-xl shadow-black/30 hover:scale-[1.02] active:scale-[0.98]">
                  Build My Resume — Try
                </Link>
                <Link href="/signup"
                  className="rounded-xl border-2 border-white/40 bg-white/10 hover:bg-white/20 px-8 py-4 text-base font-semibold text-white text-center transition-all backdrop-blur-sm">
                  Create free account
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                <Link href="/templates" className="underline-offset-2 hover:underline">
                  Or browse templates →
                </Link>
                <span className="hidden sm:inline">·</span>
                <Link href="/login" className="underline-offset-2 hover:underline">
                  Already have an account? Sign in
                </Link>
              </div>

              <p className="mt-8 text-sm text-white/70">
                Upgrade on SuperProfile when you need exports &amp; every template — use the same email as your ResumeDoctor account
              </p>
            </div>

            {/* Right: hero visual */}
            <div className="relative hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900 py-28">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #fbbf24 0%, transparent 60%)" }} aria-hidden />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:3rem_3rem]" aria-hidden />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90 tracking-wide">
            <Icon path={PATHS.star} size={14} className="text-amber-300" />
            Start free · Upgrade when you export
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Your dream job is<br />one resume away.
          </h2>
          <p className="mt-5 text-lg text-white/80 max-w-lg mx-auto leading-relaxed">
            Build your best resume on ResumeDoctor. Start with Try, then upgrade when you need PDF, Word, and every template.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:items-center">
            <Link href="/try"
              className="rounded-xl bg-accent hover:bg-accent-hover px-10 py-4 text-lg font-bold text-accent-dark text-center transition-all shadow-xl shadow-black/25 hover:scale-[1.02]">
              Build my resume — try
            </Link>
            <Link href="/templates"
              className="rounded-xl border-2 border-white/40 bg-white/10 hover:bg-white/20 px-8 py-4 text-base font-semibold text-white text-center transition-all backdrop-blur-sm">
              View templates
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/55">No credit card · Email verification for the quick try</p>
        </div>
      </section>

      {/* ── PRICING TEASER ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Start with <span className="font-medium text-slate-700 dark:text-slate-300">Try</span> (OTP, no card), then unlock Pro on SuperProfile when you need PDFs and every template. India: optional ₹49 two-week full-Pro pass plus monthly and annual plans — checkouts do not auto-renew on us.
            </p>
          </div>

          <div className="mx-auto mb-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/try"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-800 shadow-sm transition-colors hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Try with OTP
            </Link>
            <Link
              href="/pricing#trial"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-700/60 dark:bg-amber-900/30 dark:text-amber-100 dark:hover:bg-amber-900/40"
            >
              India: ₹49 · 14-day full Pro pass
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <PricingCard
              plan="Pro monthly"
              price="₹199"
              period="/ month"
              badge="Most popular"
              features={["Unlimited resumes", "30+ templates", "PDF + DOCX export", "No watermarks", "50 AI runs / day", "Unlimited ATS checks"]}
              cta="View Pro plans"
              ctaHref="/pricing"
              variant="filled"
            />
            <PricingCard
              plan="Pro annual"
              price="₹1,499"
              period="/ year"
              features={["All Pro features", "Best total value", "PDF + DOCX export", "No watermarks", "50 AI runs / day", "Unlimited ATS checks"]}
              cta="Compare all plans"
              ctaHref="/pricing"
              variant="outline"
            />
          </div>

          <div className="mt-8 max-w-2xl mx-auto">
            <PricingTrustStatsBar variant="compact" />
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            All plans include secure cloud storage and work on every device.{" "}
            <Link href="/pricing" className="text-primary-600 hover:underline">Full pricing details →</Link>
          </p>
        </div>
      </section>

      {/* ── AI SPOTLIGHT ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#2a255a] to-[#1a1d3a] py-24">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 75% 50%, #3b82f6 0%, transparent 50%)" }}
          aria-hidden />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white/90">
            <Icon path={PATHS.sparkle} size={16} className="text-yellow-400" />
            AI-Powered Writing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Stop staring at a blank page.<br />
            <span className="text-violet-300">AI writes the hard parts for you.</span>
          </h2>
          <p className="text-white/70 text-base max-w-2xl mx-auto mb-12 leading-relaxed">
            Paste your job title and keywords — ResumeDoctor&apos;s AI generates achievement-driven bullet points
            tailored to your role. No generic fluff. Every line is ATS-optimised and quantified.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { icon: PATHS.ai,      label: "Bullet generator",    sub: "Role-specific bullet points" },
              { icon: PATHS.ats,     label: "ATS score checker",   sub: "Know your score before applying" },
              { icon: PATHS.sparkle, label: "Summary writer",      sub: "Professional intro in 1 click" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/8 border border-white/15 p-6 text-left hover:bg-white/12 transition-colors">
                <Icon path={item.icon} size={22} className="text-violet-300 mb-3" />
                <p className="font-semibold text-white text-sm">{item.label}</p>
                <p className="text-white/55 text-xs mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          <Link href="/try"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 px-8 py-4 text-base font-bold text-white transition-all shadow-lg shadow-violet-900/40 hover:scale-[1.02]">
            Try AI features
            <Icon path={PATHS.arrow} size={18} className="text-white" />
          </Link>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="relative border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/90 py-10 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900/90">
        <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25" aria-hidden
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgb(59 130 246 / 0.12), transparent 45%), radial-gradient(circle at 80% 50%, rgb(124 58 237 / 0.1), transparent 45%)" }} />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-8 shadow-sm ring-1 ring-slate-200/40 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/85 dark:ring-slate-700/50 sm:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-4 sm:gap-y-8">
              {[
                { num: "30+", label: "Templates" },
                { num: "ATS", label: "Friendly layouts" },
                { num: "Try", label: "OTP preview flow" },
                { num: "< 5 min", label: "First draft" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`text-center px-2 sm:px-4 ${i >= 2 ? "border-t border-slate-100 pt-10 dark:border-slate-800 sm:border-t-0 sm:pt-0" : ""} ${i % 2 === 1 ? "border-l border-slate-100 pl-6 dark:border-slate-800" : ""} ${i > 0 ? "sm:border-l sm:border-slate-200 sm:pl-6 dark:sm:border-slate-700 lg:pl-8" : ""}`}
                >
                  <p className="text-3xl font-extrabold tracking-tight text-primary-600 dark:text-primary-400 leading-none">{s.num}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTAL BAR ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 py-14 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-primary-950/20" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
            Trusted placements
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            Our users send resumes to India&apos;s top job boards and employer portals.
          </p>
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white/70 px-5 py-8 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-800/40 dark:ring-slate-700/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
              Apply on
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              {["Naukri.com", "LinkedIn", "Indeed India", "Internshala", "TimesJobs", "Shine", "Foundit"].map((name) => (
                <span key={name} className="rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-primary-300 hover:text-primary-700 hover:shadow-md dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/40 py-24 dark:from-slate-950 dark:via-slate-950 dark:to-primary-950/30">
        {/* Decorative background — gradient blobs + dot grid (same family as Hero/AI Spotlight) */}
        <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl dark:opacity-25"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 65%)" }} aria-hidden />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full opacity-30 blur-3xl dark:opacity-20"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 65%)" }} aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full opacity-25 blur-3xl dark:opacity-15"
          style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 65%)" }} aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.18]" aria-hidden
          style={{ backgroundImage: "radial-gradient(circle, rgb(15 23 42 / 0.08) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/70 to-transparent dark:via-primary-700/70" aria-hidden />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header — eyebrow pill + headline + sub */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-primary-200/80 bg-white/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.18em] text-primary-700 shadow-sm dark:border-primary-800/60 dark:bg-slate-900/70 dark:text-primary-300">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
              How it works
            </span>
            <h2 className="text-3xl sm:text-[2.6rem] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1]">
              From blank page to hired —{" "}
              <span className="bg-gradient-to-r from-primary-600 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                in 3 steps
              </span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Pick a layout, let AI sharpen your story, then export and apply with confidence.
            </p>
          </div>

          {/* Steps grid */}
          <div className="relative grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Connector line — visible on md+ between the three glass cards */}
            <div className="hidden md:block absolute top-[4.75rem] left-[calc(16.65%+0.75rem)] right-[calc(16.65%+0.75rem)] h-[3px] rounded-full bg-gradient-to-r from-primary-300/80 via-violet-300/80 to-emerald-300/80 dark:from-primary-800/60 dark:via-violet-800/60 dark:to-emerald-800/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]" aria-hidden />

            {[
              {
                step: "01",
                icon: PATHS.template,
                colorBg: "from-primary-500 to-blue-600",
                glow: "shadow-primary-500/40 dark:shadow-primary-400/30",
                ringTone: "ring-primary-200/60 dark:ring-primary-700/60",
                accent: "text-primary-600 dark:text-primary-400",
                title: "Pick a template",
                description: "Browse 30+ ATS-optimised designs. Filter by style, industry, or career stage.",
                preview: (
                  <div className="mt-4 grid grid-cols-3 gap-1.5">
                    {[0,1,2,3,4,5].map((i) => (
                      <div key={i} className={`aspect-[3/4] rounded-md border border-slate-200/90 ${i === 1 ? "bg-gradient-to-br from-primary-500 to-blue-600 ring-2 ring-primary-300" : "bg-slate-100 dark:bg-slate-800/80"} dark:border-slate-700/80 flex flex-col gap-0.5 p-1`}>
                        <div className={`h-1 rounded-full ${i === 1 ? "bg-white/80" : "bg-slate-300 dark:bg-slate-600"}`} />
                        <div className={`h-0.5 rounded-full ${i === 1 ? "bg-white/50" : "bg-slate-200 dark:bg-slate-700"} w-3/4`} />
                        <div className={`h-0.5 rounded-full ${i === 1 ? "bg-white/40" : "bg-slate-200 dark:bg-slate-700"} w-1/2`} />
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                step: "02",
                icon: PATHS.sparkle,
                colorBg: "from-violet-500 to-fuchsia-600",
                glow: "shadow-violet-500/40 dark:shadow-violet-400/30",
                ringTone: "ring-violet-200/60 dark:ring-violet-700/60",
                accent: "text-violet-600 dark:text-violet-400",
                title: "Fill with AI assistance",
                description: "Type a few keywords and let AI craft impactful, ATS-friendly bullet points.",
                preview: (
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                      Generating bullets...
                    </div>
                    <div className="rounded-md border border-violet-200/80 bg-gradient-to-r from-violet-50 to-white dark:border-violet-800/50 dark:from-violet-950/40 dark:to-slate-900 p-2 text-left">
                      <div className="h-1.5 w-full rounded-full bg-violet-200/80 dark:bg-violet-800/60 mb-1.5" />
                      <div className="h-1.5 w-5/6 rounded-full bg-violet-200/60 dark:bg-violet-800/40 mb-1.5" />
                      <div className="h-1.5 w-2/3 rounded-full bg-violet-200/40 dark:bg-violet-800/30" />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["python", "leadership", "scaled", "+18%"].map((k) => (
                        <span key={k} className="rounded-full border border-violet-200/80 bg-violet-50/90 px-1.5 py-0.5 text-[9px] font-semibold text-violet-700 dark:border-violet-800/40 dark:bg-violet-950/40 dark:text-violet-300">{k}</span>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                step: "03",
                icon: PATHS.download,
                colorBg: "from-emerald-500 to-teal-600",
                glow: "shadow-emerald-500/40 dark:shadow-emerald-400/30",
                ringTone: "ring-emerald-200/60 dark:ring-emerald-700/60",
                accent: "text-emerald-600 dark:text-emerald-400",
                title: "Download & apply",
                description: "One-click PDF or DOCX export. ATS score checked. Ready to send instantly.",
                preview: (
                  <div className="mt-4 space-y-1.5 text-left">
                    <div className="flex items-center justify-between rounded-md border border-emerald-200/70 bg-emerald-50/80 px-2 py-1.5 dark:border-emerald-800/40 dark:bg-emerald-950/40">
                      <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">resume.pdf</span>
                      <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">PDF</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border border-slate-200/70 bg-slate-50/90 px-2 py-1.5 dark:border-slate-700/60 dark:bg-slate-800/60">
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">resume.docx</span>
                      <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">DOCX</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400">
                      <Icon path={PATHS.check} size={10} className="text-emerald-600" />
                      ATS score: 92 / 100
                    </div>
                  </div>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-7 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-900/70 dark:ring-slate-700/40 dark:hover:border-slate-600"
              >
                {/* Step number ribbon */}
                <span className={`absolute right-5 top-5 text-[11px] font-extrabold tracking-[0.2em] ${item.accent} opacity-90`}>
                  {item.step}
                </span>

                {/* Icon — gradient + glow + ring (matches Hero/AI Spotlight icon styling) */}
                <div className={`relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.colorBg} ring-4 ring-white shadow-xl ${item.glow} transition-transform group-hover:scale-105 dark:ring-slate-950`}>
                  <Icon path={item.icon} size={28} className="text-white" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>

                {/* Mini preview block */}
                {item.preview}

                {/* Bottom accent line — appears on hover */}
                <div className={`pointer-events-none absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-gradient-to-r ${item.colorBg} opacity-0 transition-opacity group-hover:opacity-100`} aria-hidden />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-col items-center gap-3 text-center">
            <Link
              href="/try"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 via-blue-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-900/25 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-900/30"
            >
              Start building with Try
              <Icon path={PATHS.arrow} size={18} className="text-white" />
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No credit card · OTP-only access · ~ 5 minutes to a draft
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900/70 dark:via-slate-950 dark:to-slate-900/40">
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-20" aria-hidden
          style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgb(59 130 246 / 0.15), transparent)" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Built to get you from draft to “Send”
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-base leading-relaxed">
              Fewer formatting surprises on Naukri, LinkedIn, and campus drives—structure, wording help, and exports in
              one workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATE SHOWCASE ─────────────────────────────────────────────── */}
      <section className="relative py-24 bg-white dark:bg-slate-950">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-900 dark:to-transparent" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Templates</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              30 templates for every career
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-base leading-relaxed">
              Modern layouts, classic formats, dark sidebars, two-column designs — all ATS-safe and
              recruiter-tested for the Indian job market.
            </p>
          </div>

          <div className="mb-12 flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-2 shadow-inner dark:border-slate-700 dark:bg-slate-900/60">
              {([
                { label: "All", category: "" },
                { label: "Modern", category: "modern" },
                { label: "Classic", category: "classic" },
                { label: "Creative", category: "creative" },
                { label: "Minimal", category: "minimal" },
                { label: "Two-Column", category: "executive" },
                { label: "Dark Sidebar", category: "ats" },
              ] as const).map(({ label, category }) => (
                <Link
                  key={label}
                  href={category ? `/templates?category=${category}` : "/templates"}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    label === "All"
                      ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white hover:text-primary-700 hover:shadow-sm dark:hover:bg-slate-800 dark:hover:text-primary-300"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {TEMPLATE_CARDS.map((t) => (
              <TemplateShowcaseCard key={t.title} {...t} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-6 py-3 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300 dark:hover:bg-primary-900/40">
              See all 30 templates
              <Icon path={PATHS.arrow} size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CAREER STAGES ────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-gradient-to-b from-slate-100 to-white dark:from-slate-900/70 dark:to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">For everyone</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Whichever stage you&apos;re at,<br className="hidden sm:block" /> we have you covered
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-base">
              Section presets and guides tuned for freshers, experienced hires, career pivots, and academics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAREER_STAGES.map((stage) => (
              <CareerCard key={stage.title} {...stage} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-white dark:bg-slate-950">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900/80 dark:to-transparent" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Real job seekers. Real results.
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-base">
              Hear how ResumeDoctor fits into real application workflows across India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY COVERAGE ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Industries covered</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            Optimised for every sector in India
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10">
            Templates and wording cues align with how recruiters search in each domain.
          </p>
          <div className="rounded-3xl border border-slate-200/90 bg-white/80 px-6 py-8 shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900/70 dark:ring-slate-800">
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {[
                "IT & Software", "Banking & Finance", "Healthcare", "Marketing & Advertising",
                "Education", "Engineering", "Consulting", "E-commerce", "Government / PSU",
                "Media & Journalism", "Hospitality", "Legal", "Retail", "Manufacturing", "Logistics",
              ].map((industry) => (
                <span key={industry}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-slate-50 text-slate-700 border border-slate-200/90 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-600 dark:hover:border-primary-600 dark:hover:bg-primary-950/50 dark:hover:text-primary-200">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-950" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">FAQ</p>
            <h2 id="faq-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
              Quick answers before you start your resume.
            </p>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-800/60">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center mt-0.5 ring-2 ring-white dark:ring-slate-900">
                    {i + 1}
                  </span>
                  {item.question}
                </h3>
                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed text-sm pl-10 border-l-2 border-primary-100 dark:border-primary-900/50 ml-1">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-10">
            Still have questions?{" "}
            <Link href="/blog" className="font-medium text-primary-600 hover:underline dark:text-primary-400">Read our resume guides →</Link>
          </p>
        </div>
      </section>
      </main>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: PATHS.template,
    color: "text-primary-600 bg-primary-50 dark:bg-primary-900/30",
    title: "30+ ATS-friendly templates",
    description: "Every template is tested against Applicant Tracking Systems used by top Indian companies. Modern, clean, recruiter-approved.",
    badge: null,
    guideHref: "/blog/ats-friendly-resume-complete-guide",
  },
  {
    icon: PATHS.ai,
    color: "text-violet-600 bg-violet-50 dark:bg-violet-900/30",
    title: "AI bullet point generator",
    description: "Enter your role and AI writes achievement-focused bullets that pass ATS keyword filters and impress recruiters.",
    badge: "New",
    guideHref: null,
  },
  {
    icon: PATHS.ats,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30",
    title: "ATS score checker",
    description: "See your resume's ATS match score instantly. Know exactly which keywords to add before hitting submit.",
    badge: null,
    guideHref: "/blog/ats-friendly-resume-complete-guide",
  },
  {
    icon: PATHS.download,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
    title: "PDF & DOCX export",
    description: "Download pixel-perfect PDF for portals, or editable DOCX for interviews. One click, no watermarks on Pro.",
    badge: null,
    guideHref: null,
  },
  {
    icon: PATHS.shield,
    color: "text-rose-500 bg-rose-50 dark:bg-rose-900/30",
    title: "Secure cloud storage",
    description: "All your resumes saved securely in the cloud. Access, edit, and download from any device anytime.",
    badge: null,
    guideHref: null,
  },
  {
    icon: PATHS.sparkle,
    color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30",
    title: "14 section types",
    description: "Contact, Experience, Projects, Skills, Certifications, Publications, Volunteer Work, Custom sections — build the complete picture.",
    badge: "New",
    guideHref: "/blog/skills-section-guide",
  },
];

const TEMPLATE_CARDS = [
  { title: "Professional",  style: "Modern",      badge: "Popular",     accent: "#2563eb", layout: "single",       slots: 8 },
  { title: "Executive",     style: "Two-Column",  badge: null,          accent: "#7c3aed", layout: "two-column",   slots: 7 },
  { title: "Creative",      style: "Dark Sidebar", badge: "Trending",   accent: "#0f172a", layout: "dark-sidebar", slots: 6 },
];

const CAREER_STAGES = [
  {
    emoji: "🎓",
    title: "Fresher / Student",
    color: "border-blue-200 dark:border-blue-800",
    accent: "text-blue-600",
    sections: ["Career Objective", "Education", "Projects", "Skills", "Certifications", "Interests"],
    cta: "Build fresher resume",
    href: "/try",
    guideHref: "/blog/how-to-write-cv-for-freshers",
  },
  {
    emoji: "💼",
    title: "Experienced Pro",
    color: "border-emerald-200 dark:border-emerald-800",
    accent: "text-emerald-600",
    sections: ["Professional Summary", "Work Experience", "Skills", "Education", "Awards"],
    cta: "Build experience resume",
    href: "/try",
    guideHref: "/blog/how-to-write-professional-summary",
  },
  {
    emoji: "🔄",
    title: "Career Changer",
    color: "border-violet-200 dark:border-violet-800",
    accent: "text-violet-600",
    sections: ["Career Objective", "Transferable Skills", "Experience", "Education", "Volunteer"],
    cta: "Build career change resume",
    href: "/try",
    guideHref: "/blog/handling-career-gaps-on-resume",
  },
  {
    emoji: "🔬",
    title: "Academic / Research",
    color: "border-amber-200 dark:border-amber-800",
    accent: "text-amber-600",
    sections: ["Summary", "Publications", "Research", "Education", "Certifications", "Awards"],
    cta: "Build academic CV",
    href: "/try",
    guideHref: "/blog/resume-formats-india-guide",
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Nair",
    role: "Software Engineer at Infosys",
    avatar: "AN",
    color: "bg-primary-600",
    rating: 5,
    text: "Got 3 interview calls within a week of uploading my ResumeDoctor resume to Naukri. The ATS score feature helped me realise my old resume was missing key keywords.",
  },
  {
    name: "Priya Rajan",
    role: "Marketing Manager at Swiggy",
    avatar: "PR",
    color: "bg-rose-500",
    rating: 5,
    text: "The templates are genuinely beautiful — not generic at all. The two-column layout made my resume stand out on every platform I applied to.",
  },
  {
    name: "Kavitha S.",
    role: "Data Analyst at TCS",
    avatar: "KS",
    color: "bg-violet-600",
    rating: 5,
    text: "I was a fresher with no idea how to structure my resume. The Career Objective section and guided bullet tips helped me land my first job in 6 weeks.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroVisual() {
  return (
    <div className="relative w-[140%] max-w-none -ml-[20%]">
      <Image
        src={heroArtwork}
        alt="ResumeDoctor before-and-after optimized resume visual"
        width={1400}
        height={900}
        priority
        sizes="(max-width: 1024px) 100vw, 48vw"
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

function FeatureCard({ icon, color, title, description, badge, guideHref }: {
  icon: string; color: string; title: string; description: string; badge: string | null; guideHref?: string | null;
}) {
  return (
    <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800 dark:hover:border-primary-700/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400/0 via-primary-400/60 to-violet-400/0 opacity-0 transition-opacity group-hover:opacity-100 dark:via-primary-500/50" aria-hidden />
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 ring-1 ring-primary-200/50 dark:ring-primary-800/50">
          {badge}
        </span>
      )}
      <div className={`relative w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4 shadow-sm ring-2 ring-white dark:ring-slate-900`}>
        <Icon path={icon} size={22} />
      </div>
      <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-base">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      {guideHref && (
        <Link href={guideHref} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
          Read guide
          <Icon path={PATHS.arrow} size={12} />
        </Link>
      )}
    </div>
  );
}

function TemplateShowcaseCard({ title, style, badge, accent, layout, slots }: {
  title: string; style: string; badge: string | null; accent: string; layout: string; slots: number;
}) {
  const isSidebar = layout === "dark-sidebar";
  const isTwoCol = layout === "two-column";

  return (
    <Link href="/templates"
      className="group rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md ring-1 ring-slate-100 dark:ring-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-xl hover:shadow-primary-900/10 transition-all hover:-translate-y-1">
      {/* Preview */}
      <div className="relative bg-slate-50 dark:bg-slate-800 overflow-hidden" style={{ aspectRatio: "3/4" }}>
        {/* Simulated resume layout */}
        <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden">
          {isSidebar ? (
            <div className="flex h-full">
              <div className="w-1/3 h-full p-2 space-y-2" style={{ backgroundColor: accent }}>
                <div className="w-8 h-8 rounded-full bg-white/25 mx-auto mb-1" />
                <div className="h-1.5 bg-white/40 rounded w-3/4 mx-auto" />
                <div className="h-1.5 bg-white/25 rounded w-1/2 mx-auto" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-1 bg-white/20 rounded" style={{ width: `${55 + j * 8}%` }} />
                ))}
              </div>
              <div className="flex-1 p-2 space-y-2">
                {Array.from({ length: slots }).map((_, j) => (
                  <div key={j} className="h-1.5 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${55 + (j * 11) % 40}%` }} />
                ))}
              </div>
            </div>
          ) : isTwoCol ? (
            <div className="flex h-full flex-col">
              <div className="h-10 px-3 flex items-center" style={{ backgroundColor: accent + "18" }}>
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 bg-slate-800 dark:bg-slate-200 rounded w-2/3" />
                  <div className="h-1.5 rounded w-1/2" style={{ backgroundColor: accent + "70" }} />
                </div>
              </div>
              <div className="flex flex-1 border-t border-slate-100 dark:border-slate-700">
                <div className="w-1/3 border-r border-slate-100 dark:border-slate-700 p-2 space-y-1.5"
                  style={{ backgroundColor: accent + "08" }}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-1.5 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${50 + j * 12}%` }} />
                  ))}
                </div>
                <div className="flex-1 p-2 space-y-1.5">
                  {Array.from({ length: slots }).map((_, j) => (
                    <div key={j} className="h-1.5 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${55 + (j * 9) % 38}%` }} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="h-12 px-3 flex items-end pb-2" style={{ backgroundColor: accent }}>
                <div>
                  <div className="h-3 bg-white/90 rounded w-24 mb-1" />
                  <div className="h-1.5 bg-white/55 rounded w-16" />
                </div>
              </div>
              <div className="p-2 space-y-1.5">
                {Array.from({ length: slots }).map((_, j) => (
                  <div key={j} className="h-1.5 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${60 + (j * 7) % 35}%` }} />
                ))}
              </div>
            </div>
          )}
          {/* Accent strip indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent, opacity: isSidebar ? 0 : 0.8 }} />
        </div>

        {badge && (
          <span className="absolute top-5 left-5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-600 text-white shadow-sm">
            {badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 group-hover:to-black/10 transition-all" />
      </div>

      {/* Info */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{style}</p>
        </div>
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: accent + "20" }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </Link>
  );
}

function CareerCard({ emoji, title, color, accent, sections, cta, href, guideHref }: {
  emoji: string; title: string; color: string; accent: string;
  sections: string[]; cta: string; href: string; guideHref?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 ${color} bg-white dark:bg-slate-900 p-6 flex flex-col h-full shadow-md ring-1 ring-slate-100/80 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:ring-slate-800`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400/70 via-violet-400/70 to-emerald-400/70 opacity-80 dark:opacity-60" aria-hidden />
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl shadow-inner dark:bg-slate-800 mb-4">{emoji}</div>
      <h3 className={`font-bold text-base ${accent} mb-3`}>{title}</h3>
      <ul className="space-y-2 flex-1 mb-5">
        {sections.map((s) => (
          <li key={s} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
              <Icon path={PATHS.check} size={8} className="text-primary-600 dark:text-primary-400" />
            </span>
            {s}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Link href={href}
          className={`text-xs font-semibold ${accent} hover:underline flex items-center gap-1`}>
          {cta}
          <Icon path={PATHS.arrow} size={12} />
        </Link>
        {guideHref && (
          <Link href={guideHref} className="text-xs text-slate-500 dark:text-slate-400 hover:underline">
            Read guide →
          </Link>
        )}
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, avatar, color, rating, text }: {
  name: string; role: string; avatar: string; color: string; rating: number; text: string;
}) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-6 pt-8 shadow-md ring-1 ring-slate-100 transition-all hover:border-primary-200 hover:shadow-lg dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 dark:ring-slate-800 dark:hover:border-primary-800/60">
      <span className="absolute left-5 top-4 font-serif text-5xl leading-none text-primary-200/90 dark:text-primary-900/50" aria-hidden>&ldquo;</span>
      <div className="relative flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="relative text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{text}</p>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ plan, price, period, features, cta, ctaHref, variant, badge }: {
  plan: string; price: string; period: string; features: string[];
  cta: string; ctaHref: string; variant: "outline" | "filled"; badge?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-7 flex flex-col border-2 ${
      variant === "filled"
        ? "border-primary-600 bg-primary-600 text-white shadow-xl shadow-primary-900/20"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
    }`}>
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-dark text-xs font-bold px-4 py-1 rounded-full shadow">
          {badge}
        </span>
      )}
      <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${variant === "filled" ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
        {plan}
      </p>
      <div className="flex items-baseline gap-1 mb-6">
        <span className={`text-4xl font-extrabold ${variant === "filled" ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
          {price}
        </span>
        <span className={`text-sm ${variant === "filled" ? "text-white/60" : "text-slate-500"}`}>{period}</span>
      </div>
      <ul className="space-y-3 flex-1 mb-7">
        {features.map((f) => (
          <li key={f} className={`flex items-center gap-2.5 text-sm ${variant === "filled" ? "text-white/85" : "text-slate-700 dark:text-slate-300"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              variant === "filled" ? "bg-white/20" : "bg-primary-100 dark:bg-primary-900/40"
            }`}>
              <Icon path={PATHS.check} size={10} className={variant === "filled" ? "text-white" : "text-primary-600"} />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <Link href={ctaHref}
        className={`text-center rounded-xl py-3 text-sm font-bold transition-all hover:scale-[1.02] ${
          variant === "filled"
            ? "bg-white text-primary-600 hover:bg-white/90 shadow"
            : "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-900/20"
        }`}>
        {cta}
      </Link>
    </div>
  );
}
