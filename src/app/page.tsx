import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";
import { HeroCVMockup } from "@/components/hero-cv-mockup";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — elegant, minimal */}
      <header className="border-b border-white/10 bg-primary-600 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-white tracking-tight"
          >
            ResumeDoctor
          </Link>
          <AuthNav inverted />
        </div>
      </header>

      {/* Hero — full-width blue, Zety-style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        {/* Decorative golden blob */}
        <div
          className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          aria-hidden
          style={{
            background: "radial-gradient(circle, rgba(255, 185, 0, 0.6) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Catchphrase with device icons */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold tracking-[0.2em] text-white/90 uppercase">
                  Craft Your Future, Effortlessly
                </span>
                <span className="flex gap-1.5 text-white/70" aria-hidden>
                  <DeviceIcon type="desktop" />
                  <DeviceIcon type="tablet" />
                  <DeviceIcon type="mobile" />
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Build a Resume That Lands Your Dream Job
              </h1>
              <p className="mt-6 text-lg text-white/90 max-w-xl leading-relaxed">
                Get hired faster with HR-approved templates. Choose your style,
                add ready-made content, and finish in minutes.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/resumes/new"
                  className="rounded-xl bg-accent hover:bg-accent-hover px-8 py-4 text-lg font-semibold text-accent-dark text-center transition-colors shadow-lg shadow-black/20"
                >
                  Create Your Resume
                </Link>
                <Link
                  href="/templates"
                  className="rounded-xl border-2 border-white bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white hover:bg-white/20 transition-colors text-center"
                >
                  Explore Our Templates
                </Link>
              </div>

              {/* Trust indicator */}
              <div className="mt-8 flex items-center gap-2">
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-success"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-white/90">
                  Rated by thousands of job seekers
                </span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <HeroCVMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar — as seen in */}
      <section className="py-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 tracking-wide">
            Trusted by professionals across India
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 opacity-50">
            {["Naukri", "LinkedIn", "Indeed", "TimesJobs", "Shine"].map(
              (name) => (
                <span
                  key={name}
                  className="text-base font-semibold text-slate-600 dark:text-slate-500"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Template preview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center mb-4">
            Choose Your Template
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-12">
            HR-approved designs for every industry. Modern, clean, ATS-friendly.
          </p>

          {/* Filter bar — Zety-style */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-medium hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              <FilterIcon />
              All Filters
            </button>
            {["Industry", "Experience", "Style"].map((label) => (
              <button
                key={label}
                type="button"
                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-medium hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Template cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <TemplateCard
              accent="primary"
              badge="Popular"
              title="Modern Blue"
              href="/templates"
            />
            <TemplateCard
              accent="emerald"
              badge="Recommended"
              title="Classic Green"
              href="/templates"
            />
            <TemplateCard
              accent="amber"
              title="Minimalist"
              href="/templates"
            />
          </div>

          <div className="text-center mt-10">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              View all templates
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center mb-4">
            Why Choose ResumeDoctor?
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-16">
            Everything you need to stand out in the job market.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard
              step={1}
              icon={<DocumentIcon />}
              title="Professional templates"
              description="ATS-friendly designs for the Indian job market. Modern, clean, and easy to customize."
            />
            <FeatureCard
              step={2}
              icon={<EditIcon />}
              title="Expert content & AI"
              description="Power words and bullet points tailored for your industry. Stand out to recruiters."
            />
            <FeatureCard
              step={3}
              icon={<DownloadIcon />}
              title="Export & apply"
              description="Download as PDF. Apply directly to Naukri, LinkedIn, and job portals."
            />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to land your next role?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Create your professional resume in minutes. Free to start.
          </p>
          <Link
            href="/resumes/new"
            className="inline-block mt-10 rounded-xl bg-accent hover:bg-accent-hover px-10 py-4 text-lg font-semibold text-accent-dark transition-colors shadow-lg shadow-black/20"
          >
            Create Your Resume
          </Link>
        </div>
      </section>
    </div>
  );
}

function DeviceIcon({ type }: { type: "desktop" | "tablet" | "mobile" }) {
  if (type === "desktop") {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  if (type === "tablet") {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function TemplateCard({
  accent,
  badge,
  title,
  href,
}: {
  accent: "primary" | "emerald" | "amber";
  badge?: string;
  title: string;
  href: string;
}) {
  const accentColors = {
    primary: "from-primary-500 to-primary-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
  };
  const badgeColors: Record<string, string> = {
    Popular: "bg-primary-500 text-white",
    Recommended: "bg-success text-white",
  };

  return (
    <Link
      href={href}
      className="group block rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-800">
        {/* Template preview placeholder */}
        <div className={`absolute inset-0 bg-gradient-to-br ${accentColors[accent]} opacity-20`} />
        <div className="absolute inset-4 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/50">
          <div className="p-3 space-y-2">
            <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-600" />
            <div className="h-1.5 w-3/4 rounded bg-slate-100 dark:bg-slate-700" />
            <div className="h-1.5 w-2/3 rounded bg-slate-100 dark:bg-slate-700" />
            <div className="mt-4 h-1.5 w-full rounded bg-slate-100 dark:bg-slate-700" />
            <div className="h-1.5 w-4/5 rounded bg-slate-100 dark:bg-slate-700" />
          </div>
        </div>
        {badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold ${badgeColors[badge]}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function FeatureCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
          {step}
        </span>
        <div className="text-primary-600 dark:text-primary-400">{icon}</div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
