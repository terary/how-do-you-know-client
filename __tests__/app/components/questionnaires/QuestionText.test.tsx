import { render } from "@testing-library/react";
import { QuestionText } from "@/app/components/questionnaires/QuestionText";

describe("QuestionText", () => {
  it("renders question text correctly", () => {
    const question = {
      userPromptType: "text",
      userPromptText: "What is your favorite color?",
    };

    const { getByText } = render(
      <QuestionText question={question as any /* testing*/} />
    );
    expect(getByText("What is your favorite color?")).toBeInTheDocument();
  });

  it("applies correct styling", () => {
    const question = {
      userPromptType: "text",
      userPromptText: "Test question",
    };

    const { container } = render(
      <QuestionText question={question as any /* testing*/} />
    );
    const typography = container.firstChild;
    expect(typography).toHaveStyle({ padding: "1em 1em 2em 1em" });
  });
});
