import { render } from "../../../test-utils";
import { QuestionList } from "@/app/components/questionnaires/QuestionList";
import { TQuestionAny } from "@/app/questionnaires/types";

describe("QuestionList", () => {
  const mockQuestions: { [key: string]: TQuestionAny } = {
    "1": {
      questionId: "1",
      userPromptType: "text",
      userPromptText: "First question",
      userResponseType: "free-text-255",
    },
    "2": {
      questionId: "2",
      userPromptType: "text",
      userPromptText: "Second question",
      userResponseType: "one-of-4",
      choices: [
        { labelText: "Option A", value: "A" },
        { labelText: "Option B", value: "B" },
      ],
    },
  } as any; // Testing doesn't like the shape of this object

  it("renders list of questions from redux store", () => {
    const { getByText } = render(<QuestionList />, {
      preloadedState: {
        userResponseUI: {
          questionMap: mockQuestions,
          draftResponses: {},
          isEditing: false,
        },
      },
    });

    expect(getByText("First question")).toBeInTheDocument();
    expect(getByText("Second question")).toBeInTheDocument();
  });

  it("renders empty when no questions in store", () => {
    const { container } = render(<QuestionList />, {
      preloadedState: {
        userResponseUI: {
          questionMap: {},
          draftResponses: {},
          isEditing: false,
        },
      },
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
