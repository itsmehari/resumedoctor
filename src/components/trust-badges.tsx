/**
 * SXO – Trust badges for conversion.
 * Evidence-based trust signals without fake reviews.
 */
export function TrustBadges() {
  const badges = [
    { label: "Quick OTP Try", sub: "Email code, no card" },
    { label: "ATS-optimized", sub: "Works with Naukri, Indeed" },
    { label: "PDF & Word export", sub: "Pro via SuperProfile" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-10" role="list" aria-label="Trust indicators">
      {badges.map((b) => (
        <div key={b.label} className="text-center" role="listitem">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{b.label}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{b.sub}</p>
        </div>
      ))}
    </div>
  );
}
