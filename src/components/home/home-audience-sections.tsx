import { CAREER_STAGES, INDUSTRIES } from "@/components/home/landing-data";
import { CareerCard } from "@/components/home/landing-ui";

export function HomeCareerStagesSection() {
  return (
    <section className="bg-gradient-to-b from-slate-100 to-white py-24 dark:from-slate-900/70 dark:to-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-500">For everyone</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Whichever stage you&apos;re at, we have you covered
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            Section presets and guides tuned for freshers, experienced hires, career pivots, and academics.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CAREER_STAGES.map((stage) => (
            <CareerCard key={stage.title} {...stage} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeIndustriesSection() {
  return (
    <section className="border-y border-slate-200/80 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-500">Industries covered</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Optimised for every sector in India
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Templates and wording cues align with how recruiters search in each domain.
        </p>
        <div className="mt-10 rounded-3xl border border-slate-200/90 bg-white/80 px-6 py-8 shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900/70 dark:ring-slate-800">
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {INDUSTRIES.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-slate-200/90 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-primary-600 dark:hover:bg-primary-950/50 dark:hover:text-primary-200"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
