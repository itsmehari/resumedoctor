/**
 * Google Ads purchase conversion — fire on /payment/success only.
 * Set NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO to "AW-xxx/label" from Google Ads.
 */
import { GOOGLE_ADS_ID } from "@/components/google-tag-head";

const PURCHASE_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO?.trim() ||
  `${GOOGLE_ADS_ID}/default`;

export function reportGoogleAdsPurchaseConversion(options?: {
  value?: number;
  currency?: string;
}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", {
    send_to: PURCHASE_SEND_TO,
    value: options?.value ?? 49,
    currency: options?.currency ?? "INR",
    transaction_id: `trial14_${Date.now()}`,
  });
}
