import Link from "next/link";
import { LandingIcon, LANDING_ICON_PATHS } from "@/components/home/landing-icons";

export function TemplateQuickPickCard({
  name,
  accent,
  users,
  href,
}: {
  name: string;
  accent: string;
  users: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800 dark:hover:border-primary-700"
    >
      <div className="aspect-[3/4] bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-800 dark:to-slate-900">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-inner ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-slate-700">
          <div className="h-10 px-3" style={{ backgroundColor: accent }}>
            <div className="h-2.5 w-20 rounded bg-white/90" />
            <div className="mt-1 h-1.5 w-14 rounded bg-white/55" />
          </div>
          <div className="flex-1 space-y-1.5 p-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-1.5 rounded bg-slate-200 dark:bg-slate-700"
                style={{ width: `${58 + (index * 9) % 34}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        <p className="font-bold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400">
          {name}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Chosen by {users} users</p>
      </div>
    </Link>
  );
}

export function TemplateShowcaseCard({
  title,
  style,
  badge,
  accent,
  layout,
  slots,
}: {
  title: string;
  style: string;
  badge: string | null;
  accent: string;
  layout: string;
  slots: number;
}) {
  const isSidebar = layout === "dark-sidebar";
  const isTwoCol = layout === "two-column";

  return (
    <Link
      href="/templates"
      className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/95 transition-all hover:-translate-y-1 hover:border-primary-200/90 hover:shadow-[0_28px_60px_rgba(37,99,235,0.12)] dark:border-slate-700/90 dark:bg-slate-900 dark:ring-slate-800 dark:hover:border-primary-700/70"
    >
      <div
        className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/90 dark:from-slate-800 dark:to-slate-900/90"
        style={{ aspectRatio: "3/4" }}
      >
        <div className="absolute inset-4 overflow-hidden rounded-xl bg-white shadow-inner ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700/80">
          {isSidebar ? (
            <div className="flex h-full">
              <div className="w-1/3 space-y-2 p-2" style={{ backgroundColor: accent }}>
                <div className="mx-auto mb-1 h-8 w-8 rounded-full bg-white/25" />
                <div className="mx-auto h-1.5 w-3/4 rounded bg-white/40" />
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-1 rounded bg-white/20" style={{ width: `${55 + index * 8}%` }} />
                ))}
              </div>
              <div className="flex-1 space-y-2 p-2">
                {Array.from({ length: slots }).map((_, index) => (
                  <div
                    key={index}
                    className="h-1.5 rounded bg-slate-200 dark:bg-slate-700"
                    style={{ width: `${55 + (index * 11) % 40}%` }}
                  />
                ))}
              </div>
            </div>
          ) : isTwoCol ? (
            <div className="flex h-full flex-col">
              <div className="flex h-10 items-center px-3" style={{ backgroundColor: `${accent}18` }}>
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 w-2/3 rounded bg-slate-800 dark:bg-slate-200" />
                  <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: `${accent}70` }} />
                </div>
              </div>
              <div className="flex flex-1 border-t border-slate-100 dark:border-slate-700">
                <div
                  className="w-1/3 space-y-1.5 border-r border-slate-100 p-2 dark:border-slate-700"
                  style={{ backgroundColor: `${accent}08` }}
                >
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-1.5 rounded bg-slate-200 dark:bg-slate-700"
                      style={{ width: `${50 + index * 12}%` }}
                    />
                  ))}
                </div>
                <div className="flex-1 space-y-1.5 p-2">
                  {Array.from({ length: slots }).map((_, index) => (
                    <div
                      key={index}
                      className="h-1.5 rounded bg-slate-200 dark:bg-slate-700"
                      style={{ width: `${55 + (index * 9) % 38}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex h-12 items-end px-3 pb-2" style={{ backgroundColor: accent }}>
                <div>
                  <div className="mb-1 h-3 w-24 rounded bg-white/90" />
                  <div className="h-1.5 w-16 rounded bg-white/55" />
                </div>
              </div>
              <div className="space-y-1.5 p-2">
                {Array.from({ length: slots }).map((_, index) => (
                  <div
                    key={index}
                    className="h-1.5 rounded bg-slate-200 dark:bg-slate-700"
                    style={{ width: `${60 + (index * 7) % 35}%` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div
            className="absolute bottom-0 left-0 top-0 w-1.5"
            style={{ backgroundColor: accent, opacity: isSidebar ? 0 : 0.8 }}
          />
        </div>
        {badge ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-md shadow-primary-900/25 ring-1 ring-white/20">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100/90 bg-white/95 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/95">
        <div>
          <h3 className="font-bold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{style}</p>
        </div>
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-white shadow-sm dark:ring-slate-900"
          style={{ backgroundColor: `${accent}22` }}
        >
          <div className="h-2.5 w-2.5 rounded-full shadow-inner" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </Link>
  );
}

export function TestimonialCard({
  name,
  role,
  avatar,
  color,
  text,
}: {
  name: string;
  role: string;
  avatar: string;
  color: string;
  text: string;
}) {
  return (
    <figure className="relative flex w-[min(100%,320px)] shrink-0 snap-start flex-col gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-6 pt-8 shadow-md ring-1 ring-slate-100 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 dark:ring-slate-800">
      <span className="absolute left-5 top-4 font-serif text-5xl leading-none text-primary-200/90 dark:text-primary-900/50" aria-hidden>
        &ldquo;
      </span>
      <div className="flex gap-0.5" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg key={index} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <blockquote className="relative text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}>
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function StepDeviceMock({ step }: { step: "01" | "02" | "03" }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-500/15 via-violet-500/10 to-emerald-500/15 blur-2xl" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="ml-2 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            resumedoctor.in/{step === "01" ? "templates" : step === "02" ? "try" : "dashboard"}
          </div>
        </div>
        <div className="space-y-3 p-5 sm:p-6">
          {step === "01" ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`aspect-[3/4] rounded-md border p-1 ${
                    index === 1
                      ? "border-primary-400 bg-primary-50 ring-2 ring-primary-300 dark:border-primary-600 dark:bg-primary-950/40"
                      : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80"
                  }`}
                >
                  <div className="h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                </div>
              ))}
            </div>
          ) : null}
          {step === "02" ? (
            <div className="space-y-2">
              <div className="rounded-lg border border-violet-200 bg-violet-50/80 p-3 dark:border-violet-800/50 dark:bg-violet-950/30">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-violet-700 dark:text-violet-300">
                  <LandingIcon path={LANDING_ICON_PATHS.sparkle} size={12} />
                  AI drafting bullets
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-violet-200/80 dark:bg-violet-800/60" />
                  <div className="h-1.5 w-5/6 rounded-full bg-violet-200/60 dark:bg-violet-800/40" />
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
                Drop PDF or DOCX to import
              </div>
            </div>
          ) : null}
          {step === "03" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800/40 dark:bg-emerald-950/30">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">resume.pdf</span>
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">PDF</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">resumedoctor.in/r/you</span>
                <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">Link</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
