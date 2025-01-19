import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: "en", // default language
    fallbackLng: "en",
    supportedLngs: ["en", "es", "th", "ar", "ar-MA"],
    defaultNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false,
    },
    debug: true, // Enable debug mode to see missing keys
    load: "languageOnly", // Load only the language without region code
    fallbackNS: "common", // Use common namespace as fallback
    returnNull: false, // Return key instead of null for missing translations
    returnEmptyString: false, // Return key instead of empty string
  });

export default i18next;
