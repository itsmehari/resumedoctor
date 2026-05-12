/**
 * SXO – Trust badges for conversion.
 * Evidence-based trust signals without fake reviews.
 */
export function TrustBadges({ variant = "default" }: { variant?: "default" | "onDark" }) {
  const badges = [
    { label: "Quick OTP Try", sub: "Email code, no card" },
    { label: "ATS-optimized", sub: "Works with Naukri, Indeed" },
    { label: "PDF & Word export", sub: "Pro via SuperProfile" },
  ];

  const labelClass =
    variant === "onDark" ? "font-semibold text-white" : "font-semibold text-slate-900 dark:text-slate-100";
  const subClass =
    variant === "onDark" ? "text-sm text-white/75" : "text-sm text-slate-500 dark:text-slate-400";

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-10" role="list" aria-label="Trust indicators">
      {badges.map((badge) => (
        <div key={badge.label} className="text-center" role="listitem">
          <p className={labelClass}>{badge.label}</p>
          <p className={subClass}>{badge.sub}</p>
        </div>
      ))}
    </div>
  );
}
