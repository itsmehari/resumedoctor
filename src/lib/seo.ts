/**
 * Centralized SEO config – used for metadataBase, default OG/Twitter, and JSON-LD.
 * Production: use NEXT_PUBLIC_APP_URL (https) or VERCEL_URL.
 * Local: falls back to resumedoctor.in for canonical URLs.
 */
function getSiteUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && (appUrl.startsWith("https://") || appUrl.startsWith("http://"))) return appUrl;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://resumedoctor.in";
}
export const siteUrl = getSiteUrl();

export const siteName = "ResumeDoctor";

export const defaultTitle = "ResumeDoctor – Professional Resume & CV Builder | India";
export const defaultDescription =
  "Create ATS-friendly resumes and CVs in minutes. India-first resume builder with premium templates. Try quickly with OTP, then export to PDF & Word on Pro — trusted by job seekers across Naukri, LinkedIn, Indeed.";
