import { render, screen } from "../../../test-utils";
import { UserResponse } from "@/app/components/questionnaires/UserResponse";
import type { TQuestionAny } from "@/app/questionnaires/types";

describe("UserResponse", () => {
  it("renders free-text-255 response type correctly", () => {
    const question: TQuestionAny = {
      questionId: "1",
      userPromptType: "text",
      userPromptText: "Sample question",
      userResponseType: "free-text-255",
      userResponseHistory: [],
      userResponse: {
        text: null,
      },
    };

    render(<UserResponse question={question} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders one-of-4 response type correctly", () => {
    const question: TQuestionAny = {
      questionId: "2",
      userPromptType: "text",
      userPromptText: "Sample question",
      userResponseType: "one-of-4",
      userResponseHistory: [],
      validAnswers: [],
      answerFodderId: "123",
      userResponse: { value: null },
      choices: [
        { labelText: "Option A", value: "A" },
        { labelText: "Option B", value: "B" },
      ],
    };

    render(<UserResponse question={question} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders one-of-2 response type correctly", () => {
    const question: TQuestionAny = {
      questionId: "3",
      userPromptType: "text",
      userPromptText: "Sample question",
      userResponseType: "one-of-2",
      userResponseHistory: [],
      validAnswers: [
        // @ts-ignore - Type 'string' is not assignable to type 'boolean' (TQuestionUserResponseOneOf2 - typing issue)
        { labelText: "Yes", value: "true" },
        // @ts-ignore - Type 'string' is not assignable to type 'boolean' (TQuestionUserResponseOneOf2 - typing issue)
        { labelText: "No", value: "false" },
      ],
      choices: [
        { labelText: "Yes", value: "true" },
        { labelText: "No", value: "false" },
      ],
      userResponse: { value: null },
    };

    render(<UserResponse question={question} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getByLabelText("Yes")).toBeInTheDocument();
    expect(screen.getByLabelText("No")).toBeInTheDocument();
  });

  it("renders any-of response type correctly", () => {
    const question: TQuestionAny = {
      questionId: "4",
      userPromptType: "text",
      userPromptText: "Sample question",
      userResponseType: "any-of",
      userResponseHistory: [],
      validAnswers: [],
      choices: [
        { labelText: "Option A", value: "A" },
        { labelText: "Option B", value: "B" },
      ],
      userResponse: { values: null },
    };

    render(<UserResponse question={question} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(2);
  });

  it("renders error message for unsupported response type", () => {
    const question = {
      questionId: "5",
      userPromptType: "text",
      userPromptText: "Sample question",
      userResponseType: "unsupported-type",
      userResponseHistory: [],
    };

    render(<UserResponse question={question as any} />);
    expect(
      screen.getByText(/Unsupported response type: unsupported-type/)
    ).toBeInTheDocument();
  });
});
