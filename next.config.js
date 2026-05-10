// WBS 13.6 – Next.js config with Sentry error tracking + security headers
const { withSentryConfig } = require("@sentry/nextjs");

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "unpdf", "pdf2json", "pdfjs-serverless"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Control referrer info
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy – disable unused browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // HSTS (only in production; 1 year, include subdomains)
          ...(isProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]
            : []),
          // Content-Security-Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + Next.js inline scripts + Sentry + GA
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://browser.sentry-cdn.com",
              // Styles: self + inline (Tailwind CSS-in-JS)
              "style-src 'self' 'unsafe-inline'",
              // Images: self + data URIs + external avatars/OG
              "img-src 'self' data: blob: https: http:",
              // Fonts: self
              "font-src 'self' data:",
              // API connections
              "connect-src 'self' https://api.openai.com https://api.groq.com https://api.zeptomail.com https://api.zeptomail.in https://*.sentry.io https://www.google-analytics.com",
              // Frame ancestors: deny all (reinforces X-Frame-Options)
              "frame-ancestors 'none'",
              // Forms: self only
              "form-action 'self'",
              // Base URI: self only
              "base-uri 'self'",
              // Embedded video (blog guides)
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.loom.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async redirects() {
    // Block /dev/* in production
    return isProd
      ? [
          {
            source: "/dev/:path*",
            destination: "/",
            permanent: false,
          },
        ]
      : [];
  },
};

// Only wrap with Sentry build plugin when org + project are set (e.g. Vercel / CI with secrets).
// Empty secrets in GitHub Actions become "" and trigger "missing organization slug" — skip plugin then.
// Runtime Sentry still works via sentry.*.config.ts when NEXT_PUBLIC_SENTRY_DSN is set on the host.
const sentryOrg = process.env.SENTRY_ORG?.trim();
const sentryProject = process.env.SENTRY_PROJECT?.trim();
const useSentryWebpackPlugin = Boolean(sentryOrg && sentryProject);

module.exports = useSentryWebpackPlugin
  ? withSentryConfig(nextConfig, {
      org: sentryOrg,
      project: sentryProject,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    })
  : nextConfig;
