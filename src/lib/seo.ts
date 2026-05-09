/**
 * Centralized SEO config – used for metadataBase, default OG/Twitter, JSON-LD,
 * and (critically) any user-facing link we email out (verification, password
 * reset, share links). Never compose those URLs against `localhost`.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_APP_URL` (preferred – set this on Vercel Production).
 *   2. `VERCEL_URL` (preview deploys – Vercel injects this automatically).
 *   3. Hardcoded production fallback `https://resumedoctor.in` so a missing
 *      env never produces unclickable `localhost` links in transactional email.
 */
function getSiteUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && (appUrl.startsWith("https://") || appUrl.startsWith("http://"))) return appUrl;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[seo] NEXT_PUBLIC_APP_URL is not set in production – falling back to https://resumedoctor.in. Set it in Vercel → Settings → Environment Variables."
    );
  }
  return "https://resumedoctor.in";
}
export const siteUrl = getSiteUrl();

export const siteName = "ResumeDoctor";

export const defaultTitle = "ResumeDoctor – Professional Resume & CV Builder | India";
export const defaultDescription =
  "Create ATS-friendly resumes and CVs in minutes. India-first resume builder with premium templates. Try quickly with OTP, then export to PDF & Word on Pro — trusted by job seekers across Naukri, LinkedIn, Indeed.";
