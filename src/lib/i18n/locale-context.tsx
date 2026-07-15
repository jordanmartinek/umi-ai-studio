"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Dictionary, en, es } from "@/lib/i18n/dictionaries";

export type Locale = "en" | "es";

const DICTIONARIES: Record<Locale, Dictionary> = { en, es };
const LOCALE_KEY = "umi.locale.v1";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LOCALE_KEY);
  return stored === "es" ? "es" : "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Hydrate from localStorage once on mount (client-only preference).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(readStoredLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_KEY, next);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dict: DICTIONARIES[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
