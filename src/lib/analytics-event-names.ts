/** Canonical names for first-party ProductEvent + GA4 alignment */

export const AnalyticsEvents = {
  sign_up: "sign_up",
  /** Server: signup form was submitted (regardless of validation/email-send outcome). DB-backed funnel input independent of GA4. */
  signup_attempt: "signup_attempt",
  /** Server: trial OTP send-otp endpoint was hit (regardless of Resend outcome). */
  otp_request_attempt: "otp_request_attempt",
  resume_created: "resume_created",
  trial_start: "trial_start",
  checkout_started: "checkout_started",
  first_export: "first_export",
  payment_success: "payment_success",
  onboarding_step_completed: "onboarding_step_completed",
  /** User hid the dashboard getting-started checklist (not the same as completing steps). */
  onboarding_checklist_dismissed: "onboarding_checklist_dismissed",
  onboarding_completed: "onboarding_completed",
  churn_initiated: "churn_initiated",
  churn_completed: "churn_completed",
  /** Client GA4: user completed an ATS API check (teaser or full). */
  ats_check_completed: "ats_check_completed",
  /** Client GA4: pricing page rendered after region load. */
  pricing_view: "pricing_view",
  /** Client / upgrade CTAs — align with FUNNEL_EVENTS.export_click_pdf_upgrade */
  upgrade_click: "upgrade_click",
  superprofile_checkout_click: "superprofile_checkout_click",
  superprofile_checkout_cancelled: "superprofile_checkout_cancelled",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

/** Ordered list for admin dashboards and schema documentation */
export const DOCUMENTED_PRODUCT_EVENT_NAMES: readonly AnalyticsEventName[] = [
  AnalyticsEvents.sign_up,
  AnalyticsEvents.signup_attempt,
  AnalyticsEvents.otp_request_attempt,
  AnalyticsEvents.resume_created,
  AnalyticsEvents.trial_start,
  AnalyticsEvents.checkout_started,
  AnalyticsEvents.first_export,
  AnalyticsEvents.payment_success,
  AnalyticsEvents.onboarding_step_completed,
  AnalyticsEvents.onboarding_checklist_dismissed,
  AnalyticsEvents.onboarding_completed,
  AnalyticsEvents.churn_initiated,
  AnalyticsEvents.churn_completed,
  AnalyticsEvents.ats_check_completed,
  AnalyticsEvents.pricing_view,
  AnalyticsEvents.upgrade_click,
  AnalyticsEvents.superprofile_checkout_click,
  AnalyticsEvents.superprofile_checkout_cancelled,
] as const;

const documentedSet = new Set<string>(DOCUMENTED_PRODUCT_EVENT_NAMES);

/** True if name is a governed first-party event (client/server may still emit ad-hoc names). */
export function isDocumentedProductEventName(name: string): name is AnalyticsEventName {
  return documentedSet.has(name);
}
