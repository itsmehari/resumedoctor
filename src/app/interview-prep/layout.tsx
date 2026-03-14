import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Prep | ResumeDoctor",
  description: "Practice common interview questions with AI-generated answers.",
};

export default function InterviewPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
