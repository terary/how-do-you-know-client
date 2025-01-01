import { render, screen, fireEvent } from "../../../test-utils";
import { AdvancedQuestionSortFilter } from "@/app/components/questionnaires/AdvancedQuestionSortFilter";

// Mock i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        "questionnaire.filterAndSort": "Filter & Sort",
        "questionnaire.filterByTag": "Filter by Tag",
        "questionnaire.showSkipped": "Show Skipped",
        "questionnaire.showAll": "Show All",
        "questionnaire.clearAllMeta": "Clear All Meta",
        "singleword.apply": "Apply",
      };
      return translations[key] || key;
    },
  }),
}));

describe("AdvancedQuestionSortFilter", () => {
  const basePreloadedState = {
    questionFilter: {
      showSkipped: false,
      tagFilter: "",
    },
  };

  it("renders all filter controls", () => {
    render(<AdvancedQuestionSortFilter />, {
      preloadedState: basePreloadedState,
    });

    expect(screen.getByText("Filter & Sort")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Tag")).toBeInTheDocument();
  });

  it("updates tag filter as user types", () => {
    render(<AdvancedQuestionSortFilter />, {
      preloadedState: basePreloadedState,
    });

    const input = screen.getByLabelText("Filter by Tag");
    fireEvent.change(input, { target: { value: "test-tag" } });
    expect(input).toHaveValue("test-tag");
  });

  it("handles show skipped button click", () => {
    render(<AdvancedQuestionSortFilter />, {
      preloadedState: basePreloadedState,
    });

    const showSkippedButton = screen.getByText("questionnaire.unSkipQuestions");
    fireEvent.click(showSkippedButton);
  });

  it("handles clear all meta button click", () => {
    render(<AdvancedQuestionSortFilter />, {
      preloadedState: basePreloadedState,
    });

    const clearAllMetaButton = screen.getByText("singleword.reset");
    fireEvent.click(clearAllMetaButton);
  });

  it("maintains tag filter state", () => {
    render(<AdvancedQuestionSortFilter />, {
      preloadedState: basePreloadedState,
    });

    const input = screen.getByLabelText("Filter by Tag");
    fireEvent.change(input, { target: { value: "test-tag" } });
    expect(input).toHaveValue("test-tag");
  });
});
