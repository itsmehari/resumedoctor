"use client";

import { useEffect } from "react";

const STEP_RE = /^Step\s+(\d+):\s*(.+)$/i;

/** Adds numbered badges to h2 headings that match "Step N: …" for scanability. */
export function BlogStepHeadingDecorator() {
  useEffect(() => {
    const root = document.getElementById("article-body");
    if (!root) return;

    const decorate = () => {
      root.querySelectorAll("h2").forEach((node) => {
        const h2 = node as HTMLHeadingElement;
        if (h2.dataset.stepDecorated === "1") return;
        const text = h2.textContent?.trim() ?? "";
        const m = STEP_RE.exec(text);
        if (!m) return;
        h2.dataset.stepDecorated = "1";
        h2.classList.add(
          "flex",
          "flex-wrap",
          "items-start",
          "gap-3",
          "gap-y-2",
          "!mt-14",
          "!mb-8",
          "!border-0",
          "!pb-0",
          "scroll-mt-32"
        );
        const badge = document.createElement("span");
        badge.className =
          "step-badge mt-0.5 flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl border border-primary-200 bg-primary-50 text-sm font-extrabold text-primary-700 shadow-sm dark:border-primary-800 dark:bg-primary-950/60 dark:text-primary-200";
        badge.textContent = m[1];
        badge.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.className = "min-w-0 flex-1 text-[1.375rem] font-extrabold leading-snug sm:text-[1.625rem]";
        label.textContent = m[2].trim();
        h2.textContent = "";
        h2.appendChild(badge);
        h2.appendChild(label);
      });
    };

    decorate();
    const mo = new MutationObserver(decorate);
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  return null;
}
