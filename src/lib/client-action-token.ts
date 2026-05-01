/**
 * Read secret action tokens from the URL hash (preferred; not sent to servers as Referer)
 * or from the query string (legacy links).
 */
export function getActionTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  const fromHash = /(?:^|&)token=([^&]+)/.exec(hash);
  if (fromHash?.[1]) {
    try {
      return decodeURIComponent(fromHash[1]);
    } catch {
      return fromHash[1];
    }
  }
  return new URLSearchParams(window.location.search).get("token");
}
