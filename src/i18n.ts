import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Language resources
import enTranslations from "./locales/en.json";
import taTranslations from "./locales/ta.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  ta: {
    translation: taTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

// Keep HTML lang attribute in sync for locale-specific styling/typography
if (typeof document !== "undefined") {
  const applyHtmlLang = () => {
    const currentLang = i18n.language || "en";
    document.documentElement.setAttribute("lang", currentLang);
  };

  applyHtmlLang();
  i18n.on("languageChanged", () => applyHtmlLang());
}

export default i18n;
