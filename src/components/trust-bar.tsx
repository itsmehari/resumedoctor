/**
 * Trust bar – job portals we support. Used on home.
 * Copy emphasizes compatibility, not endorsement.
 */
export function TrustBar() {
  const portals = ["Naukri", "LinkedIn", "Indeed", "TimesJobs", "Shine"];

  return (
    <section
      className="py-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
      aria-labelledby="trust-bar-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p
          id="trust-bar-heading"
          className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 tracking-wide"
        >
          Works with job portals across India
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 opacity-60">
          {portals.map((name) => (
            <span
              key={name}
              className="text-base font-semibold text-slate-600 dark:text-slate-500"
            >
              {name}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          Export your resume and apply directly to these platforms
        </p>
      </div>
    </section>
  );
}
