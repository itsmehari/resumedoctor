import { DEMO_RESUME_CONTENT, type ResumeContent } from "@/types/resume";

export const DEMO_PUBLIC_RESUME_SLUG = "demo";

export function isDemoPublicResumeSlug(slug: string): boolean {
  return slug.trim().toLowerCase() === DEMO_PUBLIC_RESUME_SLUG;
}

export function getDemoPublicResume() {
  return {
    title: "Demo Resume — Priya Sharma",
    templateId: "professional-in",
    content: DEMO_RESUME_CONTENT as ResumeContent,
    updatedAt: new Date(),
  };
}
