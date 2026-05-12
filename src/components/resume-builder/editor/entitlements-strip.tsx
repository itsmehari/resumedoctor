"use client";

import { TRIAL_ENTITLEMENTS_COPY } from "@/lib/resume-editor-progress";

interface Props {
  isPro: boolean;
  isTrial: boolean;
}

export function EntitlementsStrip({ isPro, isTrial }: Props) {
  if (isPro && !isTrial) return null;
  return (
    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
      {TRIAL_ENTITLEMENTS_COPY}
    </p>
  );
}
