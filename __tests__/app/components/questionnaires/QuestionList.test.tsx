import { render } from "../../../test-utils";
import { QuestionList } from "@/app/components/questionnaires/QuestionList";
import { TQuestionAny } from "@/app/questionnaires/types";

describe("QuestionList", () => {
  const mockQuestions = {
    "1": {
      questionId: "1",
      userPromptType: "text",
      userPromptText: "First question",
      userResponseType: "free-text-255",
      userResponseHistory: [],
    },
    "2": {
      questionId: "2",
      userPromptType: "text",
      userPromptText: "Second question",
      userResponseType: "one-of-4",
      userResponseHistory: [],
      choices: [
        { labelText: "Option A", value: "A" },
        { labelText: "Option B", value: "B" },
      ],
    },
  };

  const basePreloadedState = {
    userResponseUI: {
      questionMap: mockQuestions,
      draftResponses: {},
      isEditing: false,
    },
    questionFilter: {
      showSkipped: false,
      tagFilter: "",
    },
  };

  it("renders list of questions from redux store", () => {
    const { getByText } = render(<QuestionList />, {
      preloadedState: basePreloadedState,
    });
    expect(getByText("First question")).toBeInTheDocument();
    expect(getByText("Second question")).toBeInTheDocument();
  });

  it("renders empty when no questions in store", () => {
    const preloadedState = {
      ...basePreloadedState,
      userResponseUI: {
        ...basePreloadedState.userResponseUI,
        questionMap: {},
      },
    };

    const { container } = render(<QuestionList />, { preloadedState });
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders nothing when questionMap is undefined", () => {
    const preloadedState = {
      ...basePreloadedState,
      userResponseUI: {
        ...basePreloadedState.userResponseUI,
        questionMap: undefined,
      },
    };

    const { container } = render(<QuestionList />, { preloadedState } as any);
    expect(container.firstChild).toBeDefined();
    expect(container.firstChild?.childNodes.length).toBe(1); // Just the AdvancedQuestionSortFilter
  });
});
