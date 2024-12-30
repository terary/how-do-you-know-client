import "@testing-library/jest-dom";
import "whatwg-fetch";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

// Initialize i18next for tests
i18next.use(initReactI18next).init({
  lng: "en", // default language
  fallbackLng: "en",
  ns: ["common"],
  defaultNS: "common",
  resources: {
    en: {
      common: {
        "questionnaires.changeAnswer": "Change Answer",
        "questionnaires.cancelEdit": "Cancel Edit",
        "singleword.save": "Save",
        "singleword.show": "Show",
        "singleword.hide": "Hide",
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});
