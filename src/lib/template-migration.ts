// WBS 4.6 – Template versioning & migration for legacy templates
import type { ResumeContent } from "@/types/resume";
import { getTemplate } from "./templates";
import { resolveTemplateId } from "./templates";

/**
 * Migrate resume content for template version changes.
 * When a template has a new version, run migration here.
 * @param content - Resume content from DB
 * @param templateId - Current template ID (resolved from legacy aliases)
 * @returns Migrated content
 */
export function migrateResumeContent(
  content: ResumeContent,
  templateId: string
): ResumeContent {
  if (!content || typeof content !== "object") {
    return { sections: [], meta: {} };
  }

  const resolved = resolveTemplateId(templateId);
  const template = getTemplate(resolved);
  const currentVersion = template?.version ?? "1";

  const meta = content.meta ?? {};
  const existingVersion = meta.templateVersion ?? "1";

  // Future: when template v2 exists, add migration steps
  // if (existingVersion === "1" && currentVersion === "2") {
  //   return migrateV1ToV2(content);
  // }

  // Ensure meta has templateVersion for tracking
  const migratedMeta = {
    ...meta,
    templateVersion: currentVersion,
  };

  return {
    ...content,
    sections: content.sections ?? [],
    meta: migratedMeta,
  };
}
