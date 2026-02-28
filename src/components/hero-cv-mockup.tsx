"use client";

/**
 * A simplified CV mockup for the hero section - inspired by Zety-style preview.
 */
export function HeroCVMockup() {
  return (
    <div className="relative">
      {/* Decorative golden blob — Zety-style */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-25"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle, rgba(255, 185, 0, 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative rounded-xl border border-white/20 bg-white shadow-2xl shadow-black/25 overflow-hidden max-w-sm mx-auto">
        {/* CV header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary-600">
                AK
              </span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Anika Kumar
              </h3>
              <p className="text-xs text-slate-500">Software Engineer</p>
            </div>
          </div>
        </div>

        {/* Skills section with dots */}
        <div className="p-4">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
            Skills
          </h4>
          <div className="space-y-1.5">
            {["React", "TypeScript", "Node.js"].map((skill, i) => (
              <div key={skill} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 w-16">
                  {skill}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className={`w-1.5 h-2 rounded-sm ${
                        j < (i === 0 ? 5 : i === 1 ? 4 : 3)
                          ? "bg-primary-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work history */}
        <div className="p-4 pt-0">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
            Work History
          </h4>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                Senior Developer
              </p>
              <p className="text-[10px] text-slate-500">2021 – Present</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                Junior Developer
              </p>
              <p className="text-[10px] text-slate-500">2018 – 2021</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
