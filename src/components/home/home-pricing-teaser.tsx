import Link from "next/link";
import { PricingTrustStatsBar } from "@/components/pricing/payment-value-sections";
import { LandingIcon, LANDING_ICON_PATHS } from "@/components/home/landing-icons";

function PricingPlanCard({
  plan,
  price,
  period,
  features,
  cta,
  ctaHref,
  variant,
  badge,
}: {
  plan: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  ctaHref: string;
  variant: "outline" | "filled";
  badge?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 p-7 ${
        variant === "filled"
          ? "border-primary-600 bg-primary-600 text-white shadow-xl shadow-primary-900/20"
          : "border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      }`}
    >
      {badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-accent-dark shadow">
          {badge}
        </span>
      ) : null}
      <p className={`mb-2 text-sm font-bold uppercase tracking-widest ${variant === "filled" ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
        {plan}
      </p>
      <div className="mb-6 flex items-baseline gap-1">
        <span className={`text-4xl font-extrabold ${variant === "filled" ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
          {price}
        </span>
        <span className={`text-sm ${variant === "filled" ? "text-white/60" : "text-slate-500"}`}>{period}</span>
      </div>
      <ul className="mb-7 flex-1 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className={`flex items-center gap-2.5 text-sm ${variant === "filled" ? "text-white/85" : "text-slate-700 dark:text-slate-300"}`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                variant === "filled" ? "bg-white/20" : "bg-primary-100 dark:bg-primary-900/40"
              }`}
            >
              <LandingIcon
                path={LANDING_ICON_PATHS.check}
                size={10}
                className={variant === "filled" ? "text-white" : "text-primary-600"}
              />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`rounded-xl py-3 text-center text-sm font-bold transition-all hover:scale-[1.02] ${
          variant === "filled"
            ? "bg-white text-primary-600 shadow hover:bg-white/90"
            : "bg-primary-600 text-white shadow-lg shadow-primary-900/20 hover:bg-primary-700"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

export function HomePricingTeaser() {
  return (
    <section className="bg-gradient-to-b from-slate-100 to-slate-50 py-24 dark:from-slate-900/60 dark:to-slate-900/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-500">Pricing</p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
            Start with <span className="font-medium text-slate-800 dark:text-slate-200">OTP Try</span> (no card). Upgrade
            on SuperProfile with the same email when you need PDF, Word, and every template.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
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

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <PricingPlanCard
            plan="Pro monthly"
            price="₹199"
            period="/ month"
            badge="Most popular"
            features={[
              "Unlimited resumes",
              "30+ templates",
              "PDF + DOCX export",
              "No watermarks",
              "50 AI runs / day",
              "Unlimited ATS checks",
            ]}
            cta="View Pro plans"
            ctaHref="/pricing"
            variant="filled"
          />
          <PricingPlanCard
            plan="Pro annual"
            price="₹1,499"
            period="/ year"
            features={[
              "All Pro features",
              "Best total value",
              "PDF + DOCX export",
              "No watermarks",
              "50 AI runs / day",
              "Unlimited ATS checks",
            ]}
            cta="Compare all plans"
            ctaHref="/pricing"
            variant="outline"
          />
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <PricingTrustStatsBar variant="compact" />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          All plans include secure cloud storage and work on every device.{" "}
          <Link href="/pricing" className="text-primary-600 hover:underline dark:text-primary-400">
            Full pricing details
          </Link>
        </p>
      </div>
    </section>
  );
}
