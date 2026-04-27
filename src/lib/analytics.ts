// Pixel & ad tracking – analytics wrapper (consent-aware)
// Phases 1–4: GA4, Meta, LinkedIn, UTM

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _linkedin_partner_id?: string;
  }
}

const CONSENT_KEY = "rd_analytics_consent";

export type ConsentStatus = "accepted" | "rejected" | "pending";

export function getConsent(): ConsentStatus {
  if (typeof window === "undefined") return "pending";
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "accepted" || v === "rejected") return v;
  return "pending";
}

export function setConsent(status: "accepted" | "rejected"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, status);
}

export function hasConsent(): boolean {
  return getConsent() === "accepted";
}

/** Parse UTM params from URL */
export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
    const v = params.get(k);
    if (v) utm[k] = v;
  });
  return utm;
}

/** Merge UTM into event params */
export function withUtm(params: Record<string, unknown> = {}): Record<string, unknown> {
  const utm = getUtmParams();
  if (Object.keys(utm).length === 0) return params;
  return { ...params, ...utm };
}

/** GA4 event */
export function trackEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !hasConsent()) return;
  const merged = withUtm(params);
  if (window.gtag) {
    window.gtag("event", name, merged);
  }
}

/** GA4 page view */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === "undefined" || !hasConsent()) return;
  if (window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-K4VS43PF7T", {
      page_path: path,
      page_title: title,
    });
  }
}

/** Meta (Facebook) event */
export function trackMetaEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !hasConsent() || !window.fbq) return;
  window.fbq("track", eventName, params);
}

/** Meta custom event */
export function trackMetaCustom(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !hasConsent() || !window.fbq) return;
  window.fbq("trackCustom", eventName, params);
}

/** LinkedIn conversion */
export function trackLinkedInConversion(): void {
  if (typeof window === "undefined" || !hasConsent()) return;
  if (window._linkedin_partner_id && (window as unknown as { lintrk?: (a: unknown, b: unknown) => void }).lintrk) {
    (window as unknown as { lintrk: (a: unknown, b: unknown) => void }).lintrk("track", { conversion_id: 0 });
  }
}

/** Canonical funnel event names for business KPI governance */
export const FUNNEL_EVENTS = {
  try_started: "trial_start",
  resume_created: "resume_created",
  export_click_pdf_upgrade: "upgrade_click",
  superprofile_checkout_click: "superprofile_checkout_click",
  superprofile_checkout_cancelled: "superprofile_checkout_cancelled",
  payment_success: "payment_success",
} as const;
