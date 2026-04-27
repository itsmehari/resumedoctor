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
  title: "ResumeDoctor – Build ATS-Ready Resumes in Minutes | India's #1 Resume Builder",
  description:
    "Create a professional resume in under 5 minutes. 30+ ATS-friendly templates, AI suggestions. Export TXT free; PDF and Word with Pro. Trusted by job seekers across India.",
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
                ATS-optimised templates, AI-powered bullet suggestions, and a 5-minute build time.
                Land your dream job — fresher to senior.
              </p>

              {/* Quick wins */}
              <ul className="mt-6 space-y-2">
                {[
                  "30+ professionally designed templates",
                  "AI suggestions for your experience bullets",
                  "ATS score checker before you apply",
                  "Start free (TXT) · PDF & Word on Pro",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="w-4 h-4 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
                      <Icon path={PATHS.check} size={10} className="text-green-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/try"
                  className="rounded-xl bg-accent hover:bg-accent-hover px-8 py-4 text-base font-bold text-accent-dark text-center transition-all shadow-xl shadow-black/30 hover:scale-[1.02] active:scale-[0.98]">
                  Build My Resume — Free
                </Link>
                <Link href="/templates"
                  className="rounded-xl border-2 border-white/40 bg-white/10 hover:bg-white/20 px-8 py-4 text-base font-semibold text-white text-center transition-all">
                  Browse Templates
                </Link>
              </div>

              <p className="mt-8 text-sm text-white/70">
                Pro: one-time purchase on SuperProfile · Same email as your account for instant unlock
              </p>
            </div>

            {/* Right: hero visual */}
            <div className="relative hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-white/90 backdrop-blur border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { num: "30+", label: "Templates" },
            { num: "ATS", label: "Friendly layouts" },
            { num: "Free", label: "Start at ₹0" },
            { num: "< 5 min", label: "First draft" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 leading-none">{s.num}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PORTAL BAR ───────────────────────────────────────────────────── */}
      <section className="py-10 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
            Our users apply to
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {["Naukri.com", "LinkedIn", "Indeed India", "Internshala", "TimesJobs", "Shine", "Foundit"].map((name) => (
              <span key={name} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-500 shadow-sm hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              From blank page to hired — in 3 steps
            </h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.5%+1rem)] right-[calc(16.5%+1rem)] h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" aria-hidden />

            {[
              {
                step: "01",
                icon: PATHS.template,
                color: "bg-primary-600",
                title: "Pick a template",
                description: "Browse 30 ATS-optimised designs. Filter by style, industry, or career stage.",
              },
              {
                step: "02",
                icon: PATHS.sparkle,
                color: "bg-violet-600",
                title: "Fill with AI assistance",
                description: "Type a few keywords and let AI craft impactful bullet points. Each section guided.",
              },
              {
                step: "03",
                icon: PATHS.download,
                color: "bg-emerald-600",
                title: "Download & apply",
                description: "One-click PDF or DOCX export. ATS score checked. Ready to send instantly.",
              },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon path={item.icon} size={28} className="text-white" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">{item.step}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/try"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 px-8 py-4 text-base font-bold text-white transition-all shadow-lg shadow-primary-900/25 hover:scale-[1.02]">
              Start building free
              <Icon path={PATHS.arrow} size={18} className="text-white" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Everything you need to stand out
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
              Built specifically for the Indian job market — from campus placements to senior roles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
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
            Try AI features free
            <Icon path={PATHS.arrow} size={18} className="text-white" />
          </Link>
        </div>
      </section>

      {/* ── TEMPLATE SHOWCASE ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Templates</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              30 templates for every career
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Modern layouts, classic formats, dark sidebars, two-column designs — all ATS-safe and
              recruiter-tested for the Indian job market.
            </p>
          </div>

          {/* Style filter pills – link to /templates with category */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
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
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  label === "All"
                    ? "bg-primary-600 text-white border-primary-600"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATE_CARDS.map((t) => (
              <TemplateShowcaseCard key={t.title} {...t} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/templates"
              className="inline-flex items-center gap-2 font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              See all 30 templates
              <Icon path={PATHS.arrow} size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CAREER STAGES ────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">For everyone</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Whichever stage you&apos;re at,<br className="hidden sm:block" /> we have you covered
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAREER_STAGES.map((stage) => (
              <CareerCard key={stage.title} {...stage} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Reviews</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Real job seekers. Real results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
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
              Start free. Unlock Pro via one-time SuperProfile payments (monthly, annual, or 14-day trial). No auto-renew surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PricingCard
              plan="Free"
              price="₹0"
              period="forever"
              features={["Unlimited resumes", "10 base templates", "TXT & print preview", "1 ATS check / resume", "5 AI bullet runs / day"]}
              cta="Get started free"
              ctaHref="/try"
              variant="outline"
            />
            <PricingCard
              plan="Pro"
              price="₹199"
              period=" / mo tier"
              badge="Most popular"
              features={["Unlimited resumes", "30+ templates", "PDF + DOCX export", "No watermarks", "50 AI runs / day", "Unlimited ATS checks"]}
              cta="View Pro plans"
              ctaHref="/pricing"
              variant="filled"
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

      {/* ── INDUSTRY COVERAGE ────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4">Industries covered</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">
            Optimised for every sector in India
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "IT & Software", "Banking & Finance", "Healthcare", "Marketing & Advertising",
              "Education", "Engineering", "Consulting", "E-commerce", "Government / PSU",
              "Media & Journalism", "Hospitality", "Legal", "Retail", "Manufacturing", "Logistics",
            ].map((industry) => (
              <span key={industry}
                className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 transition-colors cursor-default border border-slate-200 dark:border-slate-700">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">FAQ</p>
            <h2 id="faq-heading" className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-5">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {item.question}
                </h3>
                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed text-sm pl-9">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Still have questions?{" "}
            <Link href="/blog" className="text-primary-600 hover:underline">Read our resume guides →</Link>
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900 py-28">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #fbbf24 0%, transparent 60%)" }} aria-hidden />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Your dream job is<br />one resume away.
          </h2>
          <p className="mt-5 text-lg text-white/80 max-w-lg mx-auto">
            Build your best resume on ResumeDoctor. Free to start—upgrade when you need PDF, Word, and every template.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/try"
              className="rounded-xl bg-accent hover:bg-accent-hover px-10 py-4 text-lg font-bold text-accent-dark text-center transition-all shadow-xl shadow-black/25 hover:scale-[1.02]">
              Build my resume — free
            </Link>
            <Link href="/templates"
              className="rounded-xl border-2 border-white/40 bg-white/10 hover:bg-white/20 px-8 py-4 text-base font-semibold text-white text-center transition-all">
              View templates
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/55">No credit card · Email verification for the quick try</p>
        </div>
      </section>
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
    <div className="relative rounded-3xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-[1.01]">
      <Image
        src={heroArtwork}
        alt="ResumeDoctor before-and-after optimized resume visual"
        width={1400}
        height={900}
        priority
        sizes="(max-width: 1024px) 100vw, 48vw"
        className="h-auto w-full rounded-2xl object-cover"
      />
    </div>
  );
}

function FeatureCard({ icon, color, title, description, badge, guideHref }: {
  icon: string; color: string; title: string; description: string; badge: string | null; guideHref?: string | null;
}) {
  return (
    <div className="group relative min-h-[260px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-700">
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
          {badge}
        </span>
      )}
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon path={icon} size={22} />
      </div>
      <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-base">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      {guideHref && (
        <Link href={guideHref} className="mt-3 inline-block text-xs text-primary-600 dark:text-primary-400 hover:underline">
          Read guide →
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
      className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
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
    <div className={`rounded-2xl border-2 ${color} bg-white dark:bg-slate-900 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all`}>
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className={`font-bold text-base ${accent} mb-3`}>{title}</h3>
      <ul className="space-y-1.5 flex-1 mb-5">
        {sections.map((s) => (
          <li key={s} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">&quot;{text}&quot;</p>
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
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
