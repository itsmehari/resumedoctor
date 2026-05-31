/**
 * Google Ads purchase conversion — fires once per browser session on /payment/success.
 *
 * In Google Ads: create a conversion action → "Website" → thank-you URL:
 *   https://www.resumedoctor.in/payment/success
 * Copy the conversion label into NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO (AW-xxx/label).
 */
import { GOOGLE_ADS_ID } from "@/components/google-tag-head";

const PURCHASE_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO?.trim() ||
  `${GOOGLE_ADS_ID}/default`;

const SESSION_KEY = "rd_gads_purchase_conversion_fired";

export function reportGoogleAdsPurchaseConversion(options?: {
  value?: number;
  currency?: string;
  transactionId?: string;
}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;

  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return false;
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // sessionStorage blocked — still attempt the conversion
  }

  window.gtag("event", "conversion", {
    send_to: PURCHASE_SEND_TO,
    value: options?.value ?? 49,
    currency: options?.currency ?? "INR",
    transaction_id: options?.transactionId ?? `trial14_${Date.now()}`,
  });

  return true;
}
