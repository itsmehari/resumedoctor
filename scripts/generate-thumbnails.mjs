#!/usr/bin/env node
/**
 * WBS 4.8b – Generate template preview thumbnails
 * Usage: Ensure dev server is running (npm run dev), then: npm run thumbnails
 * Saves PNGs to public/templates/thumbnails/{templateId}.png
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "public", "templates", "thumbnails");
const BASE_URL = process.env.THUMBNAIL_BASE_URL || "http://localhost:3000";

// Template IDs from lib/templates (keep in sync)
const TEMPLATE_IDS = [
  "professional-in", "cascade", "concept", "crisp", "cubic", "diamond", "enfold", "influx",
  "minimal-in", "minimo", "ats-minimal", "ats-strict", "nanica", "modern", "skill-based", "hybrid",
  "fresher-in", "student", "muse", "combined",
  "midcareer-in", "executive", "executive-modern", "tech", "it", "iconic",
  "creative-in", "initials", "traditional", "general",
];

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Viewport sized for A4-ish preview
  await page.setViewportSize({ width: 800, height: 1132 });

  for (const id of TEMPLATE_IDS) {
    const url = `${BASE_URL}/dev/preview/${id}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForSelector("[data-template-id]", { timeout: 5000 });
      // Wait for fonts/content to settle
      await page.waitForTimeout(500);
      const el = await page.locator(".bg-white.shadow-lg").first();
      const buffer = await el.screenshot({ type: "png" });
      const outPath = join(OUTPUT_DIR, `${id}.png`);
      writeFileSync(outPath, buffer);
      console.log(`✓ ${id}`);
    } catch (err) {
      console.error(`✗ ${id}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`Done. Thumbnails in ${OUTPUT_DIR}`);
}

main().catch(console.error);
