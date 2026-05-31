"use client";

// Phase 1.3 – Shareable resume link button
// Pro Link – adds vanity URL, view analytics, WhatsApp share, QR download, first-copy upsell
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Share2, Copy, Check, Eye, Sparkles, Lock, MessageCircle, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { buildWhatsAppShareUrl } from "@/lib/resume-link-utils";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/contexts/toast-context";

interface ShareResumeButtonProps {
  resumeId: string;
  disabled?: boolean;
  autoOpen?: boolean;
}

interface ShareInfo {
  url: string;
  slug: string;
  vanitySlug: string | null;
  viewCount: number;
  lastViewedAt: string | null;
  proLinkActive: boolean;
}

interface AvailabilityState {
  state: "idle" | "checking" | "ok" | "error" | "current";
  message?: string;
}

function formatRelative(iso: string | null): string {
  if (!iso) return "never";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "never";
  const diffMs = Date.now() - d;
  const sec = Math.round(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const month = Math.round(day / 30);
  if (month < 12) return `${month}mo ago`;
  return `${Math.round(month / 12)}y ago`;
}

export function ShareResumeButton({ resumeId, disabled, autoOpen }: ShareResumeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<ShareInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCopyUpsell, setShowCopyUpsell] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [vanityInput, setVanityInput] = useState("");
  const [availability, setAvailability] = useState<AvailabilityState>({ state: "idle" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoOpenedRef = useRef(false);

  const loadShareLink = async () => {
    setLoading(true);
    setOpen(true);
    setInfo(null);
    setEditing(false);
    setShowCopyUpsell(false);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/share`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setInfo({
        url: data.url,
        slug: data.slug,
        vanitySlug: data.vanitySlug ?? null,
        viewCount: data.viewCount ?? 0,
        lastViewedAt: data.lastViewedAt ?? null,
        proLinkActive: data.proLinkActive === true,
      });
      setVanityInput(data.vanitySlug ?? "");
    } catch {
      toast("Failed to get share link", { variant: "error" });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    void loadShareLink();
  };

  useEffect(() => {
    if (!autoOpen || disabled || autoOpenedRef.current) return;
    autoOpenedRef.current = true;
    void loadShareLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when autoOpen is set
  }, [autoOpen, disabled]);

  useEffect(() => {
    if (!autoOpen || !disabled) return;
    toast("Publish your link from Share once your session is active.", { variant: "error" });
  }, [autoOpen, disabled, toast]);

  useEffect(() => {
    if (!info?.url) {
      setQrDataUrl(null);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(info.url, { width: 280, margin: 2, color: { dark: "#0f172a", light: "#ffffff" } })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [info?.url]);

  const handleCopy = async () => {
    if (!info?.url) return;
    try {
      await navigator.clipboard.writeText(info.url);
      setCopied(true);
      toast("Link copied to clipboard", { variant: "success" });
      trackEvent("resume_link_copy", { resume_id: resumeId, pro_link: info.proLinkActive });
      if (!info.proLinkActive) setShowCopyUpsell(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", { variant: "error" });
    }
  };

  const handleWhatsAppShare = () => {
    if (!info?.url) return;
    trackEvent("resume_link_whatsapp_share", { resume_id: resumeId });
    window.open(buildWhatsAppShareUrl(info.url), "_blank", "noopener,noreferrer");
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl || !info) return;
    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `resume-link-${info.slug}.png`;
    anchor.click();
    trackEvent("resume_link_qr_download", { resume_id: resumeId, pro_link: info.proLinkActive });
    toast("QR code downloaded", { variant: "success" });
  };

  // Debounced availability check while typing.
  useEffect(() => {
    if (!editing) return;
    if (!vanityInput || vanityInput.length < 3) {
      setAvailability({ state: "idle" });
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setAvailability({ state: "checking" });
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/resumes/${resumeId}/vanity-slug?check=${encodeURIComponent(vanityInput)}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) {
          setAvailability({ state: "error", message: data.error || "Check failed" });
          return;
        }
        if (data.available && data.current) {
          setAvailability({ state: "current", message: "This is your current URL." });
        } else if (data.available) {
          setAvailability({ state: "ok" });
        } else {
          setAvailability({ state: "error", message: data.message || "Not available" });
        }
      } catch {
        setAvailability({ state: "error", message: "Check failed" });
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [vanityInput, editing, resumeId]);

  const handleSaveVanity = async () => {
    if (!info) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/vanity-slug`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vanitySlug: vanityInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "PRO_LINK_REQUIRED") {
          toast("Custom URLs are part of Pro Link.", { variant: "error" });
        } else {
          toast(data.message || data.error || "Failed to update URL", { variant: "error" });
        }
        return;
      }
      setInfo({ ...info, url: data.url, vanitySlug: data.slug });
      setEditing(false);
      toast("Custom URL set", { variant: "success" });
    } catch {
      toast("Failed to update URL", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-[min(24rem,calc(100vw-2rem))] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-3 sm:left-auto sm:translate-x-0">
            {loading ? (
              <p className="text-sm text-slate-500">Generating link...</p>
            ) : info ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Share link (anyone can view)
                  </p>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={info.url}
                      className="flex-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-2 py-1.5 text-sm text-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-50 px-2 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700/50 dark:bg-emerald-950/30 dark:text-emerald-200"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    disabled={!qrDataUrl}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    Download QR
                  </button>
                </div>

                {qrDataUrl ? (
                  <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt="QR code for your resume link"
                      width={72}
                      height={72}
                      className="rounded border border-slate-200 bg-white p-1 dark:border-slate-600"
                    />
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Scan on campus drives and networking events. Download for print-ready PNG.
                    </p>
                  </div>
                ) : null}

                {showCopyUpsell && !info.proLinkActive ? (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-800/50 dark:bg-amber-950/30">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                      Want resumedoctor.in/r/your-name instead?
                    </p>
                    <p className="mt-1 text-[11px] text-amber-800/90 dark:text-amber-200/80">
                      Pro Link adds a custom URL, view analytics, and removes the footer on your public page.
                    </p>
                    <Link
                      href="/pricing#pro-link"
                      className="mt-2 inline-flex text-[11px] font-bold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      Upgrade to Pro Link — ₹99/mo →
                    </Link>
                  </div>
                ) : null}

                {/* ── Pro Link: vanity URL editor or upgrade teaser ───────── */}
                <div className="rounded-md border border-slate-200 dark:border-slate-700 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <Sparkles className="h-3.5 w-3.5 text-primary-500" aria-hidden />
                      Custom URL
                    </span>
                    {info.proLinkActive ? (
                      !editing ? (
                        <button
                          type="button"
                          onClick={() => setEditing(true)}
                          className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          {info.vanitySlug ? "Edit" : "Set custom URL"}
                        </button>
                      ) : null
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                        <Lock className="h-3 w-3" aria-hidden />
                        Pro Link
                      </span>
                    )}
                  </div>

                  {info.proLinkActive ? (
                    editing ? (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-2 py-1.5">
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            /r/
                          </span>
                          <input
                            autoFocus
                            value={vanityInput}
                            onChange={(e) => setVanityInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                            placeholder="hari-krishnan"
                            maxLength={30}
                            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none font-mono"
                          />
                        </div>
                        <p className="min-h-[1.1rem] text-[11px]">
                          {availability.state === "checking" && (
                            <span className="text-slate-500">Checking…</span>
                          )}
                          {availability.state === "ok" && (
                            <span className="text-emerald-600 dark:text-emerald-400">Available.</span>
                          )}
                          {availability.state === "current" && (
                            <span className="text-slate-500">{availability.message}</span>
                          )}
                          {availability.state === "error" && (
                            <span className="text-red-600 dark:text-red-400">{availability.message}</span>
                          )}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSaveVanity}
                            disabled={
                              saving ||
                              availability.state === "checking" ||
                              availability.state === "error" ||
                              !vanityInput
                            }
                            className="rounded bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                          >
                            {saving ? "Saving…" : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(false);
                              setVanityInput(info.vanitySlug ?? "");
                              setAvailability({ state: "idle" });
                            }}
                            className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {info.vanitySlug
                          ? `Currently /r/${info.vanitySlug}. The legacy /r/${info.slug} URL still works.`
                          : "Replace the random URL with your name — e.g. /r/hari-krishnan."}
                      </p>
                    )
                  ) : (
                    <div className="mt-1.5 space-y-1.5">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Make your URL match your name and remove the ResumeDoctor footer.
                      </p>
                      <Link
                        href="/pricing#pro-link"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        Upgrade to Pro Link →
                      </Link>
                    </div>
                  )}
                </div>

                {/* ── Pro Link: view analytics or upgrade teaser ──────────── */}
                <div className="rounded-md border border-slate-200 dark:border-slate-700 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <Eye className="h-3.5 w-3.5 text-primary-500" aria-hidden />
                      Views
                    </span>
                    {!info.proLinkActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                        <Lock className="h-3 w-3" aria-hidden />
                        Pro Link
                      </span>
                    )}
                  </div>
                  {info.proLinkActive ? (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {info.viewCount.toLocaleString()}
                      </span>{" "}
                      total {info.viewCount === 1 ? "view" : "views"}
                      {info.lastViewedAt && (
                        <>
                          <span className="text-slate-400"> · </span>
                          last viewed {formatRelative(info.lastViewedAt)}
                        </>
                      )}
                    </p>
                  ) : (
                    <div className="mt-1.5 space-y-1.5">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        See when recruiters open your link.
                      </p>
                      <Link
                        href="/pricing#pro-link"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        Upgrade to Pro Link →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
