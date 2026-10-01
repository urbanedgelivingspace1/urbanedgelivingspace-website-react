import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations, SUPPORTED_LANGUAGES } from "./translations";

const STORAGE_KEY = "urbanedge-language";
const DEFAULT_LANGUAGE = "en";

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key) => key,
  languages: SUPPORTED_LANGUAGES,
});

function getInitialLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return SUPPORTED_LANGUAGES.some((item) => item.code === stored)
    ? stored
    : DEFAULT_LANGUAGE;
}

function readTranslation(language, key) {
  return key.split(".").reduce((value, segment) => value?.[segment], translations[language]);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t: (key) =>
        readTranslation(language, key) ??
        readTranslation(DEFAULT_LANGUAGE, key) ??
        key,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
