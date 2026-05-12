import Link from "next/link";
import Image from "next/image";
import heroArtwork from "../../../Resumedoctor-heroimage.png";
import { LandingIcon, LANDING_ICON_PATHS } from "@/components/home/landing-icons";
import {
  AI_FEATURES,
  ATS_BEAT_POINTS,
  EMPLOYER_LOGOS,
  HERO_TRUST_POINTS,
  JOB_PORTALS,
  TEMPLATE_FILTERS,
  TEMPLATE_QUICK_PICK,
  TEMPLATE_SHOWCASE,
  TESTIMONIALS,
  THREE_STEPS,
  VALUE_PROPS,
} from "@/components/home/landing-data";
import {
  StepDeviceMock,
  TemplateQuickPickCard,
  TemplateShowcaseCard,
  TestimonialCard,
} from "@/components/home/landing-ui";
import { HomeFaqSection } from "@/components/home/home-faq-section";
import { HomePricingTeaser } from "@/components/home/home-pricing-teaser";
import { HomeResumeLinkSection } from "@/components/home/home-resume-link-section";
import { TrustBadges } from "@/components/trust-badges";

export function HomeLanding() {
  const marqueeTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
  <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900">
        <div
          className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <TrustBadges variant="onDark" />
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                Built for the Indian job market
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]">
                Build your ATS resume
                <span className="block bg-gradient-to-r from-amber-200 via-accent to-amber-300 bg-clip-text text-transparent">
                  in minutes — start with OTP Try
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/85 lg:mx-0">
                30+ recruiter-friendly templates, AI writing help, and a shareable resume link that stays current on
                WhatsApp, LinkedIn, and recruiter email.
              </p>

              <ul className="mx-auto mt-6 max-w-md space-y-2 lg:mx-0">
                {HERO_TRUST_POINTS.map((item) => (
                  <li key={item} className="flex items-center justify-center gap-2.5 text-sm text-white/85 lg:justify-start">
                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-400/20">
                      <LandingIcon path={LANDING_ICON_PATHS.check} size={10} className="text-green-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  href="/try"
                  className="rounded-xl bg-accent px-8 py-4 text-center text-base font-bold text-accent-dark shadow-xl shadow-black/30 transition-all hover:scale-[1.02] hover:bg-accent-hover active:scale-[0.98]"
                >
                  Start OTP Try — free preview
                </Link>
                <Link
                  href="/templates"
                  className="rounded-xl border-2 border-white/40 bg-white/10 px-8 py-4 text-center text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Browse templates
                </Link>
              </div>
              <p className="mt-3 text-sm text-white/70">
                OTP Try is a no-card preview. Upgrade on SuperProfile with the same email for PDF, Word, and every
                template.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative lg:-ml-[12%] lg:w-[120%]">
                <Image
                  src={heroArtwork}
                  alt="ResumeDoctor resume builder preview"
                  width={1400}
                  height={900}
                  priority
                  sizes="(max-width: 1024px) 90vw, 48vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500">Templates</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                Get started with a template
              </h2>
            </div>
            <Link href="/templates" className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">
              See all
            </Link>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
            {TEMPLATE_QUICK_PICK.map((template) => (
              <TemplateQuickPickCard
                key={template.id}
                name={template.name}
                accent={template.accent}
                hint={template.hint}
                href={template.category ? `/templates?category=${template.category}` : "/templates"}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
            Example employers and brands where our users commonly apply
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-slate-500 dark:text-slate-500">
            Names shown for context only — not endorsements or hiring partnerships.
          </p>
          <div className="relative mt-8 overflow-hidden">
            <div className="landing-marquee-track flex w-max gap-3">
              {[...EMPLOYER_LOGOS, ...EMPLOYER_LOGOS].map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  className="rounded-full border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-300"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">Apply on</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Layouts and exports aligned with how you apply on India&apos;s job boards.
          </p>
          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 px-5 py-8 ring-1 ring-slate-200/50 dark:border-slate-700/80 dark:bg-slate-900/40 dark:ring-slate-700/40">
            {JOB_PORTALS.map((name) => (
              <span
                key={name}
                className="rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-50 via-white to-primary-50/30 py-24 dark:from-slate-950 dark:via-slate-950 dark:to-primary-950/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Your professional resume in 3 simple steps
            </h2>
          </div>

          <div className="space-y-20">
            {THREE_STEPS.map((step, index) => (
              <div
                key={step.step}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="text-sm font-extrabold tracking-[0.2em] text-primary-600 dark:text-primary-400">Step {step.step}</p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">{step.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{step.description}</p>
                  <Link
                    href={step.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-900/20 transition hover:bg-primary-700"
                  >
                    {step.cta}
                    <LandingIcon path={LANDING_ICON_PATHS.arrow} size={16} />
                  </Link>
                </div>
                <StepDeviceMock step={step.step as "01" | "02" | "03"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Choose from recruiter-approved designs for every career stage
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              ATS-safe, modern, creative, and professional — templates tuned for the Indian job market.
            </p>
          </div>

          <div className="mb-10 flex justify-center">
            <div className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-slate-200/90 bg-white/95 p-1.5 shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800">
              {TEMPLATE_FILTERS.map(({ label, category }) => (
                <Link
                  key={label}
                  href={category ? `/templates?category=${category}` : "/templates"}
                  className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-all ${
                    label === "All"
                      ? "bg-primary-600 text-white shadow-md shadow-primary-900/25"
                      : "text-slate-600 hover:bg-primary-50 hover:text-primary-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary-300"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATE_SHOWCASE.map((template) => (
              <TemplateShowcaseCard
                key={template.title}
                {...template}
                href={template.category ? `/templates?category=${template.category}` : "/templates"}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/try"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-accent-dark shadow-lg transition hover:bg-accent-hover"
            >
              Start OTP Try
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-slate-50 py-24 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500">Workflow stories</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              How job seekers use ResumeDoctor
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Illustrative scenarios based on common application workflows — not verified customer reviews.
            </p>
          </div>
          <div className="grid gap-6 md:hidden">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
          <div className="relative hidden overflow-hidden md:block">
            <div className="landing-marquee-track flex w-max gap-6">
              {marqueeTestimonials.map((testimonial, index) => (
                <TestimonialCard key={`${testimonial.name}-${index}`} {...testimonial} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#2a255a] to-[#1a1d3a] py-24">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 75% 50%, #3b82f6 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-300/90">ATS resume optimisation</p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Stop struggling with ATS and wording yourself
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                ResumeDoctor formats your experience for parsers, suggests keywords from job descriptions, and helps you
                write achievement bullets without staring at a blank page.
              </p>
              <Link
                href="/try"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-400"
              >
                Try AI features in OTP Try
                <LandingIcon path={LANDING_ICON_PATHS.arrow} size={18} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {AI_FEATURES.map((feature) => (
                <div
                  key={feature.label}
                  className="rounded-2xl border border-white/15 bg-white/8 p-6 text-left transition-colors hover:bg-white/12"
                >
                  <LandingIcon path={feature.icon} size={22} className="mb-3 text-violet-300" />
                  <p className="text-sm font-semibold text-white">{feature.label}</p>
                  <p className="mt-1 text-xs text-white/55">{feature.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Join job seekers building professional resumes on ResumeDoctor
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Start with OTP Try, publish a resume link for free, and upgrade when you need exports and every template.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUE_PROPS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-7 shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900/70 dark:ring-slate-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  <LandingIcon path={item.icon} size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeResumeLinkSection />

      <section className="border-y border-slate-200/80 bg-gradient-to-br from-primary-50/60 via-white to-slate-50 py-20 dark:border-slate-800 dark:from-primary-950/20 dark:via-slate-950 dark:to-slate-900/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">Expert help</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Go deeper with guides and interview prep</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Use ResumeDoctor&apos;s blog playbooks for ATS, fresher CVs, and summaries — plus interview prep prompts when
              you want structured practice after applications go out.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/blog" className="rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700">
                Read resume guides
              </Link>
              <Link
                href="/interview-prep"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-primary-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                Explore interview prep
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Popular starting points</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/blog/ats-friendly-resume-complete-guide" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
                  ATS-friendly resume guide
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-write-cv-for-freshers" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
                  CV for freshers
                </Link>
              </li>
              <li>
                <Link href="/resume-link" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
                  Share your resume as a link
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500">Beat applicant tracking systems</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
              Layouts and wording that survive the first screen
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {ATS_BEAT_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                    <LandingIcon path={LANDING_ICON_PATHS.check} size={11} className="text-primary-600 dark:text-primary-400" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HomePricingTeaser />

      <HomeFaqSection />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900 py-24">
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #fbbf24 0%, transparent 60%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Your next role deserves a resume — and a link — that stays current
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Start with OTP Try on ResumeDoctor, publish a shareable link for free, and upgrade on SuperProfile when you
            need PDF, Word, and every template for India&apos;s job portals.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/try"
              className="rounded-xl bg-accent px-10 py-4 text-lg font-bold text-accent-dark shadow-xl shadow-black/25 transition hover:scale-[1.02] hover:bg-accent-hover"
            >
              Start OTP Try
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
