import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ResumeDoctor – Professional Resume & CV Builder | India",
  description:
    "Create ATS-friendly resumes and CVs in minutes. India-first resume builder with premium templates and export to PDF.",
  keywords: ["resume builder", "CV maker", "ATS resume", "India", "job search"],
  openGraph: {
    title: "ResumeDoctor – Professional Resume & CV Builder",
    description: "Create ATS-friendly resumes in minutes. India-first.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Providers>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
