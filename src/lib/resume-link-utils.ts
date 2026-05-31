/** Pre-filled WhatsApp share for India job seekers. */
export function buildWhatsAppShareUrl(resumeUrl: string): string {
  const text = `Hi! Here is my resume — always up to date:\n${resumeUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export const FREE_LINK_SLUG_EXAMPLE = "xK9m2pQw";
export const PRO_LINK_SLUG_EXAMPLE = "your-name";
