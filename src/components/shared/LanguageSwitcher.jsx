import React from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <div className={`language-switcher ${className}`} aria-label="Language selection">
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          className={`language-switcher__option ${language === item.code ? "is-active" : ""}`}
          onClick={() => setLanguage(item.code)}
          aria-pressed={language === item.code}
          lang={item.code}
          title={item.label}
        >
          {item.shortLabel}
        </button>
      ))}
    </div>
  );
}
