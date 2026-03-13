"use client";

// Phase 2 – India-specific: Naukri/Indeed apply tips
import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

const NAUKRI_TIPS = [
  "Naukri's ATS scans for job titles and skills—include keywords from the job description",
  "Keep your profile updated on Naukri when you change your resume—recruiters search the database",
  "Use standard section headers: Work Experience, Education, Skills (avoid creative names)",
  "Add location—many recruiters filter by city",
];

const INDEED_TIPS = [
  "Indeed parses dates—use consistent format (e.g. Jan 2022 – Present)",
  "Skills matter: add relevant keywords that match the job posting",
  "Keep bullet points concise; long paragraphs can be truncated",
];

export function IndiaTipsPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary-600" />
          <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
            India job portals tips
          </span>
        </div>
        <span className="text-slate-400 text-sm">{expanded ? "▼" : "▶"}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-3">
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
              Naukri
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {NAUKRI_TIPS.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary-500 flex-shrink-0">•</span>
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="https://www.naukri.com/mnjuser/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 hover:underline"
            >
              Update Naukri profile <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
              Indeed India
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {INDEED_TIPS.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary-500 flex-shrink-0">•</span>
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="https://in.indeed.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 hover:underline"
            >
              Indeed India <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Also apply on: Internshala, Shine, TimesJobs, Foundit (formerly Monster)
          </p>
        </div>
      )}
    </div>
  );
}
