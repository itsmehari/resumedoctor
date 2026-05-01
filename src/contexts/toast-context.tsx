"use client";

// WBS 6.8 – Toast for AI error handling
import React, { createContext, useCallback, useState } from "react";

export type ToastVariant = "error" | "success" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: { label: string; href?: string; onClick?: () => void };
}

interface ToastContextValue {
  toast: (message: string, options?: {
    variant?: ToastVariant;
    action?: { label: string; href?: string; onClick?: () => void };
  }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(
    (
      message: string,
      options?: {
        variant?: ToastVariant;
        action?: { label: string; href?: string; onClick?: () => void };
      }
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          variant: options?.variant ?? "error",
          action: options?.action,
        },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.variant === "error" ? "alert" : "status"}
            aria-live={t.variant === "error" ? undefined : "polite"}
            className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg ${
              t.variant === "error"
                ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/80 text-red-800 dark:text-red-200"
                : t.variant === "success"
                  ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/80 text-green-800 dark:text-green-200"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            }`}
          >
            <p className="text-sm flex-1">{t.message}</p>
            <div className="flex items-center gap-2">
              {t.action && (
                t.action.href ? (
                  <a
                    href={t.action.href}
                    className="text-xs font-medium underline hover:no-underline"
                  >
                    {t.action.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={t.action.onClick}
                    className="text-xs font-medium underline hover:no-underline"
                  >
                    {t.action.label}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 -mr-1 p-1"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return {
      toast: (msg: string) => console.warn("Toast (no provider):", msg),
    };
  }
  return ctx;
}
