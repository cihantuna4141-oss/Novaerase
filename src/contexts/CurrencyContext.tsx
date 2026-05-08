"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

export const CURRENCY_METADATA = {
  GHS: { label: "Ghana Cedi", symbol: "₵" },
  USD: { label: "US Dollar", symbol: "$" },
  GBP: { label: "Pounds Sterling", symbol: "£" },
  EUR: { label: "Euro", symbol: "€" },
  CAD: { label: "Canadian Dollar", symbol: "CA$" },
  ZAR: { label: "South African Rand", symbol: "R" },
  NGN: { label: "Nigerian Naira", symbol: "₦" },
  XOF: { label: "West African CFA", symbol: "CFA" },
  XAF: { label: "Central African CFA", symbol: "FCFA" },
};

const FALLBACK_RATES: Record<string, number> = {
  GHS: 1,
  USD: 0.065,
  GBP: 0.051,
  EUR: 0.06,
  CAD: 0.088,
  ZAR: 1.22,
  NGN: 98.5,
  XOF: 39.45,
  XAF: 39.45,
};

type CurrencyCode = keyof typeof CURRENCY_METADATA;

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (priceGHS: number) => string;
  symbol: string;
  isLoading: boolean;
  rates: Record<string, number>; 
  refresh: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>("GHS");
  // Ensure rates is initialized with Fallback immediately to prevent "undefined" errors
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchLiveRates = useCallback(async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/GHS");
      const data = await response.json();
      if (data && data.rates) {
        setRates(data.rates);
      }
    } catch (error) {
      console.error("Using fallback rates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchLiveRates();

    const saved = localStorage.getItem("preferred-currency") as CurrencyCode;
    if (saved && CURRENCY_METADATA[saved]) {
      setCurrencyState(saved);
    }

    const interval = setInterval(fetchLiveRates, 3600000);
    return () => clearInterval(interval);
  }, [fetchLiveRates]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("preferred-currency", code);
  };

  const convertPrice = (priceGHS: number) => {
    const rate = rates[currency] || FALLBACK_RATES[currency] || 1;
    const converted = priceGHS * rate;
    return converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Prevent hydration mismatch by not rendering anything during SSR
  if (!mounted) return null;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        symbol: CURRENCY_METADATA[currency].symbol,
        isLoading,
        rates, 
        refresh: fetchLiveRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
};