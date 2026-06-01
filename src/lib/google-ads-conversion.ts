/**
 * Google Ads "Page view" conversion on /payment/success (SuperProfile redirect).
 *
 * Event snippet from Google Ads:
 *   gtag('event', 'conversion', {'send_to': 'AW-18199694938/94gZCLbZ2rYcENqcpeZD'});
 */
export const GOOGLE_ADS_PURCHASE_CONVERSION_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO?.trim() ||
  "AW-18199694938/94gZCLbZ2rYcENqcpeZD";

const SESSION_KEY = "rd_gads_purchase_conversion_fired";

/** Fires the Page view conversion once per browser session. Retries until gtag is ready. */
export function reportGoogleAdsPurchaseConversion(options?: {
  transactionId?: string;
}): void {
  if (typeof window === "undefined") return;

  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
  } catch {
    // sessionStorage blocked
  }

  const fire = () => {
    if (typeof window.gtag !== "function") return false;

    const payload: Record<string, string> = {
      send_to: GOOGLE_ADS_PURCHASE_CONVERSION_SEND_TO,
    };
    if (options?.transactionId) {
      payload.transaction_id = options.transactionId;
    }

    window.gtag("event", "conversion", payload);

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    return true;
  };

  if (fire()) return;

  let attempts = 0;
  const id = window.setInterval(() => {
    attempts += 1;
    if (fire() || attempts >= 20) {
      window.clearInterval(id);
    }
  }, 250);
}
