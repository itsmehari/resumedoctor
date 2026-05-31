import { siteUrl } from "@/lib/seo";

/** Canonical post-checkout path (SuperProfile redirect target). */
export const PAYMENT_SUCCESS_PATH = "/payment/success";

/** Full URL — paste into SuperProfile success redirect & Google Ads conversion page. */
export const PAYMENT_SUCCESS_URL = `${siteUrl}${PAYMENT_SUCCESS_PATH}`;
