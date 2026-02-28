// WBS 3.1 – Resume content helpers
import type { ResumeContent } from "@/types/resume";

export function generateSectionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function parseResumeContent(content: unknown): ResumeContent {
  if (!content || typeof content !== "object") {
    return { sections: [] };
  }
  const obj = content as Record<string, unknown>;
  const sections = Array.isArray(obj.sections) ? obj.sections : [];
  return {
    sections: sections.filter(
      (s): s is ResumeContent["sections"][number] =>
        s && typeof s === "object" && "id" in s && "type" in s
    ),
  };
}
