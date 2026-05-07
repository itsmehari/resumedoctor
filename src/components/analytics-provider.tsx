"use client";

// Phase 1, 3: Load GA4 + Meta + LinkedIn + Clarity only when consent given; track page views
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useConsent } from "@/contexts/consent-context";
import { trackPageView } from "@/lib/analytics";
import Clarity from "@microsoft/clarity";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-WDPGFYERFD";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const LINKEDIN_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "vw2ci97dos";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const { hasConsent } = useConsent();
  const clarityInited = useRef(false);

  useEffect(() => {
    if (hasConsent && pathname) {
      trackPageView(pathname);
    }
  }, [hasConsent, pathname]);

  useEffect(() => {
    if (!hasConsent || clarityInited.current) return;
    clarityInited.current = true;
    Clarity.init(CLARITY_ID);
    Clarity.consentV2({
      ad_Storage: "granted",
      analytics_Storage: "granted",
    });
  }, [hasConsent]);

  if (!hasConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
      {LINKEDIN_ID && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "${LINKEDIN_ID}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `}
        </Script>
      )}
      {LINKEDIN_ID && (
        <Script
          src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
