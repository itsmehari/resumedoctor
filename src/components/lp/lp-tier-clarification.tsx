import Link from "next/link";

/**
 * Short, consistent Try vs paid copy for BOFU landing pages (messaging brief alignment).
 */
export function LpTierClarification() {
  return (
    <section
      aria-labelledby="lp-tier-heading"
      className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900/50"
    >
      <h2
        id="lp-tier-heading"
        className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        Try, Basic, Pro, and 14-day pass
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
        <li>
          <strong className="text-slate-800 dark:text-slate-200">Try</strong> — OTP preview in the browser. Explore the
          builder without a card.
        </li>
        <li>
          <strong className="text-slate-800 dark:text-slate-200">Basic</strong> — After you sign up, your saved free
          tier (limits apply).
        </li>
        <li>
          <strong className="text-slate-800 dark:text-slate-200">Pro</strong> — Paid via SuperProfile; unlocks
          application-grade exports and Pro limits. See{" "}
          <Link href="/pricing" className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400">
            pricing
          </Link>{" "}
          for the current list.
        </li>
        <li>
          <strong className="text-slate-800 dark:text-slate-200">14-day pass</strong> — India one-time full Pro window.
          It is <span className="italic">not</span> the same thing as OTP Try.
        </li>
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        ATS and AI tools give guidance based on your text and the job description you paste—they do not guarantee a
        human shortlist. Use them to improve clarity and keyword fit, then apply with a file you are proud to attach.
      </p>
    </section>
  );
}
