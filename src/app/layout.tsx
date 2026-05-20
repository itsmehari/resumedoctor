import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/footer";
import { siteUrl, siteName, defaultTitle, defaultDescription } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${siteName}` },
  description: defaultDescription,
  keywords: ["resume builder", "CV maker", "ATS resume", "India", "job search", "resume templates", "resume try flow"],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: defaultTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased flex flex-col min-h-screen overflow-x-hidden`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-700 focus:shadow-lg dark:focus:bg-slate-900 dark:focus:text-primary-300"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
