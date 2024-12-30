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

  it("renders list of questions from redux store", () => {
    const preloadedState = {
      userResponseUI: {
        questionMap: mockQuestions,
        draftResponses: {},
        isEditing: false,
      },
    };

    const { getByText } = render(<QuestionList />, { preloadedState });

    expect(getByText("First question")).toBeInTheDocument();
    expect(getByText("Second question")).toBeInTheDocument();
  });

  it("renders empty when no questions in store", () => {
    const preloadedState = {
      userResponseUI: {
        questionMap: {},
        draftResponses: {},
        isEditing: false,
      },
    };

    const { container } = render(<QuestionList />, { preloadedState });

    expect(container.firstChild).toMatchSnapshot();
  });
});

` You want to read what it did`;
