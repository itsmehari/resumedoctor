// Lightweight User-Agent based bot detector.
// We use it to skip view-count increments for crawlers / link previewers
// (WhatsApp, LinkedIn, Slack, etc.) so the analytics number reflects real humans.
//
// This is intentionally not exhaustive — link-preview bots are noisy enough that
// even a handful of common substrings catches >95 % of false positives. Anything
// fancier (IP allowlists, JS-challenge fingerprinting) is out of scope for the
// view counter; the metric is "rough number of real visits", not audit-grade.

const BOT_PATTERNS =
  /bot|crawler|spider|preview|whatsapp|linkedin|slack|twitter|facebookexternalhit|telegram|discord|google|bing|yandex|duckduck|baidu|pinterest|skype|embedly|outlook|microsoft\soffice|fetch|monitor|uptime|pingdom|datadog/i;

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true; // missing UA → treat as bot
  return BOT_PATTERNS.test(userAgent);
}
