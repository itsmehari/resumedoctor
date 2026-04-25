/** Canonical names for first-party ProductEvent + GA4 alignment */

export const AnalyticsEvents = {
  sign_up: "sign_up",
  resume_created: "resume_created",
  trial_start: "trial_start",
  checkout_started: "checkout_started",
  first_export: "first_export",
  payment_success: "payment_success",
  onboarding_step_completed: "onboarding_step_completed",
  onboarding_completed: "onboarding_completed",
  churn_initiated: "churn_initiated",
  churn_completed: "churn_completed",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
