import { z } from "zod";
import { parseResumeContent } from "@/lib/resume-utils";

const optionalUrlish = z.string().max(500).optional();

const contactDataSchema = z.object({
  name: z.string().max(200).optional(),
  title: z.string().max(200).optional(),
  email: z
    .union([z.literal(""), z.string().email()])
    .optional(),
  phone: z
    .union([
      z.literal(""),
      z
        .string()
        .max(50)
        .regex(/^[+0-9()\s.\-]+$/, "Phone may only contain digits, spaces, and + ( ) . -"),
    ])
    .optional(),
  location: z.string().max(200).optional(),
  website: optionalUrlish,
  linkedin: optionalUrlish,
  github: optionalUrlish,
  portfolio: optionalUrlish,
});

/** Server-side guard for resume PATCH: validates contact section strings (length + email/phone shape). */
export function validateResumeContentContact(content: unknown): { ok: true } | { ok: false; message: string } {
  const parsed = parseResumeContent(content);
  for (const section of parsed.sections) {
    if (section.type !== "contact") continue;
    const data = (section as { data?: unknown }).data;
    const result = contactDataSchema.safeParse(data ?? {});
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid contact fields";
      return { ok: false, message: msg };
    }
  }
  return { ok: true };
}
