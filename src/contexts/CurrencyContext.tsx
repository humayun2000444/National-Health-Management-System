"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Currency, getCurrency, formatCurrency as formatCurrencyUtil, DEFAULT_CURRENCY } from "@/lib/currency";

interface CurrencyContextType {
  currency: Currency;
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  formatCurrency: (amount: number | string | null | undefined, options?: { showCode?: boolean; compact?: boolean }) => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<string>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);

  // Fetch currency setting from hospital settings on mount
  useEffect(() => {
    const fetchCurrencySetting = async () => {
      try {
        const response = await fetch("/api/hospital/info");
        if (response.ok) {
          const data = await response.json();
          if (data.settings?.currency) {
            setCurrencyCodeState(data.settings.currency);
          }
        }
      } catch (error) {
        console.error("Failed to fetch currency setting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencySetting();
  }, []);

  const setCurrencyCode = useCallback((code: string) => {
    setCurrencyCodeState(code);
  }, []);

  const formatCurrency = useCallback(
    (amount: number | string | null | undefined, options?: { showCode?: boolean; compact?: boolean }) => {
      return formatCurrencyUtil(amount, currencyCode, options);
    },
    [currencyCode]
  );

  const currency = getCurrency(currencyCode);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyCode,
        setCurrencyCode,
        formatCurrency,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

// Hook for server-side or non-context usage
export function useFormatCurrency(currencyCode: string = DEFAULT_CURRENCY) {
  return useCallback(
    (amount: number | string | null | undefined, options?: { showCode?: boolean; compact?: boolean }) => {
      return formatCurrencyUtil(amount, currencyCode, options);
    },
    [currencyCode]
  );
}
