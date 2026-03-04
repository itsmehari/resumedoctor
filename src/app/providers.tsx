"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ConsentProvider } from "@/contexts/consent-context";
import { ToastProvider } from "@/contexts/toast-context";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { ConsentBanner } from "@/components/consent-banner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ConsentProvider>
          <ToastProvider>
            {children}
            <AnalyticsProvider />
            <ConsentBanner />
          </ToastProvider>
        </ConsentProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
