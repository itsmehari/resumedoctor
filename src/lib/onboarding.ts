import { prisma } from "@/lib/prisma";
import { parseResumeContent, computeResumeProgress } from "@/lib/resume-utils";

export type OnboardingStepKey =
  | "template_chosen"
  | "section_filled"
  | "ats_run"
  | "export_done";

export type OnboardingChecklistState = Record<OnboardingStepKey, boolean>;

const ONBOARDING_STEP_KEYS: OnboardingStepKey[] = [
  "template_chosen",
  "section_filled",
  "ats_run",
  "export_done",
];

const DEFAULT_STATE: OnboardingChecklistState = {
  template_chosen: false,
  section_filled: false,
  ats_run: false,
  export_done: false,
};

function mergeChecklist(
  detected: OnboardingChecklistState,
  manual: Partial<OnboardingChecklistState> | null | undefined
): OnboardingChecklistState {
  if (!manual) return detected;
  return {
    template_chosen: Boolean(manual.template_chosen) || detected.template_chosen,
    section_filled: Boolean(manual.section_filled) || detected.section_filled,
    ats_run: Boolean(manual.ats_run) || detected.ats_run,
    export_done: Boolean(manual.export_done) || detected.export_done,
  };
}

/** Parse stored JSON: step overrides plus optional UI flag (not a checklist step). */
export function parseOnboardingChecklistJson(raw: unknown): {
  manualSteps: Partial<OnboardingChecklistState> | null;
  hideGettingStarted: boolean;
} {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { manualSteps: null, hideGettingStarted: false };
  }
  const o = raw as Record<string, unknown>;
  const hideGettingStarted = o.hideGettingStarted === true;
  const manualSteps: Partial<OnboardingChecklistState> = {};
  for (const k of ONBOARDING_STEP_KEYS) {
    if (o[k] === true) manualSteps[k] = true;
  }
  return {
    manualSteps: Object.keys(manualSteps).length ? manualSteps : null,
    hideGettingStarted,
  };
}

/** Server-detected onboarding progress from resumes, ATS, and exports. */
export async function detectOnboardingState(userId: string): Promise<OnboardingChecklistState> {
  const state = { ...DEFAULT_STATE };

  const [resumeCount, exportCount, atsCount] = await Promise.all([
    prisma.resume.count({ where: { userId } }),
    prisma.exportLog.count({ where: { userId } }),
    prisma.featureUsageLog.count({ where: { userId, feature: "ats" } }),
  ]);

  if (resumeCount > 0) {
    state.template_chosen = true;
  }
  if (exportCount > 0) {
    state.export_done = true;
  }
  if (atsCount > 0) {
    state.ats_run = true;
  }

  if (resumeCount > 0) {
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { content: true },
    });
    if (resume?.content) {
      try {
        const parsed = parseResumeContent(resume.content);
        state.section_filled = computeResumeProgress(parsed.sections) >= 30;
      } catch {
        state.section_filled = false;
      }
    }
  }

  return state;
}

export async function getMergedOnboardingForUser(userId: string): Promise<{
  steps: OnboardingChecklistState;
  completedAt: Date | null;
  checklistHidden: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingChecklist: true, onboardingCompletedAt: true },
  });

  const { manualSteps, hideGettingStarted } = parseOnboardingChecklistJson(user?.onboardingChecklist);
  const detected = await detectOnboardingState(userId);
  const steps = mergeChecklist(detected, manualSteps);

  return {
    steps,
    completedAt: user?.onboardingCompletedAt ?? null,
    checklistHidden: hideGettingStarted,
  };
}
