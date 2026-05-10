"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Fires once per page load when analytics consent allows. */
export function FeaturesPageAnalytics() {
  useEffect(() => {
    trackEvent("features_view");
  }, []);
  return null;
}
