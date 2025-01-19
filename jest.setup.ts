import "@testing-library/jest-dom";
import "whatwg-fetch";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock auth hook
jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      id: "test-user-id",
      email: "test@example.com",
      roles: ["ADMIN", "INSTRUCTOR", "PROCTOR"],
    },
  }),
}));

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
        "learningInstitutions.title": "Learning Institutions",
        "learningInstitutions.addInstitution": "Add Institution",
        "learningInstitutions.loadError": "Error loading institutions",
        "learningInstitutions.deleteSuccess":
          "Institution deleted successfully",
        "learningInstitutions.deleteError": "Error deleting institution",
        "Loading...": "Loading...",
        "Error loading institutions": "Error loading institutions",
        "Learning Institutions": "Learning Institutions",
        "Add Institution": "Add Institution",
        Website: "Website",
        Email: "Email",
        Phone: "Phone",
        Address: "Address",
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});
