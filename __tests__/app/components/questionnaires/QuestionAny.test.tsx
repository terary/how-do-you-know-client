import { render } from "@testing-library/react";
import { QuestionAny } from "@/app/components/questionnaires/QuestionAny";
import { TQuestionAny } from "@/app/questionnaires/types";

describe("QuestionAny", () => {
  it("renders text question correctly", () => {
    const question: TQuestionAny = {
      userPromptType: "text",
      userPromptText: "Sample question text",
      questionId: "123",
      userResponseType: "free-text-255",
    } as any; // Testing doesn't like the shape of this object

    const { getByText } = render(<QuestionAny question={question} />);
    expect(getByText("Sample question text")).toBeInTheDocument();
  });

  it("renders multimedia question correctly", () => {
    const question: TQuestionAny = {
      userPromptType: "multimedia",
      instructionText: "Watch this video",
      questionId: "123",
      userResponseType: "free-text-255",
      links: [
        {
          mediaContentType: "link/youtube",
          url: "https://youtube.com/embed/123",
          width: 560,
          height: 315,
          specialInstructionText: "Pay attention to the details",
        },
      ],
    };

    const { getByText } = render(<QuestionAny question={question} />);
    expect(getByText("Watch this video")).toBeInTheDocument();
    expect(getByText("Pay attention to the details")).toBeInTheDocument();
  });

  it("returns null for unknown prompt type", () => {
    const question = {
      userPromptType: "unknown",
      questionId: "123",
      userResponseType: "free-text-255",
    };

    const { container } = render(<QuestionAny question={question as any} />);
    expect(container.firstChild).toBeNull();
  });
});
