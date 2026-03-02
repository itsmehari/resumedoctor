"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getConsent, setConsent as setConsentStorage, type ConsentStatus } from "@/lib/analytics";

interface ConsentContextValue {
  consent: ConsentStatus;
  accept: () => void;
  reject: () => void;
  hasConsent: boolean;
  isPending: boolean;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    return {
      consent: "pending" as ConsentStatus,
      accept: () => {},
      reject: () => {},
      hasConsent: false,
      isPending: true,
    };
  }
  return ctx;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentStatus>("pending");

  useEffect(() => {
    setConsentState(getConsent());
  }, []);

  const accept = useCallback(() => {
    setConsentStorage("accepted");
    setConsentState("accepted");
  }, []);

  const reject = useCallback(() => {
    setConsentStorage("rejected");
    setConsentState("rejected");
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        accept,
        reject,
        hasConsent: consent === "accepted",
        isPending: consent === "pending",
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
